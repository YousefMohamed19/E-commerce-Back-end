import { AppError, messages, verifyToken } from "../utils/index.js"
import { User } from "../../db/index.js"

// function check logged
export const isAuthenticate =  () => {
    return async (req, res, next) => {
        const {token} = req.headers
        if (!token) {
            return next(new AppError(messages.auth.required,401))
        }
        let payload = null
        try {
            payload = verifyToken({ token})
        } catch (error) {
            return next(new AppError(error.message, 500))
        }
        if (!payload?._id) {
            return next(new AppError('invalid payload', 401))
        }
        // const payload = verifyToken({token})
        const user = await User.findById(payload._id)
        if (!user) {
            return next(new AppError(messages.user.notFound, 401))
        }
        req.authUser = user
        next()
    }
}
// function check role
export const isAuthorized =(roles=[])=>{
    return (req,res,next)=>{
        const user = req.authUser
        if(!roles.includes(user.role)){
            return next(new AppError(messages.auth.notAuthorized, 401))
        }
        next()
    }
}


// export const isAuthenticated = () => {
//     return async (req, res, next) => {
//         const {authorization} = req.headers
//     const {bearer, token} = authorization.split(' ')
//     // check token verify
//     let result = ''
//     if(bearer == 'access-token'){
//         result = verifyToken({token , secretKey:process.env.secretKeyAccessToken})
//     }
//     else if(bearer == 'reset-password'){
//         result = verifyToken({token , secretKey:process.env.secretKeyResetPassword})
//     }
//     if(result.message){
//         return next(new AppError(result.message))
//     }
//     //check user
//     const user = await User.findOne({_id:result._id , status:status.VERIFIED}).select('-password')
//     if(!user){
//         return next(new AppError(messages.user.notFound, 401))
//     }
//     req.authUser = user
//     next()
//     }
// }