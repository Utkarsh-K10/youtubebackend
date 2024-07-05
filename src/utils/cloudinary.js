import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryUploader = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        // console.log("Uploaded Successfully at",response.url)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        // console.log("File unlinked Successfully!!")
        return null
    }
};

const CloudinaryImageDeleter = async(url)=>{
    try {
        if(!url){
            return null
        }
        const response = await cloudinary.uploader.destroy( url.split("/").pop().split(".")[0], {resource_type: "image"})
        return response
    } catch (error) {
        throw new Error("Error while deleting the image from cloudinary")
    }
}

export {cloudinaryUploader, CloudinaryImageDeleter}