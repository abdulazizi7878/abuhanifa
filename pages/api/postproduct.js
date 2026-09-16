// file: pages/api/postproduct.js

import formidable from "formidable";
import cloudinary from "cloudinary";

import { EnterProduct } from "../../services/insert.service";
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

const MAX_FILE_SIZE = 40 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
]);

function getField(fields, field) {
    const value = fields[field];

    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const form = formidable({
            keepExtensions: true,
            multiples: false,
            maxFileSize: MAX_FILE_SIZE,
        });

        const [fields, files] = await form.parse(req);

        const name = getField(fields, "name");
        const price = getField(fields, "price");
        const description = getField(fields, "description");
        const category_id = getField(fields, "category_id");

        const uploadedFile = files.image?.[0] || null;

        if (!uploadedFile || !uploadedFile.filepath) {
            return res.status(400).json({
                success: false,
                message: "Product image is required",
            });
        }

        const originalName = uploadedFile.originalFilename || "";

        const extension = originalName
            .toLowerCase()
            .substring(originalName.lastIndexOf("."));

        const mimeType = uploadedFile.mimetype || "";

        if (
            !ALLOWED_MIME_TYPES.has(mimeType) &&
            !ALLOWED_EXTENSIONS.has(extension)
        ) {
            return res.status(400).json({
                success: false,
                message: "This image type is not supported.",
            });
        }

        if (uploadedFile.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                message: "Image size must not exceed 40 MB.",
            });
        }

        const result = await cloudinary.v2.uploader.upload(
            uploadedFile.filepath,
            {
                folder: "abuhanifa-installation/products",
                resource_type: "image",
            }
        );

        const image = result.secure_url;
        const publicId = result.public_id;
        const resourceType = result.resource_type;

        const response = await EnterProduct(
            name,
            price,
            description,
            image,
            publicId,
            resourceType,
            category_id
        );

        return res.status(200).json({
            success: true,
            response,
        });
    } catch (err) {
        console.error("POST PRODUCT ERROR:", err);

        if (
            err?.code === formidable.errors.maxFieldsSize
        ) {
            return res.status(400).json({
                success: false,
                message: "Uploaded data is too large.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                err.message ||
                "Error while posting the product",
        });
    }
}
