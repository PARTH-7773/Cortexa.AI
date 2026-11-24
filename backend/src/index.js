import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import agentRouter from "./routes/agent.route.js";
import chatRouter from "./routes/chat.route.js";
import connectDB from "./config/db.config.js";

const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({
    ok: false,
    message: err.message || "Internal Server Error",
  });
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://cortexaai-git-main-parth-7773s-projects.vercel.app",
  "https://cortexaai-gamma.vercel.app",
  "https://cortexa-qqevjj7kw-parth-7773s-projects.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl/server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

connectDB().catch((err) => {
  console.error("Initial DB connect failed:", err.message);
});


app.use("/api/auth", authRouter);
app.use("/api/agent", agentRouter);
app.use("/api/ai", chatRouter);
export default app;
