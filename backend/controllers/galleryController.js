import galleryImage from "../models/GalleryImage.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import log from "../utils/logger.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);


/**
 * Public api so everyone can access it
 * Get all galleries
 * Route: GET /api/gallery
 */
export const getAllImages = async (req,res,next) => {
    try{
        const filter = {};
        if(req.params.style){
            filter.style = req.params.style;
            /**
             * If a url has a query like : /api/gallery?style=realism
             * then filtering of image with style=realism takes place
             * and it is sorted in such an order that newest image added in the gallery will be at the top
             */
            const images = await galleryImage.find(filter).sort({createdAt:-1});
            res.status(200).json({
                success:true,
                count:images.length,
                images
            })
        }
    }catch(error){
        next(error);
    }
}


/**
 * Upload image in gallery
 * Route  POST /api/gallery
 * Only admin can perform it
 */
export const uploadImage = async(req,res,next)=>{
    try{
        /**
         * Checks if an image was uploaded from Multer middleware
         */
        if(!req.file){
            const error = new Error("Please upload an image");
            error.statusCode = 400;
            throw error;
        }
        const {title,style,artistName}=req.body;
        /**
         * Creates public url path for the uploaded image
         */
        const imageUrl = `/uploads/gallery/${req.file.filename}`
        const image = await galleryImage.create({
            title: title || "",
            imagePath: req.file.path,
            imageUrl,
            style: style || "others",
            artistName: artistName || "",
        });
        log("success",`Gallery image uploaded ${req.file.filename}`);
        res.status(201).json({
            success:true,
            image
        });
    }catch(error){
        next(error);
    }
}

/**
 * Delete image from gallery
 * Route: DELETE /api/gallery
 * Only admin and superadmin can perform it 
 */
export const deleteImage = async (req,res,next) => {
    try{
        const image = await galleryImage.findById(req.params.id);
        
        if(!image){
            const error = new Error("Image not found");
            error.statusCode = 404;
            throw error;
        }
        /**
         * Creates full path to the image file on server
         * For eg:samsara/uploads/gallery/image.jpg
         */
        const absolutePath = path.join(_dirname,"../",image.imageUrl);
        /**
         * If file exists delete it from the local storage
         */
        if(fs.existsSync(absolutePath)){
            fs.unlinkSync(absolutePath);
        }
        /**
         * Delete image record from mongoDB
         */
        await image.deleteOne();
        log("success",`Gallery image ${req.params.id} has been deleted successfully`);
        res.status(200).json({
            success:true,
            message:"Image deleted successfully!"
        });
    }catch(error){
        next(error);
    }
}