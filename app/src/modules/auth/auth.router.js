import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/index.js";
import { signUp, verifyAccount ,login} from "./auth.controller.js";
import { signUpVal ,signInVal} from "./auth.validation.js";

const authRouter = Router();

// sign up
authRouter.post('/signup',isValid(signUpVal),asyncHandler(signUp))
// verify account
authRouter.get('/verify-account',asyncHandler(verifyAccount))
// login
authRouter.post('/login',isValid(signInVal),asyncHandler(login))
export default authRouter