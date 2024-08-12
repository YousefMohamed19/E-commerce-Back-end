import {Schema,model} from 'mongoose'

//schema
const  categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    image:{
        type:Object,
        required:true},
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:false //todo true
    }
},{ 
    timeStamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
//virtual
categorySchema.virtual('subcategory',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'category'
})
//model
export const Category = model('Category',categorySchema)