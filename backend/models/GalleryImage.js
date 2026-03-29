import mongoose from 'mongoose';
const galleryImageSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            trim:true,
            default:""
        },
        imagePath:{
            type:String,
            required:[true,"Image path is required"]
        },
        imageUrl:{
            type:String,
            required:true
        },
        style:{
            type:String,
            enum:["full sleeve tattoo","custom tattoo","paintings","achievements","others"],
            default:"others"
        },
        uploadedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {timestamps: true}
);
const galleryImage =  mongoose.model("GalleryImage",galleryImageSchema);
export default galleryImage;
