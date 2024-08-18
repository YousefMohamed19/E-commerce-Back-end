import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { addToWishlist, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { addToWishlistVal } from "./wishlist.validation.js";
import { isActive } from "../../middleware/isActive.js";
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