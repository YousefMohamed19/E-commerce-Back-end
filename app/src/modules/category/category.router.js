import { Router } from "express";
import { fileUpload ,asyncHandler,cloudUpload, roles} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal, getCategoryVal, updateCategoryVal,deleteCategoryVal } from "./category.validation.js";
import { addCategory, CreateCategoryCloud, deletCategory, deleteCategoryCloud, getAllCategory, getSpecificCategory, updateCategory } from "./category.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";

const categoryRouter = Router()
// for merge params
// categoryRouter.use('/:categoryId', subcategoryRouter)



//add category 
categoryRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({folder:'category'}).single('image'),
    isValid(addCategoryVal),
    asyncHandler(addCategory)
)


// upadate category 
categoryRouter.put('/update/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({folder:'category'}).single('image'),
    isValid(updateCategoryVal),
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
    isAuthorized([roles.ADMIN, roles.SELLER]),
    isValid(deleteCategoryVal),
    asyncHandler(deletCategory)
)


// create category with cloud
categoryRouter.post('/create-category-cloud',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUpload().single('image'),
    isValid(addCategoryVal),
    asyncHandler(CreateCategoryCloud)
)


// delete category with cloud
categoryRouter.delete('/delete-category-cloud',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    asyncHandler(deleteCategoryCloud)
)


// update category with cloud
categoryRouter.put('/update-category-cloud/:categoryId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    cloudUpload().single('image'),
    isValid(updateCategoryVal),
    asyncHandler(CreateCategoryCloud))
export default categoryRouter