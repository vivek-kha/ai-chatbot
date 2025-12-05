import React from "react";

export default function ChatInput({ value, onChange, onSend, loading, escalated }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !escalated) {
      onSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask your question..."
        autoFocus
        aria-label="Type your message"
        onKeyDown={handleKeyDown}
        disabled={loading || escalated}
      />
      <button
        onClick={onSend}
        disabled={loading || escalated}
        aria-label={loading || escalated ? "Send disabled" : "Send message"}
      >
        Send
      </button>
    </div>
  );
}


