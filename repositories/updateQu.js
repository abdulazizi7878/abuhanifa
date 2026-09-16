import {db} from "../lib/db";

// repositories/updateQu.js

export async function UpdateProduct(
    name,
    price,
    description,
    category_id,
    link
) {
    const [result] = await db.query(
        `
        UPDATE products
        SET
            name = ?,
            price = ?,
            description = ?,
            category_id = ?
        WHERE link = ?
        `,
        [
            name,
            price,
            description,
            category_id,
            link,
        ]
    );

    return result;
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