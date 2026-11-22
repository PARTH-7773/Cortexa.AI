import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import agentController from "../controllers/agent.controller.js";

const agentRouter = express.Router();

agentRouter.post("/create", authMiddleware, agentController.createAgent);
agentRouter.get("/all", authMiddleware, agentController.getAllAgent);
agentRouter.get("/:id", authMiddleware, agentController.getAgentById);
agentRouter.delete("/:id", authMiddleware, agentController.deleteAgent);

export default agentRouter;
