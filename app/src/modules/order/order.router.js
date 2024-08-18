import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal } from "./order.validation.js";
import { createOrder, getOrder } from "./order.controller.js";
import { isActive } from "../../middleware/isActive.js";


const orderRouter = Router();


// create order
orderRouter.post('/create',
    asyncHandler(isAuthenticate()),
    isAuthorized(Object.values(roles)),
    isValid(createOrderVal),
    isActive(),
    asyncHandler(createOrder))


// get order
orderRouter.get('/get-orders',
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(getOrder))

export default orderRouter