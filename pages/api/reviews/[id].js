// file: pages/api/reviews/[id].js

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
        const { id } = req.query;

        // ==========================================
        // GET ONE
        // ==========================================

        if (req.method === "GET") {
            const review =
                await ReviewService.getReview(id);

            return res.status(200).json({
                success: true,
                data: review,
            });
        }

        // ==========================================
        // UPDATE
        // ==========================================

        if (req.method === "PUT") {
            const review =
                await ReviewService.updateReview(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message:
                    "Review updated successfully",
                data: review,
            });
        }

        // ==========================================
        // DELETE
        // ==========================================

        if (req.method === "DELETE") {
            const result =
                await ReviewService.deleteReview(
                    id
                );

            return res.status(200).json({
                success: true,
                message:
                    "Review deleted successfully",
                data: result,
            });
        }

        res.setHeader(
            "Allow",
            ["GET", "PUT", "DELETE"]
        );

        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed`,
        });
    } catch (error) {
        console.error(
            "Review API error:",
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