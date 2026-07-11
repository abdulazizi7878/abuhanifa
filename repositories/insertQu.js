import {db} from "../lib/db";


export async function InsertOrder(name,phone_number,location, job, job_type, comment) {
    const [result] = await db.query(
        "INSERT INTO orders(name, phone_number,location,job,job_type, comment) VALUES(?,?,?,?,?,?)",
        [name,phone_number,location,job,job_type,comment]
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

export async function InsertPromotion(name,email,phone_number, title, description, image,link,owner_link) {
    const [result] = await db.query(
        "INSERT INTO promotions (name,email,phone_number,title, description,image,link,owner_link) VALUES (?,?,?,?,?,?,?,?);",
        [name,email,phone_number,title,description,image,link,owner_link]
    )
    return result;
}

export async function InsertProduct(name,price,description,image,link) {
    const [result] = await db.query(
        "INSERT INTO products(name,price,description,image,link) VALUES(?,?,?,?,?)",
        [name,price,description,image,link]
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