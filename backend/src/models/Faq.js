import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [String],
    category: { type: String, default: "general" },
    published: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Indexes to improve search relevance
faqSchema.index({ question: "text", answer: "text" });
faqSchema.index({ tags: 1 });

export default mongoose.model("Faq", faqSchema);
