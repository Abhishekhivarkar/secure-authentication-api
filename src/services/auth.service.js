import User from "../models/User.model.js"
import {config} from "../configs/env.js"
import jwt from "jsonwebtoken"
export const createUserService =async ({userName,email,password}) =>{
 try{
  const user = await User.findOne({
   email
  })
  
  if(user){
   throw new Error("User already exists")
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

export const loginService = async ({email,password}) =>
{
 try{
  const user = await User.findOne({email}).select("+password")
  
  if (!user){
   throw new Error("User not found, please sign up")
  }
  
  const match = await user.comparePassword(password)
  
  if(!match){
   throw new Error("Incorrect password!")
  }
  
  const accessToken = jwt.sign(
   {id:user._id},
   config.JWT_SECRET,
   {expiresIn:"15m"}
   )
   
   const refreshToken = jwt.sign(
    {id:user._id},
    config.JWT_SECRET,
    {expiresIn:"7d"}
    )
    
    
   return{
    email:user.email,accessToken,refreshToken
   }
 }catch(err){
  throw(err)
 }
}


export const getMeService = async ({userId
}) =>{
 try{
  const user = await User.findOne({
   _id:userId
  })
  
  if(!user){
   throw new Error("User not found")
  }
  
  return user
 }catch(err){
  throw(err)
  
 }
}


export const refreshTokenService =async ({refreshToken}) =>{
 try{
 if(!refreshToken){
   throw new Error("Refresh token not found")
  }
  
  const decode = jwt.verify(refreshToken,config.JWT_SECRET)
  
  const accessToken = jwt.sign(
   {id:decode.id},
   config.JWT_SECRET,
   {expiresIn:"15m"}
   )
   
   const newRefreshToken = jwt.sign(
    {id:decode.id},
    config.JWT_SECRET,
    {expiresIn:"7d"}
    )
    
    
   return {
    accessToken,
    newRefreshToken
   }
 }catch(err){
  throw (err)
 }
}