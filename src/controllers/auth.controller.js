import SessionModel from "../models/Session.model.js";
import {
  createUserService,
  loginService,
  getMeService,
  refreshTokenService,
} from "../services/auth.service.js";
import { generateAccessToken } from "../utils/generateAccessToken.util.js";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const user = await createUserService({ userName, email, password });

    return res.status(200).json({
      success: true,
      message: "User register successfully!",
      data: user,
    });
  } catch (err) {
    console.log("REGISTER API ERROR :", err);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginService({ email, password });

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const session = await SessionModel.create({
        user:user._id,
        ip:req.ip,
        userAgent:req.headers["user-agent"],
        refreshTokenHash:user.refreshTokenHash
        
    })

    const accessToken = await generateAccessToken({userId:user._id,sessionId:session._id})

    return res.status(200).json({
      success: true,
      message: "user logged in successfully!",
      data: accessToken,
    });
  } catch (err) {
    console.log("LOGIN API ERROR : ", err);
    res.status(500).json({
      message: "Failed to login",
      success: false,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user;
    const user = await getMeService({ userId });

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log("GET ME API ERROR : ", err);
    res.status(500).json({
      message: "Failed to get user details",
      success: false,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const tokens = await refreshTokenService({ refreshToken });

    res.cookie("refreshToken", tokens.newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    console.log("REFRESH TOKEN API ERROR : ", err);
    res.status(500).json({
      success: false,
      message: "Failed to refresh access token",
    });
  }
};

