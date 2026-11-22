import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import chatController from "../controllers/chat.controller.js";
const chatRouter = express.Router();

chatRouter.post("/chat", authMiddleware, chatController.chat);

export default chatRouter;
