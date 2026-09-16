// pages/api/categories.js

import { requireAdmin } from "../../lib/auth";

import {
    CreateCategory,
    GetCategories,
    UpdateCategory,
    DeleteCategory,
} from "../../services/category.service";

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        // GET /api/categories
        if (req.method === "GET") {
            const categories = await GetCategories();

            return res.status(200).json({
                success: true,
                categories,
            });
        }

        // POST /api/categories
        if (req.method === "POST") {
            const { name } = req.body;

            const category = await CreateCategory(name);

            return res.status(201).json({
                success: true,
                category,
            });
        }

        // PUT /api/categories
        if (req.method === "PUT") {
            const { id, name } = req.body;

            const category = await UpdateCategory(id, name);

            return res.status(200).json({
                success: true,
                category,
            });
        }

        // DELETE /api/categories
        if (req.method === "DELETE") {
            const { id } = req.body;

            const category = await DeleteCategory(id);

            return res.status(200).json({
                success: true,
                category,
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (err) {
        console.error("CATEGORY API ERROR:", err);

        // Duplicate category name
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            });
        }

        // Category not found
        if (err.message === "Category not found") {
            return res.status(404).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message || "Category operation failed",
        });
    }
}