import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import agentRouter from "./routes/agent.route.js";
import chatRouter from "./routes/chat.route.js";
import connetDB from "./config/db.config.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

connetDB();


app.use("/api/auth", authRouter);
app.use("/api/agent", agentRouter);
app.use("/api/ai", chatRouter);
export default app;
