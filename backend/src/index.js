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

app.use(cors({
  origin: ["https://cortexa-dev.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());

connectDB().catch((err) => {
  console.error("Initial DB connect failed:", err.message);
});


app.use("/api/auth", authRouter);
app.use("/api/agent", agentRouter);
app.use("/api/ai", chatRouter);
export default app;