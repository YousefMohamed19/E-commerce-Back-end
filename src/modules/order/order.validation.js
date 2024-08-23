import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// create order
export const createOrderVal = joi.object({
    phone: joi.string(),
    street: joi.string(),
    coupon: generalFields.coupon, 
    payment: generalFields.payment.required()
}).required()


// update order
export const updateOrderVal = joi.object({
    orderId: generalFields.objectId.required(),
    phone: joi.string(),
    street: joi.string(),
    coupon: generalFields.coupon,
}).required()