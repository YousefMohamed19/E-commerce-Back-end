import Stripe from "stripe";
import { Cart, Order, Product } from "../../db/index.js";
import { asyncHandler } from "./asyncHandler.js";

export const webhook = asyncHandler(
    async (req, res) => {
        const sig = req.headers['stripe-signature'].toString()
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        let event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_9tc9ABjo2hhKEk0yIgUWdvW8KW0Jkx70');


        // Handle the event checkout.session.completed
        if (event.type === 'checkout.session.completed') {
            const checkout = event.data.object
            const orderId = checkout.metadata.orderId
            const orderExist = await Order.findByIdAndUpdate(orderId, { status: 'placed' }, { new: true })
            const cart = await Cart.findOneAndUpdate({ user: orderExist.user }, { products: [] } , { new: true })
        }
        // return a 200 res to acknowledge receipt of the event
        res.send()
    })