import {db} from "../lib/db";

export async function UpdateProduct(name,price,desciption,link) {
    const res = await db.query(
        "UPDATE products SET name = ?, price = ?, description = ? WHERE link = ?",
        [name,price,desciption,link]
    )

    return res;
}

export async function UpdateBlog(title,desciption,link) {
    const res = await db.query(
        "UPDATE blog SET title = ?, description = ? WHERE link = ?",
        [title,desciption,link]
    )

    return res;
}

export async function UpdatePromotion(name,email,phone_number,title,description,owner_link,link) {
    const res = await db.query(
        "UPDATE promotions SET name = ?, email = ?, phone_number = ?, title = ?, description = ?, owner_link = ? WHERE link = ?",
        [name,email,phone_number,title,description,owner_link,link]
    )

    return res;
}