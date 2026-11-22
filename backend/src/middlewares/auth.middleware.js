import jwt from "jsonwebtoken";
import config from "../config/ENV.config.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById({ _id: decoded.userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erron in auth Middleware",
      error,
    });
  }
};

export default authMiddleware;
