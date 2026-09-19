// file: pages/api/postorder.js

import cloudinary from "cloudinary";

import { EnterOrder } from "../../services/insert.service";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const ALLOWED_RESOURCE_TYPES = new Set([
    "image",
    "raw",
]);

const ORDERS_FOLDER =
    "abuhanifa-installation/orders";

function getExtension(filename = "") {
    const lastDot = filename.lastIndexOf(".");

    if (lastDot === -1) {
        return "";
    }

    return filename
        .substring(lastDot)
        .toLowerCase();
}

function getString(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function getArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value;
}

async function deleteCloudinaryAsset(
    publicId,
    resourceType
) {
    if (!publicId) {
        return;
    }

    try {
        await cloudinary.v2.uploader.destroy(
            publicId,
            {
                resource_type:
                    resourceType || "image",
                type: "upload",
            }
        );
    } catch (error) {
        console.error(
            "Failed to clean up Cloudinary asset:",
            error
        );
    }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    let uploadedCloudinaryAsset = null;

    try {
        const {
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
            attachment_resource_type,
        } = req.body || {};

        /*
         * Basic order validation.
         */

        const cleanName = getString(name);
        const cleanContactInfo =
            getString(contact_info);
        const cleanLocation =
            getString(location);
        const cleanComment =
            getString(comment);

        if (!cleanName) {
            return res.status(400).json({
                success: false,
                message: "Name is required.",
            });
        }

        if (!cleanContactInfo) {
            return res.status(400).json({
                success: false,
                message:
                    "Contact information is required.",
            });
        }

        if (!cleanLocation) {
            return res.status(400).json({
                success: false,
                message: "Location is required.",
            });
        }

        const finalJobs = getArray(jobs);
        const finalJobTypes =
            getArray(job_types);

        if (finalJobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one job is required.",
            });
        }

        if (finalJobTypes.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one job type is required.",
            });
        }

        /*
         * Attachment is optional.
         */

        let finalAttachmentUrl = null;
        let finalAttachmentPublicId = null;
        let finalAttachmentOriginalName = null;
        let finalAttachmentMimeType = null;
        let finalAttachmentSize = null;
        let finalAttachmentResourceType = null;

        const hasAttachment =
            attachment_public_id ||
            attachment_url ||
            attachment_original_name ||
            attachment_size;

        if (hasAttachment) {
            /*
             * All important Cloudinary fields are required.
             */

            if (
                !attachment_public_id ||
                !attachment_resource_type ||
                !attachment_original_name
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Incomplete attachment information.",
                });
            }

            /*
             * Validate resource type.
             */

            if (
                !ALLOWED_RESOURCE_TYPES.has(
                    attachment_resource_type
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid attachment resource type.",
                });
            }

            /*
             * Validate original file extension.
             */

            const extension = getExtension(
                attachment_original_name
            );

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
             * Validate public_id.
             *
             * The browser must not be able to submit
             * an arbitrary Cloudinary asset.
             */

            if (
                !attachment_public_id.startsWith(
                    `${ORDERS_FOLDER}/`
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid attachment location.",
                });
            }

            /*
             * Validate the claimed size before
             * contacting Cloudinary.
             */

            const claimedSize =
                Number(attachment_size);

            if (
                !Number.isFinite(claimedSize) ||
                claimedSize <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid attachment size.",
                });
            }

            if (claimedSize > MAX_FILE_SIZE) {
                return res.status(400).json({
                    success: false,
                    message:
                        "File size must not exceed 40 MB.",
                });
            }

            /*
             * Verify the actual Cloudinary asset.
             *
             * This is important because we do not trust
             * attachment_url, size, or resource_type
             * supplied by the browser.
             */

            const cloudinaryAsset =
                await cloudinary.v2.api.resource(
                    attachment_public_id,
                    {
                        resource_type:
                            attachment_resource_type,
                        type: "upload",
                    }
                );

            /*
             * Make sure the asset really belongs
             * to our orders folder.
             */

            if (
                !cloudinaryAsset.public_id.startsWith(
                    `${ORDERS_FOLDER}/`
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Cloudinary asset.",
                });
            }

            /*
             * Verify actual Cloudinary resource type.
             */

            if (
                cloudinaryAsset.resource_type !==
                attachment_resource_type
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Attachment resource type mismatch.",
                });
            }

            /*
             * Verify actual file size.
             */

            const actualSize =
                Number(cloudinaryAsset.bytes);

            if (
                !Number.isFinite(actualSize) ||
                actualSize <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Cloudinary file size.",
                });
            }

            if (actualSize > MAX_FILE_SIZE) {
                await deleteCloudinaryAsset(
                    attachment_public_id,
                    attachment_resource_type
                );

                return res.status(400).json({
                    success: false,
                    message:
                        "File size must not exceed 40 MB.",
                });
            }

            /*
             * Store the verified Cloudinary asset.
             */

            finalAttachmentUrl =
                cloudinaryAsset.secure_url;

            finalAttachmentPublicId =
                cloudinaryAsset.public_id;

            finalAttachmentOriginalName =
                attachment_original_name;

            finalAttachmentMimeType =
                attachment_mime_type || null;

            finalAttachmentSize =
                actualSize;

            finalAttachmentResourceType =
                cloudinaryAsset.resource_type;

            uploadedCloudinaryAsset = {
                publicId:
                    cloudinaryAsset.public_id,
                resourceType:
                    cloudinaryAsset.resource_type,
            };
        }

        /*
         * Save the order.
         */

        await EnterOrder(
            cleanName,
            cleanContactInfo,
            cleanLocation,
            finalJobs,
            finalJobTypes,
            cleanComment || "No comment",
            finalAttachmentUrl,
            finalAttachmentPublicId,
            finalAttachmentOriginalName,
            finalAttachmentMimeType,
            finalAttachmentSize,
            finalAttachmentResourceType
        );

        /*
         * Database succeeded.
         * Do not delete the Cloudinary asset.
         */

        uploadedCloudinaryAsset = null;

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
         * If Cloudinary upload succeeded but
         * database insertion failed, clean up
         * the Cloudinary asset.
         */

        if (uploadedCloudinaryAsset) {
            await deleteCloudinaryAsset(
                uploadedCloudinaryAsset.publicId,
                uploadedCloudinaryAsset.resourceType
            );
        }

        /*
         * Cloudinary could not find the asset.
         */

        if (
            err?.http_code === 404 ||
            err?.error?.http_code === 404
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Attachment was not found on Cloudinary.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                err?.message ||
                "Failed to submit order",
        });
    }
}