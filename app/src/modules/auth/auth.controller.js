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
    const { email } = req.body;

    // Check if the user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
        return next(new AppError(messages.user.notFound, 404));
    }

    // If OTP already sent and not expired
    if (userExist.otp && userExist.expireDateOtp > Date.now()) {
        return next(new AppError(messages.user.otpAlreadySent, 400));
    }

    // Reset OTP attempt count
    userExist.otpAttempts = 0;

    // Generate and set OTP
    const otp = generateOTP();
    userExist.otp = otp;
    userExist.expireDateOtp = Date.now() + 15 * 60 * 1000;

    // Save to database
    await userExist.save();

    // Send email with OTP
    await sendEmail({
        to: email,
        subject: 'Forget Password',
        html: `<h1>You requested a password reset. Your OTP is ${otp}. If you did not request this, please ignore this email.</h1>`,
    });

    // Send response
    return res.status(200).json({ message: 'Check your email', success: true });
};


export const changPassword = async (req, res, next) => {
    const { otp, newPassword, email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError(messages.user.notFound, 404));
    }

    // Ensure OTP and newPassword are strings
    const otpString = otp.toString();
    const storedOtpString = user.otp ? user.otp.toString() : '';

    // Check if OTP is valid
    if (storedOtpString !== otpString) {
        user.otpAttempts = (user.otpAttempts || 0) + 1;
        await user.save();

        // If OTP attempts exceed 3
        if (user.otpAttempts > 3) {
            user.otp = undefined;
            user.expireDateOtp = undefined;
            user.otpAttempts = undefined;
            await user.save();
            return next(new AppError('Maximum OTP attempts exceeded. Please request a new OTP.', 403));
        }

        return next(new AppError(`Invalid OTP you have ${4 - user.otpAttempts} Try left`, 401));
    }

    // Check if OTP is expired
    if (user.expireDateOtp < Date.now()) {
        const secondOTP = generateOTP();
        user.otp = secondOTP;
        user.expireDateOtp = Date.now() + 5 * 60 * 1000;
        user.otpAttempts = 0; // Reset attempts on new OTP

        await user.save();
        await sendEmail({ to: email, subject: 'Resent OTP', html: `<h1>Your new OTP is ${secondOTP}</h1>` });
        return res.status(200).json({ message: "Check your email", success: true });
    }

    // Hash new password
    const hashedPassword = hashPassword({ password: newPassword });

    // Update password and reset OTP data
    await User.updateOne(
        { email },
        { password: hashedPassword, $unset: { otp: "", expireDateOtp: "", otpAttempts: "" } }
    );

    return res.status(200).json({ message: 'Password updated successfully', success: true });
};

