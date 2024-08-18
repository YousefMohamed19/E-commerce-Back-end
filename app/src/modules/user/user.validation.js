import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

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
// reset password
export const resetPasswordVal = joi.object({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.required()
}).required()


// update user
export const updateUserVal = joi.object({
    userName: generalFields.name,
    email: generalFields.email,
    phone: generalFields.phone,
    DOB: generalFields.DOB,
    address: joi.custom(parseArr) 
}).required();
