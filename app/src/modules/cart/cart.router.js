import { Router } from "express";
import { asyncHandler } from "../../utils/index.js";
import { addToCart, deleteFromCart, getCart } from "./cart.controller.js";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { addToCartVal, deleteFromCartVal } from "./cart.validation.js";
const cartRouter = Router();

// add to cart 
cartRouter.post('/add-to-cart',
    asyncHandler(isAuthenticate()),
    isValid(addToCartVal),
    asyncHandler(addToCart))

// delete from cart
cartRouter.delete('/delete-from-cart/:productId',
    asyncHandler(isAuthenticate()),
    isValid(deleteFromCartVal),
    asyncHandler(deleteFromCart))
// get cart
cartRouter.get('/get-cart',
    asyncHandler(isAuthenticate()),
    asyncHandler(getCart))
export default cartRouter