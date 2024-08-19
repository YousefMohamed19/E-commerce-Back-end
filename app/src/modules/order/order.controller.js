import { Cart, Coupon, Product ,Order} from "../../../db/index.js"
import { ApiFeature, AppError, messages, orderStatus } from "../../utils/index.js"
// create order
export const createOrder = async (req, res,next) => {
    // get data from req
    const { address, phone, coupon, payment } = req.body
    // check coupon
    const couponExist = await Coupon.findOne({couponCode: coupon})
    if (!couponExist) {
        return next(new AppError(messages.coupon.notFound, 404))
    }
    if(couponExist.fromDate > Date.now() || couponExist.toDate < Date.now()) {
        return next(new AppError(messages.coupon.expired, 400))
    }
    // check cart
    const cart = await Cart.findOne({ user: req.authUser._id }).populate('products.productId')
    const products = cart.products
    if(products.length <= 0) {
        return next(new AppError(messages.cart.notFound, 404))
    }
    // check product
    let orderProducts =[]
    let orderPrice =0
    for (const product of products) {
        const productExist = await Product.findById(product.productId)
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404))
        }
        if (!productExist.inStock(product.quantity)) {
            return next(new AppError(messages.product.outOfStock, 400))
        }
        orderProducts.push({
            productId:productExist._id,
            title:productExist.title,
            itemPrice:productExist.finalPrice,
            quantity:product.quantity,
            finalPrice:productExist.finalPrice * product.quantity
        })
        orderPrice += productExist.finalPrice * product.quantity
    }
    // Calculate final price based on coupon type
    let discount = 0;
    if (couponExist.couponType === 'fixedAmount') {
        discount = couponExist.couponAmount;
    } else if (couponExist.couponType === 'percentage') {
        discount = orderPrice * (couponExist.couponAmount / 100);
    }
    const finalPrice = Math.max(orderPrice - discount, 0);
    // prepare data
    const order = new Order({
        user: req.authUser._id,
        products:orderProducts,
        address,
        phone,
        coupon:{
            couponId: couponExist?._id,
            code: couponExist?.couponCode,
            discount: couponExist?.couponAmount
        },
        status:orderStatus.PLACED,
        payment,
        orderPrice,
        finalPrice
    })
    // prepare data
    const createdOrder = await order.save()
    if (!createdOrder) {
        return next(new AppError(messages.order.failToCreate, 500))
    }
    // if (payment === 'visa') {

    // }
    // send response
    return res.status(201).json({
        message: messages.order.createSuccessfully,
        success: true,
        data: createdOrder
    })
}


// get order
export const getOrder = async (req, res, next) => {
    const apiFeature = new ApiFeature(Order.find({ user: req.authUser._id }), req.query).pagination().sort().select().filter()
    const orders = await apiFeature.mongooseQuery
    if (!orders) {
        return next(new AppError(messages.order.notFound, 404))
    }
    // send response
    return res.status(200).json({
        message: messages.order.getSuccessfully,
        success: true,
        data: orders
    })
}


