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
        image: {path:req.file.path},
        createdBy: req.authUser._id

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
export const updateCategory = async (req, res, next) => {
    
        // Get data from request
        const { categoryId } = req.params;
        const { name } = req.body;

        // Check if the category exists
        const categoryExist = await Category.findById(categoryId);
        if (!categoryExist) {
            return next(new AppError(messages.category.notFound, 404));
        }

        // Check if a category with the new name already exists (excluding the current category)
        const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } });
        if (nameExist) {
            return next(new AppError(messages.category.alreadyExist, 409));
        }

        // Prepare data for update
        categoryExist.name = name;
        categoryExist.slug = slugify(name);

        // Handle image update
        if (req.file) {
            // Delete old image if it exists
            if (categoryExist.image?.path) {
                deleteFile(categoryExist.image.path);
            }
            // Update to new image path
            categoryExist.image = { path: req.file.path };
        }

        // Update category in the database
        const updatedCategory = await categoryExist.save();
        if (!updatedCategory) {
            // In case of failure, delete the new image if it was uploaded
            if (req.file && req.file.path) {
                deleteFile(req.file.path);
            }
            return next(new AppError(messages.category.failToUpdate, 500));
        }

        // Send response
        return res.status(200).json({
            message: messages.category.updateSuccessfully,
            success: true,
            data: updatedCategory,
        });

};





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
        image: {secure_url,public_id},
        createdBy: req.authUser._id
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
export const deleteCategoryCloud =  async (req, res, next) => {
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
        deleteFile(subcategory.image);
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
    await cloudinary.uploader.destroy(categoryExist.image.public_id)

    return res.status(200).json({ message: messages.category.deleteSuccessfully, success: true })

}








// update category with cloud
export const updateCategoryCloud = async (req, res, next) => {
        // get data from req
    const { name } = req.body;
    const {categoryId} = req.params
    // check category
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(new AppError(messages.category.notFound, 404));
    }
    // prepare data
    category.name = name
    category.slug = slugify(name)
    // handle image
    if(req.file){
        // delete old image
        if(category.image?.public_id){
            await cloudinary.uploader.destroy(category.image.public_id)
        }
        // upload new image
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,
            {
                folder: 'e-comerce/category'
                // public_id:category.image.public_id
            })
        category.image = {secure_url,public_id}
    }
    // update category
    const updateCategory = await category.save();
    if (!updateCategory) {
        return next(new AppError(messages.category.failToUpdate, 500));
    }
    // Send response
    return res.status(200).json({ message: messages.category.updateSuccessfully, success: true, data: updateCategory });

}

