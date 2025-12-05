import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chatRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// CORS locked to configured origin with credentials support
const allowedOrigins = (process.env.CORS_ORIGIN ||
  "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow mobile/CLI/tools with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Rate limiting to protect API from abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/", limiter);

app.use("/api/chat", chatRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Centralized error handler
app.use((err, req, res, _next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
