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

export async function ShowAllProducts() {
    const [products] = await db.query(
        "SELECT * FROM products;"
    );

    return products;
}

export async function ShowOneProduct(link) {
    const [product] = await db.query(
        "SELECT * FROM products WHERE link = ?",
        [link]
    )

    return product;
}

export async function ShowOrderedProducts() {
    const [products] = await db.query(
        "select ordered_products.name AS username, ordered_products.phone_number, ordered_products.account_number, ordered_products.image AS image, ordered_products.product_id, ordered_products.created_at, products.name AS product_name, products.price from ordered_products LEFT JOIN products ON ordered_products.product_id = products.id",
    )

    return products;
}