
// file: repositories/insertQu.js

import {db} from "../lib/db";


export async function InsertOrder(
    name,
    contact_info,
    location,
    job,
    job_type,
    comment,
    attachment_url = null,
    attachment_public_id = null,
    attachment_original_name = null,
    attachment_mime_type = null,
    attachment_size = null,
    attachment_resource_type = null
) {
    const [result] = await db.query(
        `
        INSERT INTO orders (
            name,
            phone_number,
            location,
            job,
            job_type,
            comment,
            attachment_url,
            attachment_public_id,
            attachment_original_name,
            attachment_mime_type,
            attachment_size,
            attachment_resource_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            name,
            contact_info,
            location,
            job,
            job_type,
            comment,
            attachment_url,
            attachment_public_id,
            attachment_original_name,
            attachment_mime_type,
            attachment_size,
            attachment_resource_type
        ]
    );

    return [result];
}

export async function InsertMessage(name,email,message) {
    const [result] = await db.query(
        "INSERT INTO contact (name,email,message) VALUES (?,?,?);",
        [name,email,message]
    )
    return result;
}

export async function InsertPromotion(name, title, description, image,link, publicId, resourceType) {
    const [result] = await db.query(
        "INSERT INTO promotions (name,title, description,image,link, media_public_id, media_resource_type) VALUES (?,?,?,?,?,?,?);",
        [name,title,description,image,link,publicId,resourceType]
    )
    return result;
}

export async function InsertProduct(name,price,description,image,link,publicId,resourceType) {
    const [result] = await db.query(
        "INSERT INTO products(name,price,description,image,link, media_public_id,media_resource_type) VALUES(?,?,?,?,?,?,?)",
        [name,price,description,image,link,publicId,resourceType]
    )

    return result;
}

export async function InsertOrderProduct(name,phone_number,location,account_number,amount,image,product_id) {
    const [result] = await db.query(
        "INSERT INTO ordered_products (name,phone_number,location,account_number,amount, image,product_id) VALUES(?,?,?,?,?,?,?)",
        [name,phone_number,location,account_number,amount,image,product_id]
    )

    return result;
}