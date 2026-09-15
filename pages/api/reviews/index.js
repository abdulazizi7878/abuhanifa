// file: pages/api/reviews/index.js

import ReviewService from "@/services/review.service";

import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        // ==========================================
        // GET ALL
        // ==========================================

        if (req.method === "GET") {
            const { language } = req.query;

            const reviews =
                await ReviewService.getReviews(
                    language || null
                );

            return res.status(200).json({
                success: true,
                data: reviews,
            });
        }

        // ==========================================
        // CREATE
        // ==========================================

        if (req.method === "POST") {
            const review =
                await ReviewService.createReview(
                    req.body
                );

            return res.status(201).json({
                success: true,
                message:
                    "Review created successfully",
                data: review,
            });
        }

        res.setHeader(
            "Allow",
            ["GET", "POST"]
        );

        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed`,
        });
    } catch (error) {
        console.error(
            "Reviews API error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Something went wrong",
        });
    }
}