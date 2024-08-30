import slugify from "slugify"
import { Category, Product, SubCategory } from "../../../db/index.js"
import { ApiFeature, AppError, deleteFile, messages } from "../../utils/index.js"


// create subcategory
export const createSubcategory = async (req, res, next) => {
    // get data from req
    let {name,category}=req.body
    name = name.toLowerCase()
    // check existance of category
    const categoryExist = await Category.findById(category)
    if (!categoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.category.notFound, 404))
    }
    // check file
    if(!req.file) {
        return next(new AppError(messages.file.required, 400))
    }
    // check existance of subcategory
    const subcategoryExist = await SubCategory.findOne({name})
    if (subcategoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.subcategory.alreadyExist, 409))
    }
    // prepare data
    const slug = slugify(name)
    const subcategory = new SubCategory({
        name,
        slug,
        category,
        image: {path:req.file.path},
        createdBy: req.authUser._id
    })
    // add to database
    const subcategoryCreated = await subcategory.save()
    if (!subcategoryCreated) {
        req.failImage = req.file.path
        return next(new AppError(messages.subcategory.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.subcategory.createSuccessfully,
        success: true,
        data: subcategoryCreated
    })
}

// update subcategory
export const updateSubcategory = async (req, res, next) => {
    // get data from req
    let {name,category}=req.body
    name = name.toLowerCase()
    const {subcategoryId} = req.params
    // check existance of subcategory
    const subcategoryExist = await SubCategory.findById(subcategoryId)
    if (!subcategoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.subcategory.notFound, 404))
    }
    // check existance of category
    const categoryExist = await Category.findById(category)
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // check name
    if(name){
        const nameExist = await SubCategory.findOne({ name, _id: { $ne: subcategoryId } });
        if(nameExist){
            return next(new AppError(messages.subcategory.alreadyExist, 409))
        }
        subcategoryExist.name = name
        subcategoryExist.slug = slugify(name)
    }
    if(req.file){
        deleteFile(subcategoryExist.image.path)
        subcategoryExist.image = {path:req.file.path}
    }
    // save data
    const updatedSubcategory = await subcategoryExist.save()
    if (!updatedSubcategory) {
        req.failImage =req.file.path
        return next(new AppError(messages.subcategory.failToUpdate, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.subcategory.updateSuccessfully,
        success: true,
        data: updatedSubcategory
    })
}



// get subcategory
export const getSpecificSubcategories = async (req, res, next) => {
    // get data from req
    const {categoryId} = req.params
    // check existance of category
    const categoryExist = await Category.findById(categoryId)
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // get subcategory
    const subcategories = await SubCategory.find({category:categoryId}).populate('category')
    if (!subcategories) {
        return next(new AppError(messages.subcategory.notFound, 404))
    }
    // send response
    return res.status(200).json({
        message: messages.subcategory.getSuccessfully,
        success: true,
        data: subcategories
    })  

}


// delete subcategory
export const deleteSubcategory = async (req, res, next) => {
    // get data from req
    const {subcategoryId} = req.params
    // check existance of subcategory
    const subcategoryExist = await SubCategory.findById(subcategoryId)
    if (!subcategoryExist) {
        return next(new AppError(messages.subcategory.notFound, 404))
    }
    
    const products = await Product.find({ category: subcategoryId }).select(["mainImage", "subImages"])
    const productIds = products.map(product => product._id) // [id1 , id2 , id3]

    // delete products
    await Product.deleteMany({ _id: { $in: productIds } });

    // Delete images of products
    products.forEach(product => {
        deleteFile(product.mainImage);
        product.subImages.forEach(image => {
            deleteFile(image);
        });
    });
    // delete subcategory
    await SubCategory.deleteOne({_id:subcategoryId})
    // delete image
    deleteFile(subcategoryExist.image.path)
    // send response
    return res.status(200).json({
        message: messages.subcategory.deleteSuccessfully,
        success: true
    })
}


// get all subcategory
export const getSubcategories = async (req, res, next) => {
    const apiFeature = new ApiFeature(SubCategory.find().populate('category'), req.query).filter().sort().select().pagination()
    const subcategories = await apiFeature.mongooseQuery
    return res.status(200).json({message: messages.subcategory.getSuccessfully, data: subcategories, success: true })
}