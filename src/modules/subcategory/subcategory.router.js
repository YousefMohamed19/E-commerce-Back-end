import { Router } from "express";
import { fileUpload ,asyncHandler, roles} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createSubcategoryVal, deleteSubcategoryVal, getSubcategoryVal ,updateSubcategoryVal} from "./subcategory.validation.js";
import { createSubcategory, deleteSubcategory, getSpecificSubcategories, getSubcategories, updateSubcategory } from "./subcategory.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
const subcategoryRouter = Router(/*{mergeParams: true}*/);


// create subcategory
subcategoryRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({ folder: 'subcategory' }).single('image'),
    isValid(createSubcategoryVal),
    isActive(),
    asyncHandler(createSubcategory)
)
// update subcategory
subcategoryRouter.put('/update/:subcategoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({ folder: 'subcategory' }).single('image'),
    isValid(updateSubcategoryVal),
    isActive(),
    asyncHandler(updateSubcategory)
)
// get subcategory
subcategoryRouter.get('/:categoryId',
    isValid(getSubcategoryVal),
    asyncHandler(getSpecificSubcategories))


// get all subcategory
subcategoryRouter.get('/',asyncHandler(getSubcategories))
// delete subcategory
subcategoryRouter.delete('/delete/:subcategoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(deleteSubcategoryVal),
    isActive(),
    asyncHandler(deleteSubcategory))
export default subcategoryRouter;