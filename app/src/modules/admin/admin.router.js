import { Router } from "express";
import { asyncHandler, cloudUpload, roles } from "../../utils/index.js";
import { addUser, deleteUser, getUsers, updateUser } from "./admin.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addUserVal, deleteUserVal, updateUserVal } from "./admin.validation.js";
import { isActive } from "../../middleware/isActive.js";

const adminRouter = Router();
// add user 
adminRouter.post('/add-user',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    cloudUpload().single('image'),
    isValid(addUserVal),
    isActive(),
    asyncHandler(addUser))



// get users
adminRouter.get('/get-users',
    asyncHandler(isAuthenticate()), 
    isAuthorized([roles.ADMIN]), 
    isActive(),
    asyncHandler(getUsers))
    
    
// delete user
adminRouter.delete('/delete-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(deleteUserVal),
    isActive(),
    asyncHandler(deleteUser))


// update user
adminRouter.put('/update-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(updateUserVal),
    isActive(),
    asyncHandler(updateUser))
export default adminRouter