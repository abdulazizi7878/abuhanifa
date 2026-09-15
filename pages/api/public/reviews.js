import ReviewService from "@/services/review.service";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);

        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed`,
        });
    }

    try {
        const { language } = req.query;

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required",
            });
        }

        const reviews =
            await ReviewService.getReviews(language);

        return res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        console.error(
            "Public reviews API error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Something went wrong",
        });
    }
}