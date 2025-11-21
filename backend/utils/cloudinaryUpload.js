import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadCloudinary = (fileBuffer, folder, resourceType = "image") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
        {
            folder,
            resource_type: resourceType,
        },
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};