import { connectDB } from "../db/connection.js"
import * as allRouters from './index.js'
import { globalErrorHandling } from "./utils/asyncHandler.js"

export const initApp = (app, express) => {
    // parse data
    app.use(express.json())
    // serve static
    app.use('/uploads', express.static('uploads'))
    // connect db
    connectDB()
    // initilize port
    const port = process.env.PORT || 3000
    // create routers
    app.use('/category', allRouters.categoryRouter)
    app.use('/subcategory', allRouters.subcategoryRouter)
    app.use('/product', allRouters.productRouter)
    app.use('/brand', allRouters.brandRouter)
    app.use('/auth', allRouters.authRouter)
    app.use('/admin', allRouters.adminRouter)
    app.use('/wishlist', allRouters.wishlistRouter)
    app.use('/review', allRouters.reviewRouter)
    app.use('/coupon', allRouters.couponRouter)
    app.use('/cart', allRouters.cartRouter)
    app.use('/user', allRouters.userRouter)
    app.use('/order', allRouters.orderRouter)
    // global error handling
    app.use(globalErrorHandling)
    
    
    // start server
    app.listen(port, () => console.log('server is running on port', port))
}