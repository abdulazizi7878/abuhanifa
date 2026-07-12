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