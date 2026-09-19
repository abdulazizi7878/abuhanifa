import {
    GetReviewSessionService,
    SubmitReviewService,
} from "../../../services/review.service";

export default async function handler(req, res) {
    const { token } = req.query;

    try {
        if (req.method === "GET") {
            const session =
                await GetReviewSessionService(token);

            return res.status(200).json({
                success: true,
                session,
            });
        }

        if (req.method === "POST") {
            const {
                reviewer_name,
                rating,
                review_text,
            } = req.body;

            await SubmitReviewService(
                token,
                reviewer_name,
                rating,
                review_text
            );

            return res.status(201).json({
                success: true,
                message: "Review submitted successfully",
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (err) {
        console.error("PUBLIC REVIEW API ERROR:", err);

        const message = err.message;

        if (message === "Review link not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }

        if (
            message === "Review link has expired" ||
            message === "Review link has already been used"
        ) {
            return res.status(410).json({
                success: false,
                message,
            });
        }

        return res.status(400).json({
            success: false,
            message,
        });
    }
}