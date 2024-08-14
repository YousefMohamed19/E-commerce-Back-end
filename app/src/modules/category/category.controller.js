import slugify from "slugify"
import { Category, Product, SubCategory } from "../../../db/index.js"
import { AppError ,messages, deleteFile,ApiFeature} from "../../utils/index.js"
import cloudinary from "../../utils/cloudinary.js"


// add category
export const addCategory = async (req, res,next) => {

    // get data from req
    let { name } = req.body
    name =name.toLowerCase()
    // check file
    if(!req.file) {
        return next(new AppError(messages.file.required, 400))
    }

    // check existance
    const categoryExist = await Category.findOne({name})
    if (categoryExist) {
        req.failImage = req.file.path
        return next (new AppError(messages.category.alreadyExist,409))
    }
    //prpare data
    const slug = slugify(name)
    const category = new Category({
        name,
        slug,
        image: {path:req.file.path}
    })
    // add to db
    const createdCategory = await category.save()
    if(!createdCategory) {
        req.failImage = req.file.path
        return next(new AppError(messages.category.failToCreate, 500))
    }
    // send response
    return res.status(201).json({
        message: messages.category.createSuccessfully,
        success:true,
        data:createdCategory})
}




// update category
export const updateCategory =async (req, res,next) => {
    //get data from req
    const {categoryId} = req.params
    const {name} = req.body
    //check existance
    const categoryExist = await Category.findById(categoryId)
    if(!categoryExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.category.notFound, 404))
    }
    //check name existance
    const nameExist = await Category.findOne({name, _id:{$ne:categoryId}})
    if(nameExist) {
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    // prepare data
    if (name) {
        categoryExist.slug = slugify(name)
    }
    // update image
    if(req.file) {
        //delete old image
        deleteFile(categoryExist.image)
        // update new image
        categoryExist.image.path = req.file.path
    }
    // update to db
    const updatedCategory=await categoryExist.save()
    if(!updatedCategory) {
        req.failImage =req.file.path
        return next(new AppError(messages.category.failToUpdate, 500))
    }
    // send response
    return res.status(200).json({
        message: messages.category.updateSuccessfully,
        success:true,
        data:updatedCategory
    })
}




// get category
export const getSpecificCategory = async (req, res,next) => {
    // get data from req
    const {categoryId} = req.params

      //check existance
    const categoryExist = await Category.findById(categoryId).populate([{path:'subcategory'}])
    

     categoryExist ?
     res.status(200).json({
         message: messages.category.getSuccessfully,
         success:true,
         data:categoryExist
     })
     : next(new AppError(messages.category.notFound, 404))
    // axios({
    //     method: 'get',
    //     url: `${req.protocol}://${req.headers.host}/sub-category/${req.params.categoryId}`
    // }).then((response) => {
    //     return res.status(response.status).json(response.data)}).catch((error) => {
    //     return next(new AppError(error.message, 500))
    // })
    //   const categoryExist = await Category.aggregate([
    //       {
    //           $match: {
    //               _id: new Types.ObjectId(categoryId)
    //           }
    //       },
    //       {
    //           $lookup: {
    //               from: "subcategories",
    //               localField: '_id',
    //               foreignField: "category",
    //               as: "subcategories"
    //           }
    //       }
    //   ])
}



// get all category with api feature
export const getAllCategory = async (req, res,next) => {
    const apiFeature = new ApiFeature(Category.find(), req.query).pagination().sort().select().filter()
    const categories = await apiFeature.mongooseQuery
    if (!categories) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // send response
    return res.status(200).json({
        message: messages.category.getSuccessfully,
        success:true,
        data: categories
    })
}



// delete category
export const deletCategory = async (req, res, next) => {
    // get data from req
    const { categoryId } = req.params

    // check category existance
    const categoryExist = await Category.findById(categoryId)
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }

    // prepare ids
    const subcategories = await SubCategory.find({ category: categoryId }).select("image")
    const products = await Product.find({ category: categoryId }).select(["mainImage", "subImages"])
    const subcategoriesIds = subcategories.map(sub => sub._id) // [id1 , id2 , id3]
    const productIds = products.map(product => product._id) // [id1 , id2 , id3]

    // delete subCategories
    await SubCategory.deleteMany({ _id: { $in: subcategoriesIds } });

    // delete products
    await Product.deleteMany({ _id: { $in: productIds } });

    // Delete images of subcategories
    subcategories.forEach(subcategory => {
        deleteFile(subcategory.image.path);
    });

    // Delete images of products
    products.forEach(product => {
        deleteFile(product.mainImage);
        product.subImages.forEach(image => {
            deleteFile(image);
        });
    });

    // delete category
    const deletedCategory = await Category.deleteOne({ _id: categoryId })
    if (!deletedCategory) {
        return next(new AppError(messages.category.failToDelete))
    }
    // delete category image
    deleteFile(categoryExist.image.path)

    return res.status(200).json({ message: messages.category.deleteSuccessfully, success: true })
}






//-----------------cloud---------------//
// create category with cloud
export const CreateCategoryCloud = async (req, res, next) => {
    //get data from request
    const { name } = req.body
    //check file
    if (!req.file) {
        return new AppError(messages.file.required, 400)
    }
    //check existance
    const categoryExist = await Category.findOne({ name: name.toLowerCase() })
    if (categoryExist) {
        return next(new AppError(messages.category.alreadyExist, 409))
    }
    //prepare data
    const slug = slugify(name)
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,
        {
            folder: 'e-comerce/category'
            // public_id:category.image.public_id
        })
    const category = new Category({
        name,
        slug,
        image: {secure_url,public_id}
    })
    //add to database
    const createdCategory = await category.save()
    if (!createdCategory) {

        return next(new AppError(messages.category.failToCreate, 500))
    }
    //send res
    return res.status(201).json({
        message: messages.category.createSuccessfully,
        success: true,
        data: createdCategory
    })
}



// delete category with cloud
export const deleteCategoryCloud = async (req, res, next) => async (req, res, next) => {
    // get data from req
    const { categoryId } = req.query
    // check existence
    const categoryExist = await Category.findByIdAndDelete(categoryId)// {}, null
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404))
    }
    // prepare ids
    const subcategories = await SubCategory.find({ category: categoryId }).select('image')
    const products = await Product.find({ category: categoryId }).select('mainImage subImages')
    const imagePaths = []


    const subcategoryIds = []
    subcategories.forEach(sub => {
        imagePaths.push(sub.image)
        subcategoryIds.push(sub._id)
    })//[1,2,3,4]
    const productIds = []
    products.forEach(prod => {
        imagePaths.push(prod.mainImage);
        imagePaths.push(...prod.subImages)
        productIds.push(prod._id);
    })//[1,2,3]
    // delete subcategories
    await SubCategory.deleteMany({ _id: { $in: subcategoryIds } })
    await Product.deleteMany({ _id: { $in: productIds } })
    // delete images
    // const imagePaths = subcategories.map(sub => sub.image)//['']
    // for (let i = 0; i < products.length; i++) {
    //     imagePaths.push(products[i].mainImage)
    //     imagePaths.push(...products[i].subImages)
    // }
    for (let i = 0; i < imagePaths.length; i++) {
        if (typeof (imagePaths[i]) === "string") {
            deleteFile(imagePaths[i])
        }
        else {
            await cloudinary.uploader.destroy(imagePaths[i].public_id)
        }
    }
    // another sol >>> delete folder
    await cloudinary.api.delete_resources_by_prefix(`e-comerce/category/${categoryId}`)
    await cloudinary.api.delete_folder(`e-comerce/category/${categoryId}`)
}



// update category with cloud
export const updateCategoryCloud = async (req, res, next) => {
    const { categoryId } = req.params
    const category = await Category.findById(categoryId)
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { public_id: category.image.public_id })
        req.body.image = { secure_url, public_id }
    }

    category.name = req.body.name || category.name
    category.image = req.body.image || category.image// {secure_}
    await category.save()
    return res.json('done')
}
