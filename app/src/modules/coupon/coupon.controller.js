import { Coupon } from "../../../db/index.js"
import { ApiFeature, AppError, couponTypes, messages } from "../../utils/index.js"

// create coupon
export const createCoupon = async (req, res, next) => {
    // get data from req
    const { couponCode, couponAmount, couponType, fromDate, toDate } = req.body
    // check existance
    const couponExist = await Coupon.findOne({ couponCode })
    if (couponExist) {
        return next(new AppError(messages.coupon.alreadyExist, 409))
    }
    if(couponType === couponTypes.PERCENTAGE && couponAmount > 100) {
        return next(new AppError(messages.coupon.invalidAmount, 400))
    }
    // prepare data
    const coupon = new Coupon({
        couponCode,
        couponAmount,
        couponType,
        fromDate,
        toDate,
        createdBy: req.authUser._id
    })
    // add to database
    const createdCoupon = await coupon.save()
    if (!createdCoupon) {
        return next(new AppError(messages.coupon.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.coupon.create,
        success: true,
        data: createdCoupon
    })
}


// get coupon
export const getCoupons = async (req, res, next) => {
    const apiFeature = new ApiFeature(Coupon.find(), req.query).pagination().sort().select().filter()
    const coupons = await apiFeature.mongooseQuery
    if (!coupons) {
        return next(new AppError(messages.coupon.notFound, 404))
    }
    // send response
    return res.status(200).json({
        message: messages.coupon.getSuccessfully,
        success: true,
        data: coupons
    })
}


// update coupon
export const updateCoupon = async (req, res, next) => {
    // get data from req
    const { couponId } = req.params
    const { couponCode, couponAmount, couponType, fromDate, toDate } = req.body
    // check existance
    const couponExist = await Coupon.findById(couponId)
    if (!couponExist) {
        return next(new AppError(messages.coupon.notFound, 404))
    }
    // prepare data
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, {
        couponCode,
        couponAmount,
        couponType,
        fromDate,
        toDate
    }, { new: true })
    if (!updatedCoupon) {
        return next(new AppError(messages.coupon.failToUpdate, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.coupon.updateSuccessfully,
        success: true,
        data: updatedCoupon
    })
}


// delete coupon
export const deleteCoupon = async (req, res, next) => {
    // get data from req
    const { couponId } = req.params
    // check existance
    const couponExist = await Coupon.findById(couponId)
    if (!couponExist) {
        return next(new AppError(messages.coupon.notFound, 404))
    }
    // prepare data
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId)
    if (!deletedCoupon) {
        return next(new AppError(messages.coupon.failToDelete, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.coupon.deleteSuccessfully,
        success: true
    })
}