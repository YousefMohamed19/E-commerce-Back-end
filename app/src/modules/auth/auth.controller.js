import bcrypt from 'bcrypt'
import { User } from "../../../db/index.js"
import { AppError, messages , sendEmail, generateToken, verifyToken, status, comparePassword, hashPassword} from "../../utils/index.js"

export const signUp = async(req, res, next) => {
    // get data from req
    let { userName, email, password, phone,DOB } = req.body   
    // check existance
    const userExist = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExist) {
        return next(new AppError(messages.user.alreadyExist, 409))
    }
    // prepare data
    // hash password
    password = hashPassword({ password })
    const user = new User({
        userName,
        email,
        password,
        phone,
    })
    // save data
    const createdUser = await user.save()
    if (!createdUser) {
        return next(new AppError(messages.user.failToCreate, 500))
    }
    // create token
    const token = generateToken({ payload: { _id: createdUser._id } })
    // send email
    sendEmail({ to: email, subject: 'Verfiy Account', html: `<p>To verify your account click 
        <a href='${req.protocol}://${req.headers.host}/auth/verify-account?token=${token}'>link</a>
        </p>`
     })
    // send response
    res.status(201).json({
        success: true,
        message: messages.user.createSuccessfully,
        data: createdUser
    })  
}


// verify account
export const verifyAccount = async(req, res, next) => {
    // get data from req
    const { token } = req.query
    const decoded = verifyToken({token})
    const user =await User.findByIdAndUpdate(decoded._id, { status:status.VERIFIED }, { new: true })
    if(!user) return next(new AppError(messages.user.notFound, 404))
    return res.status(200).json({
        message: messages.user.verifySuccessfully,
        success:true
    })    
}



// login 
export const login = async(req, res, next) => {
    // get data from req
    const { email, password,phone } = req.body
    // check existance
    const user = await User.findOne({ $or: [{ email }, { phone }],status:status.VERIFIED })
    if (!user) {
        return next(new AppError(messages.user.invalidCredentials, 404))
    }
    // check password
    const match = comparePassword({ password, hashPassword: user.password })
    if (!match) {
        return next(new AppError(messages.user.invalidCredentials, 400))
    }
    // check status
    // if (user.status !== status.VERIFIED) {
    //     return next(new AppError(messages.user.notVerified, 400))
    // }
    user.isActive = true
    await user.save()
    // create token
    const accessToken = generateToken({ payload: { _id: user._id } })
    // send response
    res.status(200).json({
        success: true,
        message: messages.user.loginSuccessfully,
        accessToken
    })
}