import express from "express"
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/health",(_,res)=>{
 res.status(200).json({
  success:true,
  status:"OK"
 })
})

export default app