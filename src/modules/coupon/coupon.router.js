import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isActive } from "../../middleware/isActive.js";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler, roles } from "../../utils/index.js";
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from "./coupon.controller.js";
import { createCouponVal, deleteCouponVal, updateCouponVal } from "./coupon.validation.js";

const couponRouter = Router()
// create coupon
couponRouter.post('/add-coupon',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(createCouponVal),
    isActive(),
    asyncHandler(createCoupon)
)

// get coupon
couponRouter.get('/get-coupons',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isActive(),
    asyncHandler(getCoupons))

// update coupon
couponRouter.put('/update-coupon/:couponId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(updateCouponVal),
    isActive(),
    asyncHandler(updateCoupon))

// delete coupon
couponRouter.delete('/delete-coupon/:couponId',
    asyncHandler(isAuthenticate()),
    isAuthorized([roles.ADMIN, roles.SUPERADMIN]),
    isValid(deleteCouponVal),
    isActive(),
    asyncHandler(deleteCoupon))
export default couponRouter