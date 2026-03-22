import {connectDB} from "./src/configs/database.js"
import {config} from "./src/configs/env.js"
import app from "./src/app.js"
import {validateEnv} from "./src/configs/validateEnv.js"

validateEnv(config)
const PORT = config.PORT || 5000

const startServer =async (_,res) =>{
 try{
 await connectDB()
 
 app.listen(PORT,()=>{
  console.log("server running on port",PORT)
 })
 }catch(err){
  console.log("START SERVER ERROR : ",err)
  res.status(500).json({
   success:false,
   message:"Failed to start server"
  })
 }
}

startServer()