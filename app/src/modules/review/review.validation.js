import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// add review
export const addReviewVal = joi.object({
    productId: generalFields.objectId.required(),
    rate: joi.number().min(0).max(5),
    comment: generalFields.comment.required()
}).required()

// get reviews
export const getReviewsVal = joi.object({
    productId: generalFields.objectId.required()
}).required()

// delete review
export const deleteReviewVal = joi.object({
    reviewId: generalFields.objectId.required()
}).required()