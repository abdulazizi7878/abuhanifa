import { requireAdmin } from "../../../lib/auth";

import {
    CreateReviewSessionService,
    GetAllReviewSessionsService,
} from "../../../services/review.service";

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        if (req.method === "POST") {
            const { duration_minutes } = req.body;

            const session = await CreateReviewSessionService(
                duration_minutes
            );

            return res.status(201).json({
                success: true,
                session,
            });
        }

        if (req.method === "GET") {
            const sessions =
                await GetAllReviewSessionsService();

            return res.status(200).json({
                success: true,
                sessions,
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (err) {
        console.error("REVIEW API ERROR:", err);

        return res.status(400).json({
            success: false,
            message:
                err.message ||
                "Review operation failed",
        });
    }
}