import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;

export const LLM_PROVIDER = process.env.LLM_PROVIDER || "openai_or_groq";
export const LLM_BASE_URL = process.env.LLM_BASE_URL || undefined;
export const LLM_MODEL = process.env.LLM_MODEL || "gpt-3.5-turbo";

export const GROQ_API_KEY = process.env.GROQ_API_KEY || undefined;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || undefined;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is required in environment variables");
}


