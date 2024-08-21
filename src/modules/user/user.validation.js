import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

const parseArr = (value, helper) => {
    // Check if the value is already an object/array
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch (e) {
            return helper.error('Invalid JSON format');
        }
    } else if (typeof value !== 'object' || !Array.isArray(value)) {
        return helper.error('Invalid input type, expected an array of objects');
    }

    // Define the schema for the address array
    const schema = joi.array().items(
        joi.object({
            street: joi.string().required(),
            city: joi.string().required(),
            phone: joi.string().required()
        })
    );

    // Validate the value against the schema
    const { error } = schema.validate(value, { abortEarly: false });

    if (error) {
        return helper.error('Invalid array format');
    }

    return value;  // Return the validated value
};
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
