import { Router } from "express";
import { asyncHandler, roles } from "../../utils/index.js";
import { isAuthenticate, isAuthorized } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { createOrderVal, updateOrderVal } from "./order.validation.js";
import { createOrder, deleteOrder, getOrder,updateOrder } from "./order.controller.js";
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

// update order
orderRouter.put('/update/:orderId',
    asyncHandler(isAuthenticate()),
    isValid(updateOrderVal),
    isActive(),
    asyncHandler(updateOrder))

// delete order
orderRouter.delete('/delete/:orderId',
    asyncHandler(isAuthenticate()),
    isActive(),
    asyncHandler(deleteOrder))

export default orderRouter