import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Uploads a local file to Cloudinary with automatic fallback support.
 * @param {string} filePath - Path to the locally saved file on disk
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string|null>} - Cloudinary secure_url or null if upload fails
 */
export const uploadToCloudinary = async (filePath, folder = "job_portal") => {
    try {
        if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
            return null;
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto"
        });

        return result.secure_url;
    } catch (error) {
        console.warn("Cloudinary upload failed, falling back to local file storage:", error?.message);
        return null;
    }
};

export default cloudinary;