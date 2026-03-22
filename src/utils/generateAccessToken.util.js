import { config } from "../configs/env.js"
import jwt from "jsonwebtoken"
export const generateAccessToken = async ({userId,sessionId})=>{
    try{
        return jwt.sign(
            {id:userId,sessionId:sessionId},
            config.JWT_SECRET,
            {expiresIn:"15m"}
        )
    }catch(err){
        console.log("GENETARE ACCESS TOKEN UTIL ERROR : ", err)
    }
}