//imposrt modules
import joi from 'joi'
import { Types } from 'mongoose'
import { AppError } from '../utils/index.js'

const validateObjectId = (value,helper)=>{
    const match =Types.ObjectId.isValid(value) 
    if (match) {
        return true
    }
    return helper('invalid object id')
}
export const generalFields = {
    name: joi.string(),
    slug: joi.string(),
    description: joi.string(),
    title: joi.string(),
    price: joi.number(),
    discount: joi.number(),
    size: joi.array(),  
    colors: joi.array(),
    stock: joi.number(),
    phone: joi.string(),
    email: joi.string(),
    password: joi.string(),
    role: joi.string(),
    comment: joi.string(),
    otp: joi.string(),
    address: joi.array(),
    payment: joi.string(),
    coupon: joi.string(),
    DOB: joi.date(),
    // objectId:joi.string().hex().length(24)
    objectId:joi.custom(validateObjectId)
}
export const isValid =(schema)=>{
    return (req,res,next)=>{
        let data ={...req.body,...req.query,...req.params}
        const {error}=schema.validate(data,{abortEarly:false})
        if (error) {
            const errArr = []
            error.details.forEach(err => errArr.push(err.message))
            return next(new AppError(errArr, 400))
        }
        next()
    }
}