import { model, Schema } from "mongoose";
import { orderStatus } from "../../src/utils/index.js";

// schema
const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            title: String,
            itemPrice: Number,
            quantity: Number,
            finalPrice: Number
        }
    ],
    address: {
        phone: String,
        street: String,
    },
    coupon: {
        couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
        code: String,
        discount: Number
    },
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PLACED
    },
    payment: {
        type: String,
        enum: ['cash', 'visa'],
        required: true
    },
    orderPrice: Number,
    finalPrice: Number
}, {
    timestamps: true
})
// model
export const Order = model('Order', orderSchema)