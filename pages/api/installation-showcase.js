import formidable from "formidable";
import cloudinary from "cloudinary";

// file: pages/api/installation-showcase.js

import { requireAdmin } from "../../lib/auth";

import {
    CreateInstallationShowcaseService,
    GetInstallationShowcasesService,
    DeleteInstallationShowcaseService,
} from "../../services/installationShowcase.service";

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

    try {
        /*
        |--------------------------------------------------------------------------
        | GET
        |--------------------------------------------------------------------------
        */

        if (req.method === "GET") {
            const showcases =
                await GetInstallationShowcasesService();

            return res.status(200).json({
                success: true,
                showcases,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | POST
        |--------------------------------------------------------------------------
        */

        if (req.method === "POST") {
            const form = formidable({
                keepExtensions: true,
                multiples: false,
                maxFileSize: MAX_FILE_SIZE,
            });

            const [fields, files] = await form.parse(req);

            const uploadedFile =
                files.image?.[0] || null;

            if (
                !uploadedFile ||
                !uploadedFile.filepath
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required",
                });
            }

            const originalName =
                uploadedFile.originalFilename || "";

            const extension = originalName
                .toLowerCase()
                .substring(
                    originalName.lastIndexOf(".")
                );

            const mimeType =
                uploadedFile.mimetype || "";

            if (
                !ALLOWED_MIME_TYPES.has(mimeType) &&
                !ALLOWED_EXTENSIONS.has(extension)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "This image type is not supported.",
                });
            }

            if (
                uploadedFile.size > MAX_FILE_SIZE
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Image size must not exceed 40 MB.",
                });
            }

            const result =
                await cloudinary.v2.uploader.upload(
                    uploadedFile.filepath,
                    {
                        folder:
                            "abuhanifa-installation/showcase",
                        resource_type: "image",
                    }
                );

            const showcase =
                await CreateInstallationShowcaseService(
                    result.secure_url,
                    result.public_id,
                    result.resource_type
                );

            return res.status(201).json({
                success: true,
                showcase,
            });
        }

        /*
        |--------------------------------------------------------------------------
        | DELETE
        |--------------------------------------------------------------------------
        */

        if (req.method === "DELETE") {
            const { id } = req.body;

            const {
                showcase,
                result,
            } =
                await DeleteInstallationShowcaseService(
                    id
                );

            /*
             * Delete from Cloudinary only after
             * we successfully found the database record.
             */

            if (showcase.public_id) {
                const cloudinaryResult =
                    await cloudinary.v2.uploader.destroy(
                        showcase.public_id,
                        {
                            resource_type:
                                showcase.resource_type ||
                                "image",
                            type: "upload",
                            invalidate: true,
                        }
                    );

                if (
                    cloudinaryResult.result !== "ok" &&
                    cloudinaryResult.result !==
                    "not found"
                ) {
                    throw new Error(
                        `Cloudinary deletion failed: ${cloudinaryResult.result}`
                    );
                }
            }

            return res.status(200).json({
                success: true,
                message:
                    "Showcase image deleted successfully",
                result,
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (err) {
        console.error(
            "INSTALLATION SHOWCASE API ERROR:",
            err
        );

        if (
            err?.code ===
            formidable.errors.maxFieldsSize
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Uploaded data is too large.",
            });
        }

        if (
            err.message ===
            "Showcase image not found"
        ) {
            return res.status(404).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message:
                err.message ||
                "Installation showcase operation failed",
        });
    }
}