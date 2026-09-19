import { GetPublishedReviewsService } from "../../services/review.service";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const reviews =
            await GetPublishedReviewsService();

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (err) {
        console.error(
            "PUBLIC REVIEWS API ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load reviews",
        });
    }
}