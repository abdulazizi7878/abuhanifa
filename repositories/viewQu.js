import {db} from "../lib/db";

export async function ShowAllComments() {
    const [comments] = await db.query(
        "SELECT * FROM comments;"
    );

    return comments;
}

export async function ShowAllOrders() {
    const [comments] = await db.query(
        "SELECT * FROM orders;"
    );

    return comments;
}