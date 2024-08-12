// import module
import { Router } from "express";
import { asyncHandler, fileUpload } from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, deleteBrandVal, updateBrandVal } from "./brand.validation.js";
import { createBrand, deleteBrand, updateBrand } from "./brand.controller.js";

const brandRouter = Router();

// create brand  todo isAuthentication
brandRouter.post('/create',
    fileUpload({folder: "brand"}).single('logo'),
    isValid(createBrandVal), 
    asyncHandler(createBrand)
)


// update brand todo isAuthentication
brandRouter.put('/update/:brandId',
    fileUpload({folder: "brand"}).single('logo'),
    isValid(updateBrandVal), 
    asyncHandler(updateBrand)
)

// delete brand todo isAuthentication
brandRouter.delete('/delete/:brandId',
    isValid(deleteBrandVal),
    asyncHandler(deleteBrand))
export default brandRouter