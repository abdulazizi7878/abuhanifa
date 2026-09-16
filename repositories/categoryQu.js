// repositories/categoryQu.js

import { db } from "@/lib/db";

export async function CreateCategory(name) {
    const [result] = await db.query(
        `
        INSERT INTO categories (name)
        VALUES (?)
        `,
        [name]
    );

    return {
        id: result.insertId,
        name,
    };
}

export async function GetCategories() {
    const [rows] = await db.query(
        `
        SELECT
            id,
            name
        FROM categories
        ORDER BY name ASC
        `
    );

    return rows;
}

export async function GetCategoryById(id) {
    const [rows] = await db.query(
        `
        SELECT
            id,
            name
        FROM categories
        WHERE id = ?
        `,
        [id]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

export async function UpdateCategory(id, name) {
    const [result] = await db.query(
        `
        UPDATE categories
        SET name = ?
        WHERE id = ?
        `,
        [name, id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await GetCategoryById(id);
}

export async function DeleteCategory(id) {
    const [result] = await db.query(
        `
        DELETE FROM categories
        WHERE id = ?
        `,
        [id]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id,
    };
}