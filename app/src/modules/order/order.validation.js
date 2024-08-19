import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


// create order
export const createOrderVal = joi.object({
    address:generalFields.address.required, 
    phone: generalFields.phone.required(), 
    coupon: generalFields.coupon, 
    payment: generalFields.payment.required()
}).required()