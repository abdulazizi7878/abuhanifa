// file: services/review.service.js

import { randomUUID } from "crypto";

import ReviewRepository from "@/repositories/review.repository.js";

import { supportedLanguages } from "@/config/supportedLanguages.js";

const supportedLanguageCodes =
    supportedLanguages.map(
        (language) => language.code
    );

const ReviewService = {
    // ==========================================
    // CREATE REVIEW
    // ==========================================

    async createReview({
        customerName,
        rating,
        translations,
        isPublished = true,
    }) {
        // ------------------------------------------
        // CUSTOMER NAME
        // ------------------------------------------

        if (
            !customerName ||
            !customerName.trim()
        ) {
            throw new Error(
                "Customer name is required"
            );
        }

        // ------------------------------------------
        // RATING
        // ------------------------------------------

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            throw new Error(
                "Rating must be between 1 and 5"
            );
        }

        // ------------------------------------------
        // TRANSLATIONS
        // ------------------------------------------

        if (
            !translations ||
            typeof translations !== "object" ||
            Array.isArray(translations)
        ) {
            throw new Error(
                "Translations must be an object"
            );
        }

        // ------------------------------------------
        // CHECK EVERY SUPPORTED LANGUAGE
        // ------------------------------------------

        for (
            const language of supportedLanguageCodes
        ) {
            const text =
                translations[language];

            if (
                !text ||
                !text.trim()
            ) {
                throw new Error(
                    `Translation for "${language}" is required`
                );
            }
        }

        // ------------------------------------------
        // CREATE REVIEW
        // ------------------------------------------

        const reviewId = randomUUID();

        await ReviewRepository.createReview({
            id: reviewId,
            customerName: customerName.trim(),
            rating,
            isPublished,
        });

        // ------------------------------------------
        // CREATE TRANSLATIONS
        // ------------------------------------------

        for (
            const language of supportedLanguageCodes
        ) {
            await ReviewRepository.addTranslation({
                id: randomUUID(),
                reviewId,
                language,
                text: translations[language].trim(),
            });
        }

        return ReviewRepository.getReviewWithTranslations(
            reviewId
        );
    },

    // ==========================================
    // UPDATE REVIEW
    // ==========================================

    async updateReview(
        reviewId,
        {
            customerName,
            rating,
            translations,
            isPublished = true,
        }
    ) {
        // ------------------------------------------
        // CHECK REVIEW
        // ------------------------------------------

        const existingReview =
            await ReviewRepository.getReviewById(
                reviewId
            );

        if (!existingReview) {
            throw new Error(
                "Review not found"
            );
        }

        // ------------------------------------------
        // CUSTOMER NAME
        // ------------------------------------------

        if (
            !customerName ||
            !customerName.trim()
        ) {
            throw new Error(
                "Customer name is required"
            );
        }

        // ------------------------------------------
        // RATING
        // ------------------------------------------

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            throw new Error(
                "Rating must be between 1 and 5"
            );
        }

        // ------------------------------------------
        // TRANSLATIONS
        // ------------------------------------------

        if (
            !translations ||
            typeof translations !== "object" ||
            Array.isArray(translations)
        ) {
            throw new Error(
                "Translations must be an object"
            );
        }

        // ------------------------------------------
        // CHECK EVERY SUPPORTED LANGUAGE
        // ------------------------------------------

        for (
            const language of supportedLanguageCodes
        ) {
            const text =
                translations[language];

            if (
                !text ||
                !text.trim()
            ) {
                throw new Error(
                    `Translation for "${language}" is required`
                );
            }
        }

        // ------------------------------------------
        // UPDATE REVIEW
        // ------------------------------------------

        await ReviewRepository.updateReview({
            id: reviewId,
            customerName: customerName.trim(),
            rating,
            isPublished,
        });

        // ------------------------------------------
        // REPLACE TRANSLATIONS
        // ------------------------------------------

        await ReviewRepository.deleteTranslationsByReviewId(
            reviewId
        );

        for (
            const language of supportedLanguageCodes
        ) {
            await ReviewRepository.addTranslation({
                id: randomUUID(),
                reviewId,
                language,
                text: translations[language].trim(),
            });
        }

        return ReviewRepository.getReviewWithTranslations(
            reviewId
        );
    },

    // ==========================================
    // GET ONE REVIEW
    // ==========================================

    async getReview(reviewId) {
        const review =
            await ReviewRepository.getReviewWithTranslations(
                reviewId
            );

        if (!review) {
            throw new Error(
                "Review not found"
            );
        }

        return review;
    },

    // ==========================================
    // GET REVIEWS
    // ==========================================

    async getReviews(language = null) {
        if (language) {
            if (
                !supportedLanguageCodes.includes(
                    language
                )
            ) {
                throw new Error(
                    "Unsupported language"
                );
            }

            return ReviewRepository.getPublishedReviewsByLanguage(
                language
            );
        }

        return ReviewRepository.getPublishedReviews();
    },

    // ==========================================
    // DELETE REVIEW
    // ==========================================

    async deleteReview(reviewId) {
        const existingReview =
            await ReviewRepository.getReviewById(
                reviewId
            );

        if (!existingReview) {
            throw new Error(
                "Review not found"
            );
        }

        await ReviewRepository.deleteReview(
            reviewId
        );

        return {
            message:
                "Review deleted successfully",
        };
    },
};

export default ReviewService;