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
        "SELECT id, name, description, image, link, media_resource_type FROM products;"
    );

    return products;
}

export async function ShowOneProduct(link) {
    const [product] = await db.query(
        "SELECT id, name, description, image, link, media_resource_type FROM products WHERE link = ?",
        [link]
    )

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