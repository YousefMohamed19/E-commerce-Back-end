import { Cart, User } from "../../../db/index.js"
import { AppError, messages , sendEmail, generateToken, verifyToken, status, comparePassword, hashPassword, generateOTP} from "../../utils/index.js"

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
     await Cart.create({ user: user._id, products: [] })
    // send response
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





export const forgetPassword = async (req, res, next) => {
    // get data from req
    const { email } = req.body
    // check existence
    const userExist = await User.findOne({ email })// {} , null
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404))
    }
    // if already has email 
    if (userExist.otp && userExist.expireDateOtp > Date.now()) {
        return next(new AppError(messages.user.otpAlreadySent, 400))
    }
    // generate otp
    const otp = generateOTP()
    // update user otp
    userExist.otp = otp
    userExist.expireDateOtp = Date.now() + 15 * 60 * 1000
    // save to db
    await userExist.save()
    // send email
    await sendEmail({
        to: email, subject: 'forget password', html: `<h1>You request forget password \n your otp is ${otp}\n 
        if not you reset your password 
        </h1>` })
    // send response
    return res.status(200).json({ message: 'check your email', success: true })
}

export const changPassword = async (req, res, next) => {
    // get data from req
    const { otp, newPassword, email } = req.body
    // check email
    const user = await User.findOne({ email }) // {} ,null
    if (!user) {
        return next(new AppError(messages.user.notFound, 404))
    }
    if (user.otp != otp) {
        return next(new AppError(messages.user.otpInvalid, 401))
    }
    if (user.expireDateOtp < Date.now()) {
        const secondOTP = generateOTP()
        user.otp = secondOTP
        user.expireDateOtp = Date.now() + 5 * 60 * 1000
        await user.save()
        await sendEmail({ to: email, subject: 'resent otp', html: `<h1>your otp is ${secondOTP}</h1>` })
        return res.status(200).json({ message: "check your email", success: true })
    }
    // hash new password
    const hashedPassword = hashPassword({ password: newPassword })
    // user.password = hashedPassword
    // user.otp = undefined
    // user.expireDateOtp = undefined
    // await user.save()
    await User.updateOne({ email }, { password: hashedPassword, $unset: { otp:"", expireDateOtp:"" } })
    return res.status(200).json({ message: 'password updated successfully', success: true })
}