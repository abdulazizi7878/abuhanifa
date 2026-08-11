import formidable from "formidable";
import cloudinary from "cloudinary";

import { requireAdmin } from "../../lib/auth";

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    // Admin authentication
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        const form = formidable({
            keepExtensions: true,
            multiples: false,
        });

        const [fields, files] = await form.parse(req);

        // Frontend should send:
        // formData.append("image", file)
        // or
        // formData.append("file", file)
        const uploadedFile = files.image?.[0] || files.file?.[0];

        if (!uploadedFile) {
            return res.status(400).json({
                success: false,
                message: "No image or video was uploaded",
            });
        }

        // Basic validation
        if (!uploadedFile.filepath) {
            return res.status(400).json({
                success: false,
                message: "Uploaded file is invalid",
            });
        }

        /*
         * Cloudinary automatically detects whether the uploaded
         * file is an image or video.
         *
         * resource_type:
         * - image → images
         * - video → videos
         * - raw   → other supported files
         */
        const result = await cloudinary.v2.uploader.upload(
            uploadedFile.filepath,
            {
                folder: "my-project",
                resource_type: "auto",
            }
        );

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",

            url: result.secure_url,

            publicId: result.public_id,

            resourceType: result.resource_type,

            format: result.format,

            width: result.width || null,

            height: result.height || null,

            bytes: result.bytes,

            originalFilename: uploadedFile.originalFilename,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to upload file",
        });
    }
}
