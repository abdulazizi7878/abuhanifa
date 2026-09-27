import { requireAdmin } from "../../../lib/auth";
import { WorkEstimationService } from "../../../services/work-estimation.service";

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
        if (req.method === "GET") {
            const estimation =
                await WorkEstimationService.getEstimation(
                    id
                );

            return res.status(200).json({
                success: true,
                data: estimation,
            });
        }

        if (req.method === "PUT") {
            const estimation =
                await WorkEstimationService.updateEstimation(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: estimation,
            });
        }

        if (req.method === "DELETE") {
            const result =
                await WorkEstimationService.deleteEstimation(
                    id
                );

            return res.status(200).json(result);
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (error) {
        console.error(
            "WORK ESTIMATION [ID] API ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to process request",
        });
    }
}