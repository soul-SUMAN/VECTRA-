import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// configuring cloudinary
cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET

    }
);


// cloudinary file upload

const uploadOnCloudinary= async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        // upload file to cloudinary
        const response=await cloudinary.uploader.upload(localFilePath, { resource_type:"image" })

        // file has been uploaded successfully
        console.log("file is uploaded to cloudinary successfully ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    }catch(error){
        // remove the locally saved temporary files as the upload operatin get failed
        fs.unlinkSync(localFilePath)
        return null;

    }
}


export {uploadOnCloudinary}