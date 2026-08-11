
import cloudinary from "cloudinary";

import { requireAdmin } from "../../lib/auth";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    // Only allow DELETE
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);

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
        const {
            publicId,
            resourceType = "image",
        } = req.body || {};

        // Validate public ID
        if (!publicId || typeof publicId !== "string") {
            return res.status(400).json({
                success: false,
                message: "publicId is required",
            });
        }

        // Only allow the resource types we support
        const allowedResourceTypes = ["image", "video", "raw"];

        if (!allowedResourceTypes.includes(resourceType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resource type",
            });
        }

        // Delete the asset from Cloudinary
        const result = await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: resourceType,
            type: "upload",
            invalidate: true,
        });

        /*
         * Cloudinary normally returns:
         *
         * {
         *   result: "ok"
         * }
         *
         * or:
         *
         * {
         *   result: "not found"
         * }
         */

        if (result.result !== "ok") {
            return res.status(404).json({
                success: false,
                message: "Cloudinary asset not found",
                result: result.result,
            });
        }

        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            publicId,
            resourceType,
        });
    } catch (error) {
        console.error("Cloudinary delete error:", error);

        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to delete file",
        });
    }
}
