import { useEffect, useRef, useState } from "react";
import { createSession, sendMessage, sendFeedback, getSession } from "../api/chatApi";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow() {
  const { user, token } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [lastBotFeedback, setLastBotFeedback] = useState(null); // "up" | "down" | null
  const bottomRef = useRef(null);

  useEffect(() => {
    (async () => {
      const savedSessionId = localStorage.getItem("chatSessionId");

      try {
        if (savedSessionId) {
          const session = await getSession(savedSessionId, token);
          setSessionId(savedSessionId);
          setMessages(session.messages || []);
          if (session.status === "escalated") {
            setEscalated(true);
          }
          return;
        }
      } catch (error) {
        console.warn("Failed to load saved session, creating a new one.", error);
      }

      try {
        const { sessionId: newSessionId } = await createSession(token, user?.name);
        setSessionId(newSessionId);
        localStorage.setItem("chatSessionId", newSessionId);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    })();
  }, [token, user?.name]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("chatSessionId", sessionId);
    }
  }, [sessionId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setLoading(true);

    try {
      const res = await sendMessage(sessionId, currentInput, token);
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
        content: `Sorry, something went wrong: ${error.message}. Please check the console for details.` 
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLastFailedMessage(currentInput);
    } finally {
      setLoading(false);
    }
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

  const handleRetry = () => {
    if (!lastFailedMessage || !sessionId || loading) return;
    setInput(lastFailedMessage);
    // Call handleSend on next tick so input state is updated
    setTimeout(() => {
      handleSend();
    }, 0);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Customer Support</h2>
        {sessionId && <span className="session-id">Session: {sessionId.substring(0, 8)}...</span>}
        {escalated && (
          <div className="escalation-badge">
            ⚠️ Escalated to human agent
          </div>
        )}
      </div>

      <div
        className="chat-body"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && (
          <div className="welcome-message">
            Welcome! How can I help you today?
          </div>
        )}
        {messages.map((m, idx) => (
          <MessageBubble key={idx} message={m} />
        ))}
        {loading && <div className="msg bot typing">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your question..."
          autoFocus
          aria-label="Type your message"
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
          disabled={loading || escalated}
        />
        <button
          onClick={handleSend}
          disabled={loading || escalated}
          aria-label={loading || escalated ? "Send disabled" : "Send message"}
        >
          Send
        </button>
      </div>

      {lastFailedMessage && !loading && !escalated && (
        <div className="retry-bar" aria-live="polite">
          <span className="retry-text">
            Last message failed to send.
          </span>
          <button
            type="button"
            className="retry-button"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      )}

      {/* Feedback section for last bot reply */}
      {!loading && !escalated && messages.some((m) => m.role === "assistant") && (
        <div className="feedback-bar" aria-label="Feedback on last answer">
          <span className="feedback-text">Was this answer helpful?</span>
          <div className="feedback-buttons" role="group" aria-label="Answer feedback">
            <button
              type="button"
              className={`feedback-button ${lastBotFeedback === "up" ? "active up" : "up"}`}
              onClick={() => handleFeedback("up")}
              aria-pressed={lastBotFeedback === "up"}
            >
              👍
            </button>
            <button
              type="button"
              className={`feedback-button ${lastBotFeedback === "down" ? "active down" : "down"}`}
              onClick={() => handleFeedback("down")}
              aria-pressed={lastBotFeedback === "down"}
            >
              👎
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
