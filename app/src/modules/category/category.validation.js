//import modules
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

// add category validation
export const addCategoryVal = joi.object({
    name: generalFields.name.required(),
}).required() 


// update category validation
export const updateCategoryVal = joi.object({
    name: generalFields.name,
    categoryId:generalFields.objectId.required()
}).required()

// get category validation
export const getCategoryVal = joi.object({
    categoryId:generalFields.objectId,
    name: generalFields.name,
    slug: generalFields.slug

}).required()

// delete category validation
export const deleteCategoryVal = joi.object({
    categoryId:generalFields.objectId.required()
}).required()