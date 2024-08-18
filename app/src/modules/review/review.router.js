import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { addReviewVal, getReviewsVal,deleteReviewVal } from "./review.validation.js";
import { addReview, getReviews ,deleteReview} from "./review.controller.js";
import { isValid } from "../../middleware/validation.js";
import { isActive } from "../../middleware/isActive.js";

const reviewRouter = Router();
// add & update review
reviewRouter.post('/add-review',
    asyncHandler(isAuthenticate()),
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
    isAuthorized([roles.ADMIN, roles.CUSTOMER]),
    isValid(deleteReviewVal),
    isActive(),
    asyncHandler(deleteReview))
export default reviewRouter