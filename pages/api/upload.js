import formidable from "formidable";
import cloudinary from "cloudinary";

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
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const form = formidable({
            keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);

        const file = files.file[0];

        const result = await cloudinary.v2.uploader.upload(file.filepath, {
            folder: "my-project",
            resource_type: "auto", // Supports images and videos
        });

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            url: result.secure_url,
            resourceType: result.resource_type,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}