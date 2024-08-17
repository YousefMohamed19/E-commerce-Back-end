import { Router } from "express";
import { fileUpload ,asyncHandler, roles} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createSubcategoryVal, deleteSubcategoryVal, getSubcategoryVal ,updateSubcategoryVal} from "./subcategory.validation.js";
import { createSubcategory, deleteSubcategory, getSpecificSubcategories, updateSubcategory } from "./subcategory.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";

const subcategoryRouter = Router(/*{mergeParams: true}*/);


// create subcategory
subcategoryRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({ folder: 'subcategory' }).single('image'),
    isValid(createSubcategoryVal),
    asyncHandler(createSubcategory)
)
// update subcategory
subcategoryRouter.put('/update/:subcategoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({ folder: 'subcategory' }).single('image'),
    isValid(updateSubcategoryVal),
    asyncHandler(updateSubcategory)
)
// get subcategory
subcategoryRouter.get('/:categoryId',
    isValid(getSubcategoryVal),
    asyncHandler(getSpecificSubcategories))

// delete subcategory
subcategoryRouter.delete('/delete/:subcategoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    isValid(deleteSubcategoryVal),
    asyncHandler(deleteSubcategory))
export default subcategoryRouter;