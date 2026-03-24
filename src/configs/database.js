import {config} from "./env.js"
import mongoose from "mongoose"

if(!config.MONGO_URI){
 throw new Error("MONGO_URI is not defined in environmental veriables")
}

export const connectDB = () =>{
 try{
  mongoose.connect(config.MONGO_URI)
  console.log("database connected successfully!")
 }catch(err){
  console.log("Failed to connect to database",err)
  setTimeout(connectDB, 5000)
 }
}