import express from "express";
import { body, validationResult } from "express-validator";
import Session from "../models/Session.js";
import { findRelevantFaqs } from "../services/faqService.js";
import {
  generateSupportResponse,
  summariseConversationForEscalation,
} from "../services/llmService.js";
import { v4 as uuidv4 } from "uuid";
import { authOptional } from "../middleware/authOptional.js";

const router = express.Router();

const validateChatRequest = [
  body("sessionId").optional().isUUID().withMessage("Invalid sessionId format"),
  body("message")
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message must be 1-2000 characters"),
];

const validateFeedbackRequest = [
  body("sessionId").isUUID().withMessage("sessionId is required and must be a UUID"),
  body("feedback")
    .isIn(["up", "down"])
    .withMessage("feedback must be either 'up' or 'down'"),
];

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

// 1. Create new session
router.post("/session", authOptional, async (req, res) => {
  try {
    const id = uuidv4();
    const sessionData = { sessionId: id };
    if (req.user) {
      sessionData.user = req.user.id;
      sessionData.userEmail = req.user.email;
      sessionData.userName = req.body?.userName;
    }
    const session = await Session.create(sessionData);
    return res.json({ sessionId: session.sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// 2. Get existing session
router.get("/session/:sessionId", authOptional, async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Attach user if token provided and session missing user
    if (req.user && !session.user) {
      session.user = req.user.id;
      session.userEmail = req.user.email;
      await session.save();
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

// 3. Chat endpoint
router.post("/", authOptional, validateChatRequest, async (req, res) => {
  const validationResponse = handleValidation(req, res);
  if (validationResponse) return validationResponse;

  const { sessionId, message } = req.body;

  try {
    let session = await Session.findOne({ sessionId });

    // If no sessionId, auto-create one
    if (!session) {
      const id = sessionId || uuidv4();
      const sessionData = { sessionId: id };
      if (req.user) {
        sessionData.user = req.user.id;
        sessionData.userEmail = req.user.email;
      }
      session = await Session.create(sessionData);
    } else if (req.user && !session.user) {
      session.user = req.user.id;
      session.userEmail = req.user.email;
    }

    // Save user message
    session.messages.push({ role: "user", content: message });
    session.lastUserQuestion = message;
    await session.save();

    // 1. find relevant FAQs
    const faqs = await findRelevantFaqs(message);

    // 2. Build short conversation context (last N messages)
    const recentConversation = session.messages.slice(-6); // last 6 messages

    // 3. Call LLM
    const llmReply = await generateSupportResponse({
      conversation: recentConversation,
      faqs,
      userMessage: message,
    });

    // ESCALATION RULE (simplistic):
    // if the model says "escalate" or "I cannot help" → mark escalated
    const lower = llmReply.toLowerCase();
    let escalated = false;

    if (
      lower.includes("escalate") ||
      lower.includes("human agent") ||
      lower.includes("support representative") ||
      lower.includes("cannot help") ||
      lower.includes("can't help")
    ) {
      escalated = true;

      const summary = await summariseConversationForEscalation({
        conversation: session.messages,
      });

      session.status = "escalated";
      session.escalationNote = summary;
    }

    // Save assistant reply
    session.messages.push({
      role: "assistant",
      content: llmReply,
      meta: { source: "llm", escalated },
    });

    await session.save();

    // ask LLM for next actions (optional)
    // For simplicity, we'll derive simple suggestions here:
    const suggestedNextActions = escalated
      ? ["Wait for a human agent to respond", "Provide additional details if requested"]
      : ["Ask a follow-up question", "Rate this answer (if UI supports rating)"];

    return res.json({
      sessionId: session.sessionId,
      reply: llmReply,
      escalated,
      suggestedNextActions,
      status: session.status,
    });
  } catch (err) {
    console.error("Chat error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    
    // Send more detailed error to frontend
    const errorMessage = err.message || "Something went wrong";
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
});

// 4. Feedback endpoint - save feedback on last assistant message
router.post("/feedback", validateFeedbackRequest, async (req, res) => {
  const validationResponse = handleValidation(req, res);
  if (validationResponse) return validationResponse;

  const { sessionId, feedback } = req.body; // feedback: "up" | "down"

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Find last assistant message
    const messages = session.messages;
    let lastAssistant = null;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        lastAssistant = messages[i];
        break;
      }
    }

    if (!lastAssistant) {
      return res.status(400).json({ error: "No assistant message to attach feedback to" });
    }

    lastAssistant.meta = {
      ...(lastAssistant.meta || {}),
      feedback,
    };

    await session.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({ error: "Failed to save feedback" });
  }
});

export default router;
