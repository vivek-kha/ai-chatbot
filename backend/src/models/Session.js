import mongoose from "mongoose";
import { messageSchema } from "./Message.js";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userEmail: String,
    userName: String,
    status: {
      type: String,
      enum: ["active", "escalated", "closed"],
      default: "active",
    },
    messages: [messageSchema],
    lastUserQuestion: String,
    escalationNote: String,   // summary for human agent
  },
  { timestamps: true }
);

// Indexes for faster lookups
sessionSchema.index({ sessionId: 1 }, { unique: true });
sessionSchema.index({ status: 1 });
sessionSchema.index({ createdAt: -1 });
sessionSchema.index({ user: 1 });

export default mongoose.model("Session", sessionSchema);
