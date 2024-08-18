import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { getUser, resetPassword, updateUser ,deleteUser, logout} from "./user.controller.js";
import { resetPasswordVal, updateUserVal } from "./user.validation.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { asyncHandler, cloudUpload } from "../../utils/index.js";
import { isActive } from "../../middleware/isActive.js";

const userRouter = Router();

// reset password

userRouter.put('/reset-password', 
    asyncHandler(isAuthenticate()), 
    isValid(resetPasswordVal), 
    isActive(),
    asyncHandler(resetPassword))

// get user
userRouter.get('/get-profile', 
    asyncHandler(isAuthenticate()), 
    isActive(),
    asyncHandler(getUser))


// update user
userRouter.put('/update-profile', 
    asyncHandler(isAuthenticate()), 
    cloudUpload().single('image'),
    // isValid(updateUserVal), 
    isActive(),
    asyncHandler(updateUser))

// delete user
userRouter.delete('/delete-user', 
    asyncHandler(isAuthenticate()),
    isActive(), 
    asyncHandler(deleteUser))


// logout 
userRouter.get('/logout', 
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(logout))
export default userRouter