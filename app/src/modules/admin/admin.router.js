import { Router } from "express";
import { asyncHandler, cloudUpload, roles } from "../../utils/index.js";
import { addUser, deleteUser, getUsers, updateUser } from "./admin.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addUserVal, deleteUserVal, updateUserVal } from "./admin.validation.js";

const adminRouter = Router();
// add user 
adminRouter.post('/add-user',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    cloudUpload().single('image'),
    isValid(addUserVal),
    asyncHandler(addUser))



// get users
adminRouter.get('/get-users',
    asyncHandler(isAuthenticate()), 
    isAuthorized([roles.ADMIN]), 
    asyncHandler(getUsers))
    
    
// delete user
adminRouter.delete('/delete-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(deleteUserVal),
    asyncHandler(deleteUser))


// update user
adminRouter.put('/update-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(updateUserVal),
    asyncHandler(updateUser))
export default adminRouter