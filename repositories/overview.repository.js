// overview.repository.js

import {db} from "@/lib/db";

const count = async (table) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM ${table}`
    );

    return Number(rows[0]?.total || 0);
};

const getCounts = async () => {
    const [
        blogs,
        products,
        materials,
        promotions,
        orders,
        estimates,
        contacts,
        comments,
        orderedProducts,
    ] = await Promise.all([
        count("blog"),
        count("products"),
        count("materials"),
        count("promotions"),
        count("orders"),
        count("estimates"),
        count("contact"),
        count("comments"),
        count("ordered_products"),
    ]);

    return {
        blogs,
        products,
        materials,
        promotions,
        orders,
        estimates,
        contacts,
        comments,
        orderedProducts,
    };
};

const getEstimateStatusCounts = async () => {
    const [rows] = await db.query(`
        SELECT
            status,
            COUNT(*) AS total
        FROM estimates
        GROUP BY status
        ORDER BY total DESC
    `);

    return rows.map((row) => ({
        status: row.status,
        total: Number(row.total),
    }));
};

const getRecentEstimates = async (limit = 5) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            customer_name,
            customer_phone,
            project_title,
            status,
            grand_total,
            customer_location,
            work_type,
            work_stage,
            created_at,
            updated_at
        FROM estimates
        ORDER BY created_at DESC
        LIMIT ?
        `,
        [limit]
    );

    return rows;
};

const getRecentMaterials = async (limit = 5) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            material_name_english,
            material_name_amharic,
            category,
            type,
            brand,
            price,
            created_at,
            updated_at
        FROM materials
        ORDER BY updated_at DESC
        LIMIT ?
        `,
        [limit]
    );

    return rows;
};

const getRecentOrderedProducts = async (limit = 5) => {
    const [rows] = await db.query(
        `
        SELECT
            op.id,
            op.name,
            op.phone_number,
            op.amount,
            op.image,
            op.product_id,
            op.location,
            op.created_at,
            p.name AS product_name,
            p.link AS product_link
        FROM ordered_products op
        LEFT JOIN products p
            ON p.id = op.product_id
        ORDER BY op.created_at DESC
        LIMIT ?
        `,
        [limit]
    );

    return rows;
};

export {
    getCounts,
    getEstimateStatusCounts,
    getRecentEstimates,
    getRecentMaterials,
    getRecentOrderedProducts,
};