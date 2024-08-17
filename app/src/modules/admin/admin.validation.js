import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addUserVal = joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    phone: generalFields.phone.required(),
    role: generalFields.role
}).required()


// delete user
export const deleteUserVal = joi.object({
    userId: generalFields.objectId.required()
}).required()

// update user
export const updateUserVal = joi.object({
    userId: generalFields.objectId.required(),
    role: generalFields.role.required()
}).required()