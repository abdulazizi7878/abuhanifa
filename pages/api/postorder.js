// file: pages/api/postorder.js

import formidable from "formidable";
import cloudinary from "cloudinary";

import { EnterOrder } from "../../services/insert.service";

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

const MAX_FILE_SIZE = 40 * 1024 * 1024; // 20 MB

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",

    "application/pdf",

    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/zip",
    "application/x-zip-compressed",

    "application/acad",
    "application/x-acad",
    "application/autocad",
    "application/x-autocad",
    "image/vnd.dwg",
    "image/vnd.dxf",
]);

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

function getField(fields, field) {
    const value = fields[field];

    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default async function handler(req, res) {
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
        const contact_info = getField(
            fields,
            "contact_info"
        );
        const location = getField(
            fields,
            "location"
        );
        const comment = getField(
            fields,
            "comment"
        );

        let jobs = getField(fields, "jobs");
        let job_types = getField(
            fields,
            "job_types"
        );

        try {
            jobs = JSON.parse(jobs || "[]");
            job_types = JSON.parse(
                job_types || "[]"
            );
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid job data",
            });
        }

        /*
         * Attachment is optional.
         */
        const uploadedFile =
            files.attachment?.[0] || null;

        let attachment_url = null;
        let attachment_public_id = null;
        let attachment_original_name = null;
        let attachment_mime_type = null;
        let attachment_size = null;
        let attachment_resource_type = null;

        if (uploadedFile) {
            if (!uploadedFile.filepath) {
                return res.status(400).json({
                    success: false,
                    message: "Uploaded file is invalid",
                });
            }

            const originalName =
                uploadedFile.originalFilename || "";

            const extension =
                originalName
                    .toLowerCase()
                    .substring(
                        originalName.lastIndexOf(".")
                    );

            const mimeType =
                uploadedFile.mimetype || "";

            /*
             * Validate file type.
             *
             * Check both MIME type and extension
             * because browsers can report MIME types
             * differently, especially for CAD files.
             */
            if (
                !ALLOWED_MIME_TYPES.has(
                    mimeType
                ) &&
                !ALLOWED_EXTENSIONS.has(
                    extension
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "This file type is not supported.",
                });
            }

            if (
                uploadedFile.size >
                MAX_FILE_SIZE
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "File size must not exceed 20 MB.",
                });
            }

            const result =
                await cloudinary.v2.uploader.upload(
                    uploadedFile.filepath,
                    {
                        folder:
                            "abuhanifa-installation/orders",
                        resource_type: "auto",
                    }
                );

            attachment_url =
                result.secure_url;

            attachment_public_id =
                result.public_id;

            attachment_original_name =
                originalName;

            attachment_mime_type =
                mimeType;

            attachment_size =
                uploadedFile.size;

            attachment_resource_type =
                result.resource_type;
        }

        await EnterOrder(
            name,
            contact_info,
            location,
            jobs,
            job_types,
            comment,
            attachment_url,
            attachment_public_id,
            attachment_original_name,
            attachment_mime_type,
            attachment_size,
            attachment_resource_type
        );

        return res.status(200).json({
            success: true,
            message: "Order Successfully Sent!",
        });
    } catch (err) {
        console.error(
            "Order submission error:",
            err
        );

        /*
         * Formidable can throw when the file exceeds
         * maxFileSize before we reach our own validation.
         */
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

        return res.status(500).json({
            success: false,
            message:
                err.message ||
                "Failed to submit order",
        });
    }
}