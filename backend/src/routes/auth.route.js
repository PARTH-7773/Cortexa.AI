import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.get("/health", (req, res) => {
  return res.json({ success: true, message: "All good.." });
});

authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);

export default authRouter;
