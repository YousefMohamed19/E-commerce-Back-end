import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

// create brand validation
export const createBrandVal = joi.object({
    name: generalFields.name.required(),
})
// update brand validation
export const updateBrandVal = joi.object({
    name: generalFields.name,
    brandId: generalFields.objectId.required()
})
// delete brand validation
export const deleteBrandVal = joi.object({
    brandId: generalFields.objectId.required()
})

// get brand validation
export const getSpecificBrandVal = joi.object({
    brandId: generalFields.objectId
})