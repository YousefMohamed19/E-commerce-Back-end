import { Product, Review } from "../../../db/index.js"
import { ApiFeature, AppError, messages, roles } from "../../utils/index.js"
// add  & update review
export const addReview = async (req, res,next) => {
    // get data from req
    const {productId} = req.query
    const {comment,rate} = req.body
    // check existance
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    // todo user has order
    // check review exist
    const reviewExist = await Review.findOneAndUpdate(
        {user:req.authUser._id,product:productId},
        {comment,rate},
        {new:true}
    )
    let message = messages.review.updateSuccessfully
    let data = reviewExist
    if(!reviewExist){
        const review = new Review({
            user:req.authUser._id,
            product:productId,
            comment,
            rate
        })
        const createdReview = await review.save()
        if(!createdReview){
            return next(new AppError(messages.review.failToCreate, 400))
        }
        message = messages.review.createSuccessfully
        data = createdReview
    }

    return res.status(200).json({message,success:true,data})
}

// get reviews for product
export const getReviews = async (req, res, next) => {
    // get data from req
    const {productId} = req.params

    // check existance
    const productExist = await Product.findById(productId)
    if (!productExist) {
        return next(new AppError(messages.product.notFound, 404))
    }
    const apiFeature = new ApiFeature(Review.find({product:productId}),req.query).pagination().sort().select().filter()
    const reviews = await apiFeature.mongooseQuery
    if (reviews.length==0) {
        return next(new AppError(messages.review.notFoundReview, 404))
    }
    // send response
    return res.status(200).json({
        success: true,
        message: messages.review.getSuccessfully,
        data: reviews
    })
}

// delete review 
export const deleteReview = async (req, res, next) => {
    // get data from req
    const {reviewId} = req.params
    // check existance
    const reviewExist = await Review.findById(reviewId)
    if (!reviewExist) {
        return next(new AppError(messages.review.notFound, 404))
    }
    // check user
    if (reviewExist.user.toString() !== req.authUser._id.toString() && req.authUser.role == roles.CUSTOMER) {
        return next(new AppError(messages.review.notAuthorized, 400))
    }
    // delete review
    const deletedReview = await Review.findByIdAndDelete(reviewId)
    if (!deletedReview) {
        return next(new AppError(messages.review.failToDelete, 400))
    }
    // send response
    return res.status(200).json({
        message: messages.review.deleteSuccessfully,
        success: true
    })

}
