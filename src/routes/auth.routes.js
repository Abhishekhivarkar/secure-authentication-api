import {register,login,getMe,refreshToken} from "../controllers/auth.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import express from "express"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/get-me",authMiddleware,getMe)
router.get("/refresh-token",refreshToken)
export default router