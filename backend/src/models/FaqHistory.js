import mongoose from "mongoose";

const FaqHistorySchema = new mongoose.Schema(
  {
    faqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faq",
      required: true,
      index: true,
    },
    snapshot: {
      type: Object,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const FaqHistory = mongoose.model("FaqHistory", FaqHistorySchema);
export default FaqHistory;


