import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Check environment variables
console.log("🔍 Checking environment variables...");
console.log("PORT:", PORT);
console.log("MONGO_URI:", MONGO_URI ? "✅ Set" : "❌ Missing");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅ Set" : "❌ Missing");
console.log("LLM_MODEL:", process.env.LLM_MODEL || "gpt-3.5-turbo (default)");
console.log("LLM_BASE_URL:", process.env.LLM_BASE_URL || "Not set (using default)");

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set in .env file!");
  process.exit(1);
}

connectDB(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  });
