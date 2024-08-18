import { Cart, User } from "../../../db/index.js"
import cloudinary from "../../utils/cloudinary.js"
import { ApiFeature, AppError, hashPassword, messages, status } from "../../utils/index.js"

export const addUser = async (req, res, next) => {
    // get data from req
    const { userName, email, phone, role } = req.body
    // check user existance
    const userExist = await User.findOne({ email })
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }
    // prepare data
    if(req.file) {
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: 'e-comerce/users'})
    req.body.image = {secure_url, public_id}
    }
    const hashedPassword = hashPassword({ password: 'e-commerce' })
    const createdUser= await User.create({
        userName,
        email,
        phone,
        role,
        password: hashedPassword,
        status:status.VERIFIED,
        image: req.body.image
    })  
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
     // create cart for the user
     await Cart.create({ user: createdUser._id, products: [] });
    // send response
    res.status(201).json({
        success: true,
        message: messages.user.createSuccessfully,
        data: createdUser
    })
}



// get users
export const getUsers = async (req, res, next) => {
    const apiFeatures = new ApiFeature(User.find(), req.query).pagination().sort().select().filter();
    const users = await apiFeatures.mongooseQuery;
    if (!users) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // send response
    res.status(200).json({
        success: true,
        message: messages.user.getSuccessfully,
        data: users
    })
}


// delete user
export const deleteUser = async (req, res, next) => {
        // get data from req
        const { userId } = req.params;

        // find the user to be deleted
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(messages.user.notFound, 404));
        }

        // check if the requesting user is an admin and if they are trying to delete another admin
        if (req.authUser.role === 'admin' && user.role === 'admin') {
            return next(new AppError(messages.user.cannotDeleteAdmin, 403)); 
        }

        // delete the user
        await User.findByIdAndDelete(userId);

        // delete image from cloudinary if it exists
        if (user.image) {
            await cloudinary.uploader.destroy(user.image.public_id);
        }

        // send response
        res.status(200).json({
            success: true,
            message: messages.user.deleteSuccessfully,
            data: user
        });
    
};


// update user
export const updateUser = async (req, res, next) => {
    // get data from req
    const {userId} = req.params
    const {role} = req.body
    const user = await User.findByIdAndUpdate(userId, {role}, {new: true})
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // send response
    res.status(200).json({
        success: true,
        message: messages.user.updateSuccessfully,
        data: user
    })
}