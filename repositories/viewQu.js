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