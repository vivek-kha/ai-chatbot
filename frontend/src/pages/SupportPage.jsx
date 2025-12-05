import React from "react";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

export default function SupportPage() {
  const { user } = useAuth();
  return (
    <div className="support-page">
      <div className="support-hero">
        <div>
          <h1>AI Customer Support</h1>
          <p>Ask questions, get instant help. {user ? `Logged in as ${user.email}` : "Login or sign up to save your history."}</p>
        </div>
      </div>
      <ChatWindow />
    </div>
  );
}
