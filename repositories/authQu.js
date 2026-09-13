import { db } from "../lib/db";

export async function ShowUserByEmail(email) {
    const [user] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return [user];
}

export async function ShowUserById(id) {
    const [user] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );

    return [user];
}

export async function UpdateUserPassword(
    id,
    password
) {
    const [result] = await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [password, id]
    );

    return result;
}