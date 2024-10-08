import { Cart, User } from "../../../db/index.js"
import cloudinary from "../../utils/cloudinary.js"
import { ApiFeature, AppError, hashPassword, messages, roles, status } from "../../utils/index.js"


// add user
export const addUser = async (req, res, next) => {
    // get data from req
    const { userName, email, phone, role,address,DOB } = req.body
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
        address:JSON.parse(address),
        DOB,
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

// add admin
export const addAdmin = async (req, res, next) => {
    // get data from req
    const { userName, email, phone ,address, DOB} = req.body
    // check user admin
    const userExist = await User.findOne({ email })// null , {}
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }

    // upload image
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "e-comerce/admin" })
        req.body.image = { secure_url, public_id }
    }
    const hashedPassword = hashPassword({password:"admin123"})
    const createdUser = await User.create({
        userName,
        email,
        phone,
        role:roles.ADMIN,
        status: status.VERIFIED,
        image: req.body.image,
        password: hashedPassword,
        address:JSON.parse(address),
        DOB
    })
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    // create cart for the user
    await Cart.create({ user: createdUser._id, products: [] });
    return res.status(201).json({
        message: messages.user.createSuccessfully,
        success: true,
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
        if (req.authUser.role === 'admin' && user.role === 'admin' || req.authUser.role === 'superadmin' && user.role === 'superadmin') {
            return next(new AppError(messages.user.cannotDeleteAdmin, 403)); 
        }

        // delete the user
        await User.findByIdAndDelete(userId);

        // delete image from cloudinary if it exists
        if (user.image) {
            await cloudinary.uploader.destroy(user.image.public_id);
        }
        await Cart.deleteMany({ user: userId });

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