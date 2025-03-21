import express from "express"
import { login, profile, register, users } from "../Controllers/user.js";
import { Authenticated } from "../Middlewares/auth.js";


const router = express.Router();

//register user
router.post("/register",register)

//login
router.post("/login",login)

//all user
router.get("/all",users)

//profile user
router.get("/profile",Authenticated,profile)

export default router