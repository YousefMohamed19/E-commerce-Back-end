import { User } from "../../../db/index.js"
import cloudinary from "../../utils/cloudinary.js"
import { comparePassword, hashPassword,AppError,messages, deleteFile, status, generateToken, sendEmail } from "../../utils/index.js"
// reset password
export const resetPassword = async (req, res, next) => {
    // get data from req
    const { oldPassword, newPassword } = req.body
    const userId = req.authUser._id
    // check user password
    const match = comparePassword({ password: oldPassword, hashPassword: req.authUser.password })
    if (!match) {
        return next(new AppError(messages.password.invalidCredential, 401))
    }
    // hash password
    const hashedPassword = hashPassword({ password: newPassword })
    // update user
    await User.updateOne({ _id: userId }, { password: hashedPassword })
    // send response
    return res.status(200).json({ message: messages.user.updateSuccessfully, success: true })
}


// get user
export const getUser = async (req, res, next) => {
    const user = await User.findById(req.authUser._id)
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    return res.status(200).json({ success: true, data: user })
}


// update user
export const updateUser = async (req, res, next) => {
    // get data from req
    const { userName, email, phone, DOB, address } = req.body;
        const userId = req.authUser._id;
        // check user
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(messages.user.notFound, 404));
        }
        // check image by all cases
        if (req.file) {
            //check user have imge but non deafult
            if(user.image && user.image.public_id !==process.env.PUBLIC_ID){
                await cloudinary.uploader.destroy(user.image.public_id);
            }
            // upload image
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder:"e-comerce/users",
            })
            req.body.image = { secure_url, public_id }
        }
        //update email
        if (email) {
            // check email is with anthor user
            const userExist = await User.findOne({ email });
            if (userExist && email !== user.email) {
                return next(new AppError(messages.user.emailExist, 400));
            }
            // check current email
            if(userExist && email === user.email){
                user.email = email
            }
            // check email existance
            user.email = email
            user.status=status.PENDING
            user.isActive=false
            const token = generateToken({payload:{_id:user._id}})
            // send email
        sendEmail({ to: email, subject: 'Verfiy Account', html: `<p>To verify your account click 
            <a href='${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}'>link</a>
            </p>`
        })
        }
        user.userName=userName || user.userName
        user.phone=phone || user.phone
        // user.address=address || user.address
        if(address){
            user.address=JSON.parse(address)||user.address
        }
        user.DOB=DOB || user.DOB
        user.image=req.body.image || user.image

        const updatedUser = await user.save();
        if (!updatedUser) {
            return next(new AppError(messages.user.failToUpdate, 500));
        }
        // Send response
        return res.status(200).json({ message: messages.user.updateSuccessfully, success: true, data: updatedUser });

}


// delete user
export const deleteUser = async (req, res, next) => {
    // get data from req
    const userId = req.authUser._id
    // check user
    const user = await User.findById(userId)
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // delete image
    if(user.image && user.image.public_id !==process.env.PUBLIC_ID){
        await cloudinary.uploader.destroy(user.image.public_id)
    }
    // delete user
    const deletedUser =await User.deleteOne({ _id: userId })
    if (!deletedUser) {
        return next(new AppError(messages.user.failToDelete, 500))
    }
    // send response
    return res.status(200).json({ message: messages.user.deleteSuccessfully, success: true })
}


// logout
export const logout = async (req, res, next) => {
    // get data from req
    const userId = req.authUser._id
    // check user
    const user = await User.findByIdAndUpdate(userId, { isActive: false },{new :true})
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // send response
    return res.status(200).json({ message: messages.user.logoutSuccessfully, success: true })
}


