import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/index.js";
import { changPassword, forgetPassword, login, signUp, verifyAccount } from "./auth.controller.js";
import { changPasswordVal, forgetPasswordVal, signInVal, signUpVal } from "./auth.validation.js";

const authRouter = Router();

// sign up
authRouter.post('/signup',isValid(signUpVal),asyncHandler(signUp))
// verify account
authRouter.get('/verify-account',asyncHandler(verifyAccount))
// login
authRouter.post('/login',isValid(signInVal),asyncHandler(login))

// forget password
authRouter.post('/forget-password',isValid(forgetPasswordVal), asyncHandler(forgetPassword))
// change password
authRouter.put('/change-password',isValid(changPasswordVal), asyncHandler(changPassword))
export default authRouter