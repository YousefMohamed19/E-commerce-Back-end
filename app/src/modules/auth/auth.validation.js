// import module
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
// sign up validation
export const signUpVal = joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    phone: generalFields.phone.required()
}).required()

// sign in validation
export const signInVal = joi.object({
    email: generalFields.email,
    password: generalFields.password.required(),
    phone: generalFields.phone.when('email', {
        is: joi.required(),
        then: joi.optional(),
        otherwise: joi.required()
    }),
}).required()

// forget password
export const forgetPasswordVal = joi.object({
    email: generalFields.email.required()
}).required()

// change password
export const changPasswordVal = joi.object({
    otp: generalFields.otp.required(),
    newPassword: generalFields.password.required(),
    email: generalFields.email.required()
}).required()