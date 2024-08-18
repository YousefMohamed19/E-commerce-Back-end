import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { addToWishlist, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
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

// get wishlist
wishlistRouter.get('/',
    asyncHandler(isAuthenticate()),
    asyncHandler(getWishlist))
export default wishlistRouter