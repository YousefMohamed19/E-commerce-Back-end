import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


// reset password
export const resetPasswordVal = joi.object({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.required()
}).required()