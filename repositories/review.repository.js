import { db } from "@/lib/db";

export async function CreateReviewSession(token, expiresAt) {
    const [result] = await db.query(
        `
        INSERT INTO reviews (
            token,
            expires_at
        )
        VALUES (?, ?)
        `,
        [token, expiresAt]
    );

    return {
        id: result.insertId,
        token,
        expires_at: expiresAt,
    };
}

export async function GetReviewByToken(token) {
    const [rows] = await db.query(
        `
        SELECT
            id,
            token,
            expires_at,
            used_at,
            reviewer_name,
            rating,
            review_text,
            created_at
        FROM reviews
        WHERE token = ?
        LIMIT 1
        `,
        [token]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

export async function SubmitReview(
    token,
    reviewerName,
    rating,
    reviewText
) {
    const [result] = await db.query(
        `
        UPDATE reviews
        SET
            reviewer_name = ?,
            rating = ?,
            review_text = ?,
            used_at = CURRENT_TIMESTAMP
        WHERE token = ?
          AND used_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        `,
        [
            reviewerName,
            rating,
            reviewText,
            token,
        ]
    );

    return result;
}

export async function GetPublishedReviews() {
    const [rows] = await db.query(
        `
        SELECT
            id,
            reviewer_name,
            rating,
            review_text,
            created_at
        FROM reviews
        WHERE used_at IS NOT NULL
          AND review_text IS NOT NULL
          AND rating IS NOT NULL
        ORDER BY created_at DESC
        `
    );

    return rows;
}

export async function GetAllReviewSessions() {
    const [rows] = await db.query(
        `
        SELECT
            id,
            token,
            expires_at,
            used_at,
            reviewer_name,
            rating,
            review_text,
            created_at
        FROM reviews
        ORDER BY created_at DESC
        `
    );

    return rows;
}