
import cloudinary from "cloudinary";

import {
    DeleteBlog,
    DeleteProduct,
    DeletePromotion,
} from "../repositories/deleteQu";

import {
    GetBlogById,
    GetProductById,
    GetPromotionById,
} from "../repositories/viewQu";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function DeleteCloudinaryMedia(publicId, resourceType = "image") {
    if (!publicId) {
        throw new Error("Media public ID is missing");
    }

    const allowedResourceTypes = ["image", "video"];

    if (!allowedResourceTypes.includes(resourceType)) {
        throw new Error(`Invalid media resource type: ${resourceType}`);
    }

    console.log("Deleting Cloudinary media:", {
        publicId,
        resourceType,
    });

    const result = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: "upload",
        invalidate: true,
    });

    console.log("Cloudinary destroy result:", result);

    if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(
            `Cloudinary deletion failed: ${result.result}`
        );
    }

    return result;
}

export async function DeleteItem(item, id) {
    if (!item) {
        throw new Error("Item can't be empty");
    }

    if (!id) {
        throw new Error("Id can't be empty");
    }

    if (item === "blog") {
        const blog = await GetBlogById(id);

        if (!blog) {
            throw new Error("Blog not found");
        }

        await DeleteCloudinaryMedia(
            blog.media_public_id,
            blog.media_resource_type
        );

        return await DeleteBlog(id);
    }

    if (item === "product") {
        const product = await GetProductById(id);

        if (!product) {
            throw new Error("Product not found");
        }

        await DeleteCloudinaryMedia(
            product.media_public_id,
            product.media_resource_type
        );

        return await DeleteProduct(id);
    }

    if (item === "promotion") {
        const promotion = await GetPromotionById(id);

        if (!promotion) {
            throw new Error("Promotion not found");
        }

        await DeleteCloudinaryMedia(
            promotion.media_public_id,
            promotion.media_resource_type
        );

        return await DeletePromotion(id);
    }

    throw new Error("Invalid command");
}
