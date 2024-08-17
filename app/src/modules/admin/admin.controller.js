import { User } from "../../../db/index.js"
import cloudinary from "../../utils/cloudinary.js"
import { AppError, hashPassword, messages, status } from "../../utils/index.js"

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
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder: 'users'})
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
    
    // send response
    res.status(201).json({
        success: true,
        message: messages.user.createSuccessfully,
        data: createdUser
    })
}