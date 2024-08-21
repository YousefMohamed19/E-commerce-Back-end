import { model, Schema } from "mongoose";

//schema
const subcategorySchema = new Schema({
    name: String,
    image:{
        type:Object,
        required:true},
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true 
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }

},{
    timestamps: true})
//model
export const SubCategory = model("SubCategory", subcategorySchema)