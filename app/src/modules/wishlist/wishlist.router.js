import { Router } from "express";
import { asyncHandler } from "../../utils/index.js";
import { addToWishlist, deleteFromWishlist } from "./wishlist.controller.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addToWishlistVal } from "./wishlist.validation.js";
const wishlistRouter = Router();

// add to wishlist
wishlistRouter.put('/add-to-wishlist',
    asyncHandler(isAuthenticate()),
    isValid(addToWishlistVal),
     asyncHandler(addToWishlist))

// delete from wishlist
wishlistRouter.put('/delete-from-wishlist/:productId',
    asyncHandler(isAuthenticate()),
    asyncHandler(deleteFromWishlist))
export default wishlistRouter