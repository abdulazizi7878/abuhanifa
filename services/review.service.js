import crypto from "crypto";

import {
    CreateReviewSession,
    GetReviewByToken,
    SubmitReview,
    GetPublishedReviews,
    GetAllReviewSessions,
} from "../repositories/review.repository";

const EXPIRATION_OPTIONS = {
    10: 10,
    30: 30,
    60: 60,
    300: 300,
    1440: 1440,
    2880: 2880,
    4320: 4320,
};

export async function CreateReviewSessionService(durationMinutes) {
    const minutes = Number(durationMinutes);

    if (!EXPIRATION_OPTIONS[minutes]) {
        throw new Error("Invalid review session duration");
    }

    // 32 cryptographically secure random bytes = 64-character token
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
        Date.now() + minutes * 60 * 1000
    );

    const result = await CreateReviewSession(
        token,
        expiresAt
    );

    return {
        ...result,
        duration_minutes: minutes,
    };
}

export async function GetReviewSessionService(token) {
    if (!token || typeof token !== "string") {
        throw new Error("Review token is required");
    }

    const review = await GetReviewByToken(token);

    if (!review) {
        throw new Error("Review link not found");
    }

    if (review.used_at) {
        throw new Error("Review link has already been used");
    }

    if (new Date(review.expires_at) <= new Date()) {
        throw new Error("Review link has expired");
    }

    return {
        valid: true,
        expires_at: review.expires_at,
    };
}

export async function SubmitReviewService(
    token,
    reviewerName,
    rating,
    reviewText
) {
    if (!token || typeof token !== "string") {
        throw new Error("Review token is required");
    }

    if (!reviewerName || typeof reviewerName !== "string") {
        throw new Error("Reviewer name is required");
    }

    if (!reviewText || typeof reviewText !== "string") {
        throw new Error("Review text is required");
    }

    const cleanName = reviewerName.trim();
    const cleanText = reviewText.trim();
    const numericRating = Number(rating);

    if (!cleanName) {
        throw new Error("Reviewer name is required");
    }

    if (!cleanText) {
        throw new Error("Review text is required");
    }

    if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
    ) {
        throw new Error("Rating must be between 1 and 5");
    }

    if (cleanName.length > 150) {
        throw new Error("Reviewer name is too long");
    }

    if (cleanText.length > 5000) {
        throw new Error("Review text is too long");
    }

    const result = await SubmitReview(
        token,
        cleanName,
        numericRating,
        cleanText
    );

    if (result.affectedRows === 0) {
        const existingReview = await GetReviewByToken(token);

        if (!existingReview) {
            throw new Error("Review link not found");
        }

        if (existingReview.used_at) {
            throw new Error("Review link has already been used");
        }

        throw new Error("Review link has expired");
    }

    return {
        success: true,
    };
}

export async function GetPublishedReviewsService() {
    return await GetPublishedReviews();
}

export async function GetAllReviewSessionsService() {
    return await GetAllReviewSessions();
}