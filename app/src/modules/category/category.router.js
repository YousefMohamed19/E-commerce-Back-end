import { Router } from "express";
import { fileUpload ,asyncHandler} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { addCategoryVal, getCategoryVal, updateCategoryVal,deleteCategoryVal } from "./category.validation.js";
import { addCategory, deletCategory, getSpecificCategory, updateCategory } from "./category.controller.js";

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


// delete category
categoryRouter.delete('/delete/:categoryId',
    isValid(deleteCategoryVal),
    asyncHandler(deletCategory))
export default categoryRouter