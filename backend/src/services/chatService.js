import Session from "../models/Session.js";
import { findRelevantFaqs } from "./faqService.js";
import {
  generateSupportResponse,
  summariseConversationForEscalation,
} from "./llmService.js";
import { v4 as uuidv4 } from "uuid";

export async function createSession() {
  const id = uuidv4();
  const session = await Session.create({ sessionId: id });
  return { sessionId: session.sessionId };
}

export async function getSession(sessionId) {
  if (!sessionId) return null;
  return Session.findOne({ sessionId });
}

export async function handleIncomingMessage({ sessionId, message }) {
  let session = await Session.findOne({ sessionId });

  // Auto-create session if missing
  if (!session) {
    const id = sessionId || uuidv4();
    session = await Session.create({ sessionId: id });
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

  // ESCALATION RULE (simplistic)
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

  const suggestedNextActions = escalated
    ? ["Wait for a human agent to respond", "Provide additional details if requested"]
    : ["Ask a follow-up question", "Rate this answer (if UI supports rating)"];

  return {
    sessionId: session.sessionId,
    reply: llmReply,
    escalated,
    suggestedNextActions,
    status: session.status,
  };
}

export async function saveFeedback({ sessionId, feedback }) {
  const session = await Session.findOne({ sessionId });
  if (!session) {
    const err = new Error("Session not found");
    err.statusCode = 404;
    throw err;
  }

  const messages = session.messages;
  let lastAssistant = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      lastAssistant = messages[i];
      break;
    }
  }

  if (!lastAssistant) {
    const err = new Error("No assistant message to attach feedback to");
    err.statusCode = 400;
    throw err;
  }

  lastAssistant.meta = {
    ...(lastAssistant.meta || {}),
    feedback,
  };

  await session.save();
}


