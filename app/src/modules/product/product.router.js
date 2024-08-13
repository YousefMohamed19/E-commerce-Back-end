// import module
import { Router } from "express";
import { createProductVal, updateProductVal } from "./product.validation.js";
import { fileUpload , asyncHandler} from "../../utils/index.js";
import { isValid } from "../../middleware/validation.js";
import { createProduct, updateProduct,getAllProducts, deleteProduct } from "./product.controller.js";


const productRouter = Router();


// create product todo isAuthentication
productRouter.post('/create',
    fileUpload({folder: "product"}).fields([
        {name: "mainImage", maxCount: 1},
        {name: "subImages", maxCount: 5}
    ]),
    isValid(createProductVal), 
    asyncHandler(createProduct)
)

// update product
productRouter.put('/update/:productId',
    fileUpload({folder: "product"}).fields([
        {name: "mainImage", maxCount: 1},
        {name: "subImages", maxCount: 5}
    ]),
    isValid(updateProductVal), 
    asyncHandler(updateProduct)
)

// get all product
productRouter.get('/',asyncHandler(getAllProducts))
 // delete product todo isAuthentication
 productRouter.delete('/:productId',asyncHandler(deleteProduct))

export default productRouter