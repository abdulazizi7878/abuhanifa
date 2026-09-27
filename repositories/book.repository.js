import { db } from "@/lib/db";


/**
 * Create book
 */
export async function CreateBook({
    title,
    description,
    telegramUrl,
    coverUrl,
    coverPublicId,
    coverResourceType = "image",
}) {
    const [result] = await db.query(
        `INSERT INTO books (
            title,
            description,
            telegram_url,
            cover_url,
            cover_public_id,
            cover_resource_type
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            title || null,
            description || null,
            telegramUrl,
            coverUrl,
            coverPublicId,
            coverResourceType,
        ]
    );

    return {
        id: result.insertId,
        title: title || null,
        description: description || null,
        telegram_url: telegramUrl,
        cover_url: coverUrl,
        cover_public_id: coverPublicId,
        cover_resource_type: coverResourceType,
    };
}


/**
 * Get book by ID
 */
export async function GetBookById(id) {
    const [rows] = await db.query(
        `SELECT
            id,
            title,
            description,
            telegram_url,
            cover_url,
            cover_public_id,
            cover_resource_type,
            created_at,
            updated_at
        FROM books
        WHERE id = ?
        LIMIT 1`,
        [id]
    );

    return rows.length === 0 ? null : rows[0];
}


/**
 * Get paginated books
 */
export async function GetBooks({
    page = 1,
    limit = 10,
} = {}) {
    const safePage = Math.max(1, Number(page) || 1);

    const safeLimit = Math.min(
        50,
        Math.max(1, Number(limit) || 10)
    );

    const offset = (safePage - 1) * safeLimit;


    const [[countResult]] = await db.query(
        `SELECT COUNT(*) AS total
         FROM books`
    );

    const [rows] = await db.query(
        `SELECT
            id,
            title,
            description,
            telegram_url,
            cover_url,
            cover_public_id,
            cover_resource_type,
            created_at,
            updated_at
        FROM books
        ORDER BY created_at DESC, id DESC
        LIMIT ? OFFSET ?`,
        [safeLimit, offset]
    );


    const total = Number(countResult.total);

    const totalPages = Math.ceil(total / safeLimit);


    return {
        books: rows,

        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1,
        },
    };
}


/**
 * Update book
 */
export async function UpdateBook(
    id,
    {
        title,
        description,
        telegramUrl,
        coverUrl,
        coverPublicId,
        coverResourceType,
    }
) {
    const [result] = await db.query(
        `UPDATE books
         SET
            title = ?,
            description = ?,
            telegram_url = ?,
            cover_url = ?,
            cover_public_id = ?,
            cover_resource_type = ?
         WHERE id = ?`,
        [
            title || null,
            description || null,
            telegramUrl,
            coverUrl,
            coverPublicId,
            coverResourceType || "image",
            id,
        ]
    );

    return result;
}


/**
 * Delete book
 */
export async function DeleteBook(id) {
    const [result] = await db.query(
        `DELETE FROM books
         WHERE id = ?`,
        [id]
    );

    return result;
}