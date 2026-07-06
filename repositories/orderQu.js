import {db} from "../lib/db";


export async function InsertOrder(name,phone_number,location, job, job_type, comment) {
    const [result] = await db.query(
        "INSERT INTO orders(name, phone_number,location,job,job_type, comment) VALUES(?,?,?,?,?,?)",
        [name,phone_number,location,job,job_type,comment]
    );

    return [result];
}