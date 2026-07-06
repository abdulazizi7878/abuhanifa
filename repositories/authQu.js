import { db } from "../lib/db";

export async function ShowUserByEmail(email) {
    const [user] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return [user];
}