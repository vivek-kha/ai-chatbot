import { useEffect, useState } from "react";
import { createSession, sendMessage, sendFeedback } from "../api/chatApi";

export function useChatSession() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); // { role, content }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [lastBotFeedback, setLastBotFeedback] = useState(null); // "up" | "down" | null

  // Create session on mount
  useEffect(() => {
    (async () => {
      try {
        const { sessionId } = await createSession();
        setSessionId(sessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    })();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setLoading(true);

    try {
      const res = await sendMessage(sessionId, currentInput);
      const botMsg = { role: "assistant", content: res.reply };
      setMessages((prev) => [...prev, botMsg]);
      // Clear input only after successful send
      setInput("");
      setLastFailedMessage(null);
      setLastBotFeedback(null); // reset feedback for new answer

      if (res.escalated) {
        setEscalated(true);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg = {
        role: "assistant",
        content: `Sorry, something went wrong: ${error.message}. Please check the console for details.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLastFailedMessage(currentInput);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (!lastFailedMessage || !sessionId || loading) return;
    setInput(lastFailedMessage);
    // Call handleSend on next tick so input state is updated
    setTimeout(() => {
      handleSend();
    }, 0);
  };

  const handleFeedback = async (value) => {
    if (!sessionId) return;
    setLastBotFeedback(value);
    try {
      await sendFeedback(sessionId, value);
    } catch (error) {
      console.error("Failed to save feedback:", error);
    }
  };

  return {
    sessionId,
    messages,
    input,
    setInput,
    loading,
    escalated,
    lastFailedMessage,
    lastBotFeedback,
    handleSend,
    handleRetry,
    handleFeedback,
  };
}


