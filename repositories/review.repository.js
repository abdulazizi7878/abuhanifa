// file: repositories/review.repository.js

import { db } from "@/lib/db";

const ReviewRepository = {
    // ==========================================
    // CREATE
    // ==========================================

    async createReview({
        id,
        customerName,
        rating,
        isPublished,
    }) {
        const [result] = await db.execute(
            `
            INSERT INTO reviews (
                id,
                customer_name,
                rating,
                is_published
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                id,
                customerName,
                rating,
                isPublished,
            ]
        );

        return result;
    },

    // ==========================================
    // UPDATE
    // ==========================================

    async updateReview({
        id,
        customerName,
        rating,
        isPublished,
    }) {
        const [result] = await db.execute(
            `
            UPDATE reviews
            SET
                customer_name = ?,
                rating = ?,
                is_published = ?
            WHERE id = ?
            `,
            [
                customerName,
                rating,
                isPublished,
                id,
            ]
        );

        return result;
    },

    // ==========================================
    // DELETE
    // ==========================================

    async deleteReview(id) {
        const [result] = await db.execute(
            `
            DELETE FROM reviews
            WHERE id = ?
            `,
            [id]
        );

        return result;
    },

    // ==========================================
    // GET ONE
    // ==========================================

    async getReviewById(id) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                customer_name AS customerName,
                rating,
                is_published AS isPublished,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM reviews
            WHERE id = ?
            `,
            [id]
        );

        return rows[0] || null;
    },

    // ==========================================
    // GET ALL PUBLISHED
    // ==========================================

    async getPublishedReviews() {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                customer_name AS customerName,
                rating,
                is_published AS isPublished,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM reviews
            WHERE is_published = TRUE
            ORDER BY created_at DESC
            `
        );

        return rows;
    },

    // ==========================================
    // GET PUBLISHED BY LANGUAGE
    // ==========================================

    async getPublishedReviewsByLanguage(language) {
        const [rows] = await db.execute(
            `
            SELECT
                r.id,
                r.customer_name AS customerName,
                r.rating,
                r.is_published AS isPublished,
                rt.language,
                rt.text,
                r.created_at AS createdAt,
                r.updated_at AS updatedAt
            FROM reviews r
            INNER JOIN review_translations rt
                ON r.id = rt.review_id
            WHERE r.is_published = TRUE
                AND rt.language = ?
            ORDER BY r.created_at DESC
            `,
            [language]
        );

        return rows;
    },

    // ==========================================
    // ADD TRANSLATION
    // ==========================================

    async addTranslation({
        id,
        reviewId,
        language,
        text,
    }) {
        const [result] = await db.execute(
            `
            INSERT INTO review_translations (
                id,
                review_id,
                language,
                text
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                id,
                reviewId,
                language,
                text,
            ]
        );

        return result;
    },

    // ==========================================
    // UPDATE TRANSLATION
    // ==========================================

    async updateTranslation({
        reviewId,
        language,
        text,
    }) {
        const [result] = await db.execute(
            `
            UPDATE review_translations
            SET text = ?
            WHERE review_id = ?
                AND language = ?
            `,
            [
                text,
                reviewId,
                language,
            ]
        );

        return result;
    },

    // ==========================================
    // DELETE TRANSLATIONS
    // ==========================================

    async deleteTranslationsByReviewId(reviewId) {
        const [result] = await db.execute(
            `
            DELETE FROM review_translations
            WHERE review_id = ?
            `,
            [reviewId]
        );

        return result;
    },

    // ==========================================
    // GET TRANSLATIONS
    // ==========================================

    async getTranslationsByReviewId(reviewId) {
        const [rows] = await db.execute(
            `
            SELECT
                id,
                review_id AS reviewId,
                language,
                text,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM review_translations
            WHERE review_id = ?
            ORDER BY language ASC
            `,
            [reviewId]
        );

        return rows;
    },

    // ==========================================
    // GET REVIEW WITH TRANSLATIONS
    // ==========================================

    async getReviewWithTranslations(reviewId) {
        const review =
            await this.getReviewById(reviewId);

        if (!review) {
            return null;
        }

        const translations =
            await this.getTranslationsByReviewId(
                reviewId
            );

        return {
            ...review,
            translations,
        };
    },
};

export default ReviewRepository;