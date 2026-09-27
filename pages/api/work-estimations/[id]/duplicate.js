import { requireAdmin } from "../../../../lib/auth";
import { WorkEstimationService } from "../../../../services/work-estimation.service";

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res
            .status(auth.status)
            .json({
                success: false,
                message: auth.message,
            });
    }

    const { id } = req.query;

    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                success: false,
                message: "Method Not Allowed",
            });
        }

        const estimation =
            await WorkEstimationService.duplicateEstimation(
                id
            );

        return res.status(201).json({
            success: true,
            data: estimation,
        });
    } catch (error) {
        console.error(
            "DUPLICATE WORK ESTIMATION API ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to duplicate estimation",
        });
    }
}