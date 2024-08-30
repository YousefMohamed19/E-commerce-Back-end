// import module
import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
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
// sign up validation
export const signUpVal = joi.object({
    userName: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB,
    address: joi.custom(parseArr)
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