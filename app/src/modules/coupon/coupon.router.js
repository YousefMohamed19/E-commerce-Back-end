import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { asyncHandler,roles } from "../../utils/index.js";
import { createCouponVal, deleteCouponVal, updateCouponVal } from "./coupon.validation.js";
import { createCoupon ,getCoupons, updateCoupon, deleteCoupon} from "./coupon.controller.js";
import { isActive } from "../../middleware/isActive.js";
const couponRouter = Router()
// create coupon
couponRouter.post('/add-coupon',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(createCouponVal),
    isActive(),
    asyncHandler(createCoupon)
)

// get coupon
couponRouter.get('/get-coupons',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isActive(),
    asyncHandler(getCoupons))

// update coupon
couponRouter.put('/update-coupon/:couponId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(updateCouponVal),
    isActive(),
    asyncHandler(updateCoupon))

// delete coupon
couponRouter.delete('/delete-coupon/:couponId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN]),
    isValid(deleteCouponVal),
    isActive(),
    asyncHandler(deleteCoupon))
export default couponRouter