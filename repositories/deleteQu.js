import {db} from "../lib/db";

export async function DeleteProduct(link) {
    const res = await db.query(
        "UPDATE products SET name = ?, price = ?, description = ? WHERE link = ?",
        [name,price,desciption,link]
    )

    return res;
}