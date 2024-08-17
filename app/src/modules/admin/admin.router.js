import { Router } from "express";
import { asyncHandler, cloudUpload, roles } from "../../utils/index.js";
import { addUser } from "./admin.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addUserVal } from "./admin.validation.js";

const adminRouter = Router();
// add user 
adminRouter.post('/add-user',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    cloudUpload().single('image'),
    isValid(addUserVal),
    asyncHandler(addUser))


export default adminRouter