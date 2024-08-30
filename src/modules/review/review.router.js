import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { addReview, deleteReview, getReviews } from "./review.controller.js";
import { addReviewVal, deleteReviewVal, getReviewsVal } from "./review.validation.js";

const reviewRouter = Router();
// add & update review
reviewRouter.post('/add-review',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.CUSTOMER]),
    isValid(addReviewVal),
    isActive(),
    asyncHandler(addReview))

// get reviews for product
reviewRouter.get('/get-reviews/:productId',
    asyncHandler(isAuthenticate()),
    isValid(getReviewsVal),
    asyncHandler(getReviews))

// delete review

reviewRouter.delete('/delete-review/:reviewId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN, roles.CUSTOMER]),
    isValid(deleteReviewVal),
    isActive(),
    asyncHandler(deleteReview))
export default reviewRouter