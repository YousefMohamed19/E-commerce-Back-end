import { Router } from "express";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/index.js";
import { addToWishlist, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";
import { addToWishlistVal } from "./wishlist.validation.js";

const wishlistRouter = Router();

// add to wishlist
wishlistRouter.put('/add-to-wishlist',
    asyncHandler(isAuthenticate()),
    isValid(addToWishlistVal),
    isActive(),
     asyncHandler(addToWishlist))

// delete from wishlist
wishlistRouter.put('/delete-from-wishlist/:productId',
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(deleteFromWishlist))

// get wishlist
wishlistRouter.get('/',
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(getWishlist))
export default wishlistRouter