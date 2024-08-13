// import module
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// parce product validation
const parseArr = (value, helper) => {
    value = JSON.parse(value)
    const schema = joi.array().items(joi.string())
    const { error } = schema.validate(value, { abortEarly: false })
    if (error) {
        return helper('invalid array')
    }
    else {
        return true
    }
}
// create product validation
export const createProductVal = joi.object({
    title:generalFields.title.required(),
    description:generalFields.description.required(),
    category:generalFields.objectId.required(),
    subcategory:generalFields.objectId.required(),
    brand:generalFields.objectId.required(),
    price:generalFields.price.min(0).required(),
    discount:generalFields.discount,
    size:joi.custom(parseArr),
    colors:joi.custom(parseArr),
    stock:generalFields.stock.min(0),
}).required()

// update product validation
export const updateProductVal = joi.object({
    title:generalFields.title,
    description:generalFields.description,
    category:generalFields.objectId,
    subcategory:generalFields.objectId,
    brand:generalFields.objectId,
    price:generalFields.price.min(0),
    discount:generalFields.discount,
    size:joi.custom(parseArr),
    colors:joi.custom(parseArr),
    stock:generalFields.stock.min(0),
    productId:generalFields.objectId
}).required()