const generateMessage = (entity) => ({
    alreadyExist : `${entity} already exist`,
    notFound : `${entity} not found`,
    failToCreate : `fail to create ${entity}`,
    failToUpdate : `fail to update ${entity}`,
    createSuccessfully : `create ${entity} successfully`,
    updateSuccessfully : `update ${entity} successfully`,
    deleteSuccessfully : `delete ${entity} successfully`,
    failToDelete : `fail to delete ${entity}`,
    getSuccessfully : `get ${entity} successfully`
})
export const messages = {
    category : {...generateMessage('category')},
    subcategory :{...generateMessage('subcategory')},
    brand : {...generateMessage('brand')},
    product : {...generateMessage('product')},
    file: {...generateMessage('file'), required: 'file is required'},
}