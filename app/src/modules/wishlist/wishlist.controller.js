import { Product, User } from "../../../db/index.js"
import { ApiFeature, AppError, messages } from "../../utils/index.js"
// add to wishlist
export const addToWishlist = async (req, res, next) => {
    // get data from req
     const { productId } = req.body
     const { authUser } = req
     //check existance
     const productExist = await Product.findById(productId)
     if (!productExist) {
         return next(new AppError(messages.product.notFound, 404))
     }
     const user = await User.findByIdAndUpdate(
         req.authUser._id,
         { $addToSet: { wishlist: productId } }
         , { new: true }
     )
     return res.status(200).json({
         success: true,
         data: user,
         message: messages.wishlist.addToWishlist
     })

}
// delete from wishlist
export const deleteFromWishlist = async (req, res, next) => {
    // get data from req
    const { productId } = req.params
    const user = await User.findByIdAndUpdate(req.authUser._id, {
        $pull: { wishlist: productId }
    }, {
        new: true
    }).select('wishlist')
    return res.status(200).json({
        message: messages.wishlist.deleteSuccessfully,
        success: true,
        data: user
    })
}


// get wishlist
export const getWishlist = async (req, res, next) => {
    // Fetch the user and their wishlist
    const apiFeatures = new ApiFeature(User.findById(req.authUser._id).populate('wishlist'), req.query).pagination().sort();
    const user = await apiFeatures.mongooseQuery;

    // Check if user exists
    if (!user) {
        return next(new AppError(messages.user.notFound, 404));
    }

    // Ensure the authenticated user is the owner of the account
    if (String(user._id) !== String(req.authUser._id)) {
        return next(new AppError(messages.auth.notAuthorized, 403)); 
    }

    // Check if the user has a wishlist
    if (!user.wishlist || user.wishlist.length === 0) {
        return next(new AppError(messages.wishlist.notFoundWishlist, 404));
    }

    // Send the response with the user's wishlist
    return res.status(200).json({
        success: true,
        data: user.wishlist
    });
};
