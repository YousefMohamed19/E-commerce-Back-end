import dotenv from 'dotenv';
import { model, Schema } from "mongoose";
import path from 'path';
import { roles, status } from '../../src/utils/index.js';

dotenv.config({ path: path.resolve('./config/.env') })
// schema
const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        phone: {
            type: String,
        },
        password: { type: String, required: true },
        role: {
            type: String,// Customer Admin seller
            enum: Object.values(roles),//['customer','admin','seller']
            default: roles.CUSTOMER
        },
        status: {
            type: String,
            enum: Object.values(status),
            default: status.PENDING
        },
        isActive: {
            type: Boolean,
            default: false
        },
        image: {
            type: Object,
            default: {
                secure_url: process.env.SECURE_URL,
                public_id: process.env.PUBLIC_ID
            }
        },// {secure_url,public_id}
        DOB: Date,
        address: [
            {
                street: String,
                city: String,
                phone: String
            }
        ],
        wishlist: [{
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
        ],
        otp: Number,
        expireDateOtp: Date,
        otpAttempts: { type: Number, default: 0 }

    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
)
// hooks
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = hashPassword({ password: this.password });
//     }
//     next();
// });


// model
export const User = model('User', userSchema)