import {
    CreateInstallationShowcase,
    GetInstallationShowcases,
    GetInstallationShowcaseById,
    DeleteInstallationShowcase,
} from "../repositories/installationShowcase.repository";

// file: services/installationShowcase.service.js

export async function CreateInstallationShowcaseService(
    image,
    publicId,
    resourceType = "image"
) {
    if (!image || typeof image !== "string") {
        throw new Error("Image URL is required");
    }

    if (!publicId || typeof publicId !== "string") {
        throw new Error("Cloudinary public ID is required");
    }

    if (
        !["image", "video", "raw"].includes(resourceType)
    ) {
        throw new Error(
            `Invalid media resource type: ${resourceType}`
        );
    }

    return await CreateInstallationShowcase(
        image.trim(),
        publicId.trim(),
        resourceType
    );
}

export async function GetInstallationShowcasesService() {
    return await GetInstallationShowcases();
}

export async function DeleteInstallationShowcaseService(id) {
    if (!id) {
        throw new Error("Showcase ID is required");
    }

    const showcase =
        await GetInstallationShowcaseById(id);

    if (!showcase) {
        throw new Error("Showcase image not found");
    }

    return {
        showcase,
        result: await DeleteInstallationShowcase(id),
    };
}