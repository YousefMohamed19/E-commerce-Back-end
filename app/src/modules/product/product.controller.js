import slugify from "slugify";
import { Brand, Category ,Product,SubCategory} from "../../../db/index.js";
import { AppError, messages } from "../../utils/index.js";

// create product
export const createProduct = async (req,res,next) => {
    // get data from request
    const {title,description,category,subcategory,brand,price,discount,size,colors,stock}= req.body
    // check category is exist
    const categoryExist = await Category.findById(category)
    if(!categoryExist){
        return next (new AppError(messages.category.notFound,404))
    }
    // check subcategory is exist
    const subcategoryExist = await SubCategory.findById(subcategory)
    if(!subcategoryExist){
        return next (new AppError(messages.subcategory.notFound,404))
    }
    // check brand is exist
    const brandExist = await Brand.findById(brand)
    if(!brandExist){
        return next (new AppError(messages.brand.notFound,404))
    }
    // prepare data
    const slug = slugify(title)

    // create product
    const product = new Product({
        title,
        slug,
        mainImage: req.files.mainImage[0].path,
        subImages:req.files.subImages.map((img)=>img.path),
        description,
        category,
        subcategory,
        brand,
        price,
        discount,
        size:JSON.parse(size),
        colors:JSON.parse(colors),
        stock})

    // save product
    const createdProduct = await product.save()
    if (!createdProduct) {
        return next(new AppError(messages.product.failToCreate, 400))
    }
    // send response
    res.status(201).json({
        messages: messages.product.createSuccessfully,
        success:true,
        data: createdProduct
    })
}


// update product
export const updateProduct = async (req,res,next) => {
    // get data from request
    const {productId} = req.params
    const {title,description,category,subcategory,brand,price,discount,size,colors,stock}= req.body
    // check category is exist
    const categoryExist = await Category.findById(category)
    if(!categoryExist){
        return next (new AppError(messages.category.notFound,404))
    }
    // check subcategory is exist
    const subcategoryExist = await SubCategory.findById(subcategory)
    if(!subcategoryExist){
        return next (new AppError(messages.subcategory.notFound,404))
    }
    // check brand is exist
    const brandExist = await Brand.findById(brand)
    if(!brandExist){
        return next (new AppError(messages.brand.notFound,404))
    }
    // prepare data
    const slug = slugify(title)
    // update product
    const updatedProduct = await Product.findByIdAndUpdate(productId,{
        title,
        slug,
        mainImage: req.files.mainImage[0].path,
        subImages:req.files.subImages.map((img)=>img.path),
        description,
        category,
        subcategory,
        brand,
        price,
        discount,
        size:JSON.parse(size),
        colors:JSON.parse(colors),
        stock
    })
    if (!updatedProduct) {
        return next(new AppError(messages.product.failToUpdate, 400))
    }
    // send response
    res.status(200).json({
        messages: messages.product.updateSuccessfully,
        success:true,
        data: updatedProduct
    })
}