import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler, cloudUpload, roles } from "../../utils/index.js";
import { addAdmin, addUser, deleteUser, getUsers, updateUser } from "./admin.controller.js";
import { addAdminVal, addUserVal, deleteUserVal, updateUserVal } from "./admin.validation.js";

const adminRouter = Router();
// add user 
adminRouter.post('/add-user',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN,roles.SUPERADMIN]),
    cloudUpload().single('image'),
    isValid(addUserVal),
    isActive(),
    asyncHandler(addUser))


// add admin
adminRouter.post('/add-admin',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN,roles.SUPERADMIN]),
    cloudUpload().single('image'),
    isValid(addAdminVal),
    isActive(),
    asyncHandler(addAdmin))


// get users
adminRouter.get('/get-users',
    asyncHandler(isAuthenticate()), 
    isAuthorized([roles.ADMIN,roles.SUPERADMIN]), 
    isActive(),
    asyncHandler(getUsers))
    
    
// delete user
adminRouter.delete('/delete-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN,roles.SUPERADMIN]),
    isValid(deleteUserVal),
    isActive(),
    asyncHandler(deleteUser))


// update user
adminRouter.put('/update-user/:userId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN,roles.SUPERADMIN]),
    isValid(updateUserVal),
    isActive(),
    asyncHandler(updateUser))


export default adminRouter