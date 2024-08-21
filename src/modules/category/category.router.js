import { Router } from "express";
import { fileUpload ,asyncHandler,cloudUpload, roles} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal, getCategoryVal, updateCategoryVal,deleteCategoryVal, deleteCategoryCloudVal } from "./category.validation.js";
import { addCategory, CreateCategoryCloud, deletCategory, deleteCategoryCloud, getAllCategory, getSpecificCategory, updateCategory, updateCategoryCloud } from "./category.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
const categoryRouter = Router()
// for merge params
// categoryRouter.use('/:categoryId', subcategoryRouter)



//add category 
categoryRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({folder:'category'}).single('image'),
    isValid(addCategoryVal),
    isActive(),
    asyncHandler(addCategory)
)


// upadate category 
categoryRouter.put('/update/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({folder:'category'}).single('image'),
    isValid(updateCategoryVal),
    isActive(),
    asyncHandler(updateCategory)
)


// get category
categoryRouter.get('/:categoryId',
    isValid(getCategoryVal),
    asyncHandler(getSpecificCategory)
)


// get all category
categoryRouter.get('/',
    asyncHandler(getAllCategory)
)


// delete category
categoryRouter.delete('/delete/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(deleteCategoryVal),
    isActive(),
    asyncHandler(deletCategory)
)


// create category with cloud
categoryRouter.post('/create-category-cloud',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    cloudUpload().single('image'),
    isValid(addCategoryVal),
    isActive(),
    asyncHandler(CreateCategoryCloud)
)


// delete category with cloud
categoryRouter.delete('/delete-category-cloud/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(deleteCategoryCloudVal),
    isActive(),
    asyncHandler(deleteCategoryCloud)
)


// update category with cloud
categoryRouter.put('/update-category-cloud/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    cloudUpload().single('image'),
    isValid(updateCategoryVal),
    isActive(),
    asyncHandler(updateCategoryCloud))
export default categoryRouter