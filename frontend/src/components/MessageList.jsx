import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, loading }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages or loading state change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
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
  );
}


