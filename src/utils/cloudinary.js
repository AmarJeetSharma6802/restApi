import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";  // Use fs.promises for async operations
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         // Upload the image to Cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto", // Automatically handles different types of files (image, video, etc.)
//         });

//         // Asynchronously remove the local file after successful upload
//         await fs.unlink(localFilePath);
//         return response;
//     } catch (error) {
//         console.error("Cloudinary upload error:", error);
//         // Ensure the local file is deleted if upload fails
//         try {
//             await fs.unlink(localFilePath);  // Attempt to delete the local file
//         } catch (err) {
//             console.error("Error deleting local file:", err);
//         }
//         return null;
//     }
// };

// export { uploadOnCloudinary };


const uploadOnCloudinary = async (buffer) => {
    try {
        if (!buffer) return null;

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer); 
        });
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

export { uploadOnCloudinary };
