import React from "react";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`msg-row ${isUser ? "right" : "left"}`}>
      {!isUser && <div className="avatar bot-avatar">AI</div>}
      {isUser && <div className="avatar user-avatar">You</div>}
      <div className={`msg ${isUser ? "user" : "bot"}`}>
        <span>{message.content}</span>
      </div>
    </div>
  );
}

