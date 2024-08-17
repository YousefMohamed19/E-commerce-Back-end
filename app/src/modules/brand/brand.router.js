// import module
import { Router } from "express";
import { asyncHandler, fileUpload, roles } from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, deleteBrandVal, updateBrandVal } from "./brand.validation.js";
import { createBrand, deleteBrand, getAllBrands, updateBrand } from "./brand.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";

const brandRouter = Router();

// create brand  
brandRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({folder: "brand"}).single('logo'),
    isValid(createBrandVal), 
    asyncHandler(createBrand)
)


// update brand 
brandRouter.put('/update/:brandId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    fileUpload({folder: "brand"}).single('logo'),
    isValid(updateBrandVal), 
    asyncHandler(updateBrand)
)

// delete brand 
brandRouter.delete('/delete/:brandId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER]),
    isValid(deleteBrandVal),
    asyncHandler(deleteBrand))

// get all brand
brandRouter.get('/',asyncHandler(getAllBrands))

export default brandRouter