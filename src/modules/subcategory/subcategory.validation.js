import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

// create subcategory
export const createSubcategoryVal = joi.object({
    name: generalFields.name.required(),
    category: generalFields.objectId.required(),
}).required()

// update subcategory
export const updateSubcategoryVal = joi.object({
    subcategoryId: generalFields.objectId.required(),
    name: generalFields.name.required(),
    category: generalFields.objectId.required(),
}).required()
// get subcategory
export const getSubcategoryVal = joi.object({
    categoryId: generalFields.objectId.required(),
}).required()

// delete subcategory
export const deleteSubcategoryVal = joi.object({
    subcategoryId: generalFields.objectId.required(),
}).required()