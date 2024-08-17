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