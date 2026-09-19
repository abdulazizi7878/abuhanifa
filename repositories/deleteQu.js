

// file: repositories/deleteQu.js


import {db} from "../lib/db";


export async function DeleteBlog(id) {
    const res = await db.query(
        "DELETE FROM blog where id = ?",
        [id]
    )
    return res;
}

export async function DeleteProduct(id) {
    const res = await db.query(
        "DELETE FROM products where id = ?",
        [id]
    )
    return res;
}
export async function DeletePromotion(id) {
    const res = await db.query(
        "DELETE FROM promotions where id = ?",
        [id]
    )
    return res;
}

export async function DeleteOrders(id) {
    const res = await db.query(
        "DELETE FROM orders WHERE id = ?",
        [id]
    )
    return res;
}

export async function DeleteComments(id) {
    const res = await db.query(
        "DELETE FROM comments WHERE id = ?",
        [id]
    )
    return res;
}

export async function DeleteMessages(id) {
    const res = await db.query(
        "DELETE FROM contact WHERE id = ?",
        [id]
    )
    return res;
}

export async function DeleteReview(id) {
    const [result] = await db.query(
        `
        DELETE FROM reviews
        WHERE id = ?
        `,
        [id]
    );

    return result;
}