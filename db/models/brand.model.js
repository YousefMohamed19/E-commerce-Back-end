// schema
import { Schema, model } from "mongoose";

const brandSchema = new Schema({
    name: {
        type: String, 
        required: true,
        trim: true, 
        unique: true,
        lowercase: true 
    },
    logo:{
        type: Object,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }
}, { timestamps: true , toJSON:{virtuals:true}, toObject:{virtuals:true}});
// virtual
brandSchema.virtual('products',{
    ref:'Product',
    localField:'_id',
    foreignField:'brand',
})
//model
export const Brand = model("Brand", brandSchema)