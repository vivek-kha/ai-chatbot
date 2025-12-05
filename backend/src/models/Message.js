import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    meta: { type: Object }, // e.g. { source: "faq" | "llm" | "escalation" }
  },
  { timestamps: true }
);

