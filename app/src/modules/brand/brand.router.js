// import module
import { Router } from "express";
import { asyncHandler, fileUpload, roles } from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, deleteBrandVal, updateBrandVal } from "./brand.validation.js";
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "./brand.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
const brandRouter = Router();

// create brand  
brandRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({folder: "brand"}).single('logo'),
    isValid(createBrandVal), 
    isActive(),
    asyncHandler(createBrand)
)


// update brand 
brandRouter.put('/update/:brandId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    fileUpload({folder: "brand"}).single('logo'),
    isValid(updateBrandVal), 
    isActive(),
    asyncHandler(updateBrand)
)

// delete brand 
brandRouter.delete('/delete/:brandId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(deleteBrandVal),
    isActive(),
    asyncHandler(deleteBrand))

// get all brand
brandRouter.get('/',asyncHandler(getAllBrands))


// get brands
brandRouter.get('/',
    asyncHandler(getBrand)
)

export default brandRouter