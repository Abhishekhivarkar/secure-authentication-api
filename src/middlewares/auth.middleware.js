import {config} from "../configs/env.js"
import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
export const authMiddleware =async (req,res,next) =>{
 
 try{
  const token = req.headers.authorization?.split(" ")[1]
  
  if(!token){
   return res.status(400).json({
    success:false,
    message:"Token not found"
   })
  }
  
  const verify = jwt.verify(token,config.JWT_SECRET)
  
  const user = await User.findById(verify.id)
  
  if(!user){
   return res.status(404).json({
    success:false,
    message:"User not found"
   })
  }
  
  req.user = user
  next()
 }catch(err){
  console.log("AUTH MIDDLEWARE ERROR : ",err)
  res.status(500).json({
   success:false,
   message:"User not logged in"
  })
 }
}