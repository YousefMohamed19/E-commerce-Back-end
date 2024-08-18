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
    user: {...generateMessage('user'),
        verifySuccessfully: 'Your account verifed successfully',
        invalidCredentials:'Invalid credentials',
        loginSuccessfully: 'Login successfully',
        notVerified: 'Your account is not verified',
        cannotDeleteAdmin: 'You cannot delete an admin',
        otpAlreadySent: 'otp already sent',
        otpInvalid: 'Invalid otp',},
    auth: {...generateMessage('auth'), required: 'token is required',
        notAuthorized: 'You are not authorized'},
    wishlist : {...generateMessage('wishlist'),
        addToWishlist: 'Added to wishlist successfully',
        notFoundWishlist: 'Your wishlist is empty'},
    review : {...generateMessage('review'),notFoundReview:'This product has no review'},
    coupon : {...generateMessage('coupon'),invalidAmount:'Must be less than 100'},
    cart : {...generateMessage('cart'),
        notFoundCart: 'Your cart is empty'}
        
}