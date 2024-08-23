import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// create order
export const createOrderVal = joi.object({
    phone: generalFields.phone.required(),
    street: joi.string(),
    coupon: generalFields.coupon, 
    payment: generalFields.payment.required()
}).required()


// update order
export const updateOrderVal = joi.object({
    orderId: generalFields.objectId.required(),
    phone: generalFields.phone.required(),
    street: joi.string(),
    coupon: generalFields.coupon,
}).required()