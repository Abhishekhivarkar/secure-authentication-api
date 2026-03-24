import User from "../models/User.model.js"
import {config} from "../configs/env.js"
import jwt from "jsonwebtoken"
import SessionModel from "../models/Session.model.js"
import crypto from "crypto"
import UserModel from "../models/User.model.js"
import { startSession } from "mongoose"
import BlackListTokenModel from "../models/BlackListToken.model.js"

export const createUserService =async ({userName,email,password}) =>{
 try{
  const user = await User.findOne({
   email
  })
  
  if(user){
   const err = new Error("User already exists")
   err.statusCode = 401
   throw err
  }
  
  const newUser = await User.create({
   userName,
   email,
   password
  })
  
  return newUser
 }catch(err){
  throw err
 }
}

export const loginService = async ({email, password}) => {
  try{
  const user = await User.findOne({email}).select("+password")

  if (!user) {
    const err = new Error("User not found, please sign up")
    err.statusCode = 404
    throw err
  }

  const match = await user.comparePassword(password)
  if (!match) {
    const err = new Error("Incorrect password!")
    err.statusCode = 401
    throw err
  }

  return user  
}catch(err){
  throw err
}
}


export const getMeService = async ({userId
}) =>{
 try{
  const user = await User.findOne({
   _id:userId
  })
  
  if(!user){
   const err = new Error("User not found")
   err.statusCode = 404
   throw err
  }
  
  return user
 }catch(err){
  throw(err)
  
 }
}


export const refreshTokenService = async ({refreshToken}) =>{
  try{
    if(!refreshToken){
      const err = new Error("Refresh token not found")
      err.statusCode = 404
      throw err
    }
    const decode =  jwt.verify(refreshToken,config.JWT_SECRET)
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await SessionModel.findOne({
      refreshTokenHash,
      revoked:false
    })

    if (!session){
      const err = new Error("session not found")
      err.statusCode = 404
      throw err
    }
    return{
      userId:decode.id,
      session
    }
  }catch(err){
    throw err
  }
}


export const logoutService = async ({refreshToken,accessToken}) =>{
  try{
    if (!refreshToken){
      const err = new Error("refresh token not found")
      err.statusCode = 404
      throw err
    }

    if(!accessToken){
      const err = new Error("Access token not found")
      err.statusCode = 404
      throw err
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await SessionModel.findOne({
      refreshTokenHash:refreshTokenHash,
      revoked:false
    })

    if(!session){
      const err = new Error("Session not found")
      err.statusCode = 404
      throw err
    }

    session.revoked = true
    await session.save()

    await BlackListTokenModel.create({
      token:accessToken
    })

    return true;
  }catch(err){
    throw(err)
  }
}


export const logoutAllService = async ({refreshToken,accessToken}) =>{
  try{
    if (!refreshToken){
      const err = new Error("Refresh token not found")
      err.statusCode = 404
      throw err
    }

    if(!accessToken){
      const err = new Error("Access token not found")
      err.statusCode = 404
      throw err
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET)

    await SessionModel.updateMany({
      user:decoded.id,
      revoked:false
    },{
      revoked:true
    })

    await BlackListTokenModel.create({
      token:accessToken
    })
    return true
  }catch(err){
    throw err
  }
}