import crypto from "crypto";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOAD_FOLDER =
    "abuhanifa-installation/orders";

const MAX_FILE_SIZE = 40 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".dwg",
    ".dxf",
    ".zip",
]);

function getExtension(filename = "") {
    const lastDot = filename.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return filename
        .substring(lastDot)
        .toLowerCase();
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const {
            filename,
            file_size,
        } = req.body || {};

        const numericFileSize =
            Number(file_size);

        if (
            !Number.isFinite(numericFileSize) ||
            numericFileSize <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid file size.",
            });
        }

        if (numericFileSize > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                message:
                    "File size must not exceed 40 MB.",
            });
        }

        const extension =
            getExtension(filename);

        if (
            !ALLOWED_EXTENSIONS.has(extension)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This file type is not supported.",
            });
        }

        /*
         * Generate the Cloudinary public ID
         * on the server.
         */
        const randomId =
            crypto.randomUUID();

        const publicId =
            `${UPLOAD_FOLDER}/${randomId}`;

        const timestamp =
            Math.floor(Date.now() / 1000);

        /*
         * These exact values are signed.
         */
        const paramsToSign = {
            folder: UPLOAD_FOLDER,
            public_id: publicId,
            timestamp,
        };

        const signature =
            cloudinary.v2.utils.api_sign_request(
                paramsToSign,
                process.env.CLOUDINARY_API_SECRET
            );

        return res.status(200).json({
            success: true,
            cloud_name:
                process.env.CLOUDINARY_CLOUD_NAME,
            api_key:
                process.env.CLOUDINARY_API_KEY,
            timestamp,
            signature,
            folder: UPLOAD_FOLDER,
            public_id: publicId,
        });
    } catch (error) {
        console.error(
            "CLOUDINARY ORDER SIGNATURE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to prepare secure upload.",
        });
    }
}