// services/category.service.js

import {
    CreateCategory as CreateCategoryRepository,
    GetCategories as GetCategoriesRepository,
    GetCategoryById,
    UpdateCategory as UpdateCategoryRepository,
    DeleteCategory as DeleteCategoryRepository,
} from "../repositories/categoryQu";

export async function CreateCategory(name) {
    if (!name || typeof name !== "string") {
        throw new Error("Enter a valid category name");
    }

    const cleanName = name.trim();

    if (!cleanName) {
        throw new Error("Enter a valid category name");
    }

    if (cleanName.length > 250) {
        throw new Error("Category name is too long");
    }

    const category = await CreateCategoryRepository(cleanName);

    return category;
}

export async function GetCategories() {
    return await GetCategoriesRepository();
}

export async function UpdateCategory(id, name) {
    if (!id) {
        throw new Error("Category ID is required");
    }

    if (!name || typeof name !== "string") {
        throw new Error("Enter a valid category name");
    }

    const cleanName = name.trim();

    if (!cleanName) {
        throw new Error("Enter a valid category name");
    }

    if (cleanName.length > 250) {
        throw new Error("Category name is too long");
    }

    const existingCategory = await GetCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    return await UpdateCategoryRepository(id, cleanName);
}

export async function DeleteCategory(id) {
    if (!id) {
        throw new Error("Category ID is required");
    }

    const existingCategory = await GetCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    return await DeleteCategoryRepository(id);
}