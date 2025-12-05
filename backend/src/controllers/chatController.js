import * as chatService from "../services/chatService.js";

export async function createSession(req, res, next) {
  try {
    const result = await chatService.createSession();
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const session = await chatService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    return res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { sessionId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const result = await chatService.handleIncomingMessage({ sessionId, message });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function sendFeedback(req, res, next) {
  try {
    const { sessionId, feedback } = req.body;

    if (!sessionId || !feedback) {
      return res.status(400).json({ error: "sessionId and feedback are required" });
    }

    await chatService.saveFeedback({ sessionId, feedback });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


