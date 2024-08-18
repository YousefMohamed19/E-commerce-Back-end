import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { resetPassword } from "./user.controller.js";
import { resetPasswordVal } from "./user.validation.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/index.js";

const userRouter = Router();

// reset password

userRouter.put('/reset-password', 
    asyncHandler(isAuthenticate()), 
    isValid(resetPasswordVal), 
    asyncHandler(resetPassword))

export default userRouter