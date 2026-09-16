import {db} from "../lib/db";

export async function ShowAllComments() {
    const [comments] = await db.query(
        "SELECT * FROM comments;"
    );

    return comments;
}

export async function ShowAllOrders() {
    const [orders] = await db.query(
        "SELECT * FROM orders;"
    );

    return orders;
}

export async function ShowAllMessages() {
    const [messages] = await db.query(
        "SELECT * FROM contact;"
    );

    return messages;
}

export async function ShowAllPromotions() {
    const [promotions] = await db.query(
        "SELECT * FROM promotions;"
    );

    return promotions;
}

export async function GetBlogById(id) {
    const [rows] = await db.query(
        "SELECT media_public_id, media_resource_type, id FROM blog WHERE id = ?",
        [id]
    );

    if (rows.length === 0) return null;

    return rows[0];
}

export async function GetProductById(id) {
    const [rows] = await db.query(
        "SELECT media_public_id, media_resource_type, id FROM products WHERE id = ?",
        [id]
    );

    if (rows.length === 0) return null;

    return rows[0];
}

export async function GetPromotionById(id) {
    const [rows] = await db.query(
        "SELECT media_public_id, media_resource_type, id FROM promotions WHERE id = ?",
        [id]
    );

    if (rows.length === 0) return null;

    return rows[0];
}

export async function ShowAllProducts() {
    const [products] = await db.query(
        `
        SELECT
            products.id,
            products.name,
            products.description,
            products.image,
            products.link,
            products.media_resource_type,
            products.category_id,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories
            ON products.category_id = categories.id
        ORDER BY products.id DESC;
        `
    );

    return products;
}

export async function ShowOneProduct(link) {
    const [product] = await db.query(
        `
        SELECT
            products.id,
            products.name,
            products.description,
            products.image,
            products.link,
            products.media_resource_type,
            products.category_id,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories
            ON products.category_id = categories.id
        WHERE products.link = ?
        `,
        [link]
    );

    return product;
}

export async function ShowPromotion(link) {
    const [promotion] = await db.query(
        "SELECT * FROM promotions WHERE link = ?;",
        [link]
    );

    return promotion;
}

export async function ShowProductPreview(){
    const [products] = await db.query(
        "SELECT id, name, description, image, link FROM products ORDER BY id DESC LIMIT 5;"
    )

    return products;
}

export async function GetOrderById(id) {
    const [rows] = await db.query(
        `
        SELECT
            id,
            attachment_public_id,
            attachment_resource_type
        FROM orders
        WHERE id = ?
        `,
        [id]
    );

    if (rows.length === 0) return null;

    return rows[0];
}

export async function GetProductByName(name) {
    const [rows] = await db.query(
        `
        SELECT id, name
        FROM products
        WHERE name = ?
        LIMIT 1
        `,
        [name]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}