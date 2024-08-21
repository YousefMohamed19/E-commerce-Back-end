// import module
import { Router } from "express";
import { createProductVal, getProductVal, updateProductVal } from "./product.validation.js";
import { fileUpload , asyncHandler, roles} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createProduct, updateProduct,getAllProducts, deleteProduct, getProduct } from "./product.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";

const productRouter = Router();


// create product 
productRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER, roles.SUPERADMIN]),
    fileUpload({folder: "product"}).fields([
        {name: "mainImage", maxCount: 1},
        {name: "subImages", maxCount: 5}
    ]),
    isValid(createProductVal),
    isActive(),
    asyncHandler(createProduct)
)

// update product
productRouter.put('/update/:productId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER, roles.SUPERADMIN]),
    fileUpload({folder: "product"}).fields([
        {name: "mainImage", maxCount: 1},
        {name: "subImages", maxCount: 5}
    ]),
    isValid(updateProductVal),
    isActive(), 
    asyncHandler(updateProduct)
)

// get all product
productRouter.get('/',asyncHandler(getAllProducts))

// get single product
productRouter.get('/:productId',
    isValid(getProductVal),
    asyncHandler(getProduct)
)
 // delete product 
 productRouter.delete('/:productId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SELLER, roles.SUPERADMIN]),
    isActive(),
    asyncHandler(deleteProduct))

export default productRouter