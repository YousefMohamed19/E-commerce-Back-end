import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/index.js";
import { addToCart, deleteFromCart, getCart } from "./cart.controller.js";
import { addToCartVal, deleteFromCartVal } from "./cart.validation.js";

const cartRouter = Router();

// add to cart 
cartRouter.post('/add-to-cart',
    asyncHandler(isAuthenticate()),
    isValid(addToCartVal),
    isActive(),
    asyncHandler(addToCart))

// delete from cart
cartRouter.delete('/delete-from-cart/:productId',
    asyncHandler(isAuthenticate()),
    isValid(deleteFromCartVal),
    isActive(),
    asyncHandler(deleteFromCart))
// get cart
cartRouter.get('/get-cart',
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(getCart))
export default cartRouter