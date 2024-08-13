import { Brand } from "../../../db/index.js"
import { AppError, deleteFile, messages,ApiFeature } from "../../utils/index.js"

// create brand
export const createBrand = async (req, res, next) => {
    // get data from req
    let { name } = req.body;
    name = name.toLowerCase();
    // check file
    if (!req.file) {
        return next(new AppError(messages.file.required, 400));
    } 
    // check if brand exist
    const brandExist = await Brand.findOne({ name });
    if (brandExist) {
        req.failImage = req.file.path
        return next(new AppError(messages.brand.alreadyExist, 400));
    }
    // prepare data
    const brand = new Brand({
        name,
        logo: req.file.path
    });
    // save data
    const createdBrand = await brand.save();
    if (!createdBrand) {
        req.failImage = req.file.path
        return next(new AppError(messages.brand.failToCreate, 500));
    }
    // send response
    res.status(201).json({
        success: true,
        message: messages.brand.createSuccessfully,
        data: createdBrand
    });
}

// update brand
export const updateBrand = async (req, res, next) => {
    // get data from req
    let { name } = req.body;
    name = name.toLowerCase();
    const {brandId} = req.params;

    // check if brand exist
    const brandExist = await Brand.findById(brandId);
    if (!brandExist) {
        // remove file
        deleteFile(brandExist.logo.path);
        return next(new AppError(messages.brand.notFound, 404));
    }
    // check name
    if(name){
        const nameExist = await Brand.findOne({ name, _id: { $ne: brandId } });
        if(nameExist){
        return next(new AppError(messages.brand.alreadyExist, 409))
    }
    brandExist.name = name
    }
    if(req.file){
        deleteFile(brandExist.logo.path)
        brandExist.logo = req.file.path
    }
    // save data
    const updatedBrand = await brandExist.save();
    if (!updatedBrand) {
        // remove file
        deleteFile(brandExist.logo.path);
        return next(new AppError(messages.brand.failToUpdate, 500));
    }
    // send response
    res.status(200).json({
        success: true,
        message: messages.brand.updateSuccessfully,
        data: updatedBrand
    });


}


// delete brand
export const deleteBrand = async (req, res, next) => {
    // get data from req
    const { brandId } = req.params;
    // check if brand exist
    const brandExist = await Brand.findById(brandId);
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404));
    }
    // delete image
    deleteFile(brandExist.logo);
    // delete brand
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
        return next(new AppError(messages.brand.failToDelete, 500));
    }
    // send response
    res.status(200).json({
        success: true,
        message: messages.brand.deleteSuccessfully,
        data: deletedBrand
    });
}



// get all brands
export const getAllBrands = async (req, res, next) => {
    const apiFeatures = new ApiFeature(Brand.find(), req.query).pagination().sort().select().filter();
    const brands = await apiFeatures.mongooseQuery;
    if (!brands) {
        return next(new AppError(messages.brand.notFound, 404));
    }
    // send response
    res.status(200).json({
        success: true,
        message: messages.brand.getSuccessfully,
        data: brands
    });
}