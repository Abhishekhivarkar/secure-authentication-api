import { config } from "../configs/env.js";
import SessionModel from "../models/Session.model.js";
import {
  createUserService,
  loginService,
  getMeService,
  refreshTokenService,
  logoutService,
  logoutAllService,
} from "../services/auth.service.js";
import { generateAccessToken } from "../utils/generateAccessToken.util.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
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
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to register user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    const user = await loginService({ email, password });

    const session = new SessionModel({
      user: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    
    const refreshToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      config.JWT_SECRET,
      { expiresIn: "7d" }
    );

   
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    session.refreshTokenHash = refreshTokenHash;
    await session.save();


    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

 
    const accessToken = await generateAccessToken({ userId: user._id, sessionId: session._id });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: accessToken
    });

  } catch (err) {
    console.log("LOGIN API ERROR : ", err);
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to login",
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
    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to get user details",
      success: false,
    });
  }
};


// export const refreshToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;

//     const tokens = await refreshTokenService({ refreshToken });

//     res.cookie("refreshToken", tokens.newRefreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Access token refreshed successfully",
//       accessToken: tokens.accessToken,
//     });
//   } catch (err) {
//     console.log("REFRESH TOKEN API ERROR : ", err);
//     res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Failed to refresh access token",
//     });
//   }
// };

export const refreshToken = async (req,res) =>{
  try{
    const refreshToken = req.cookies?.refreshToken

    const token = await refreshTokenService({refreshToken})
    
    const accessToken = jwt.sign(
      {id:token.userId},
      config.JWT_SECRET,
      {"expiresIn":"15m"}
    )

    const newRefreshToken = jwt.sign(
      {id:token.userId},
      config.JWT_SECRET,
      {expiresIn:"7d"}
    )

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")
    token.session.refreshTokenHash= newRefreshTokenHash
    await token.session.save()

     res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      secure:false,
      sameSite:"strict",
      maxAge:7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      success:true,
      message:"Access token refreshed successfully!",
      accessToken
    })
  }catch(err){
    console.log("REFRESH TOKEN API ERROR : ",err)
    res.status(err.statusCode || 500).json({
      success:false,
      message:err.message || "Refresh token controller failed"
    })
  }
}
export const logout = async (req,res) =>{
  try{
    const refreshToken = req.cookies?.refreshToken
    const accessToken = req.headers.authorization?.split(" ")[1]



    const token = await logoutService({refreshToken,accessToken})

    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:false,
      sameSite:"strict"
    })

    return res.status(200).json({
      success:true,
      message:"Logout successfully"
    })

  }catch(err){
     console.log("LOGOUT API ERROR : ", err);
      res.status(err.statusCode || 500).json({
      success: false,
      message: err.message||"Failed to logout",
    });
  }
}

export const logoutAll = async (req,res) =>{
  try{
    const refreshToken = req.cookies?.refreshToken
    const accessToken = req.headers.authorization?.split(" ")[1]
    const user =await logoutAllService({refreshToken,accessToken})

    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:false,
      sameSite:"strict"
    })

    return res.status(200).json({
      success:true,
      message:"Logged out from all devices successfully!"
    })
  }catch(err){
    console.log("LOGOUT ALL API ERROR : ", err)
    res.status(err.statusCode || 500).json({
      success:false,
      message:err.message|| "Failed to logout from all devices"
    })
  }
}