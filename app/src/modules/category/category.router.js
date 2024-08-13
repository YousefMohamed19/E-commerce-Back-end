import { Router } from "express";
import { fileUpload ,asyncHandler,cloudUpload} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal, getCategoryVal, updateCategoryVal,deleteCategoryVal } from "./category.validation.js";
import { addCategory, CreateCategoryCloud, deletCategory, getAllCategory, getSpecificCategory, updateCategory } from "./category.controller.js";

const categoryRouter = Router()
// for merge params
// categoryRouter.use('/:categoryId', subcategoryRouter)


//add category todo authentication & auth
categoryRouter.post('/create',
    fileUpload({folder:'category'}).single('image'),
    isValid(addCategoryVal),
    asyncHandler(addCategory)
)

// upadate category todo authentication & auth
categoryRouter.put('/update/:categoryId',
    fileUpload({folder:'category'}).single('image'),
    isValid(updateCategoryVal),
    asyncHandler(updateCategory)
)

// get category
categoryRouter.get('/:categoryId',
    isValid(getCategoryVal), 
    asyncHandler(getSpecificCategory))


// get all category
categoryRouter.get('/',
    asyncHandler(getAllCategory))

// delete category
categoryRouter.delete('/delete/:categoryId',
    isValid(deleteCategoryVal),
    asyncHandler(deletCategory))

// create category with cloud
categoryRouter.post('/create-category-cloud',
    cloudUpload().single('image'),
    isValid(addCategoryVal),
    asyncHandler(CreateCategoryCloud)
)
export default categoryRouter