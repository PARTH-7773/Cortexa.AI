import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/ENV.config.js";
import app from "../config/firebase.js";

const login = async (req, res) => {
  try {
    const { token: firebaseToken } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }
    const decoded = await getAuth(app).verifyIdToken(firebaseToken);

    const user = await User.findOneAndUpdate(
      {
        firebaseUId: decoded.uid,
      },
      {
        $set: {
          name: decoded.name,
          email: decoded.email,
          profilePicture: decoded.picture,
        },
        $setOnInsert: {
          firebaseUId: decoded.uid,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "3d" },
    );

    await res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Successfull..",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erron in login controller",
      error,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successfull..",
      user: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erron in Logout controller",
      error,
    });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Getting the user profile.",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erron in GetMe controller",
      error,
    });
  }
};

export default { login, logout, getMe };
