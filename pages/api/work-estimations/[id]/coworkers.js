import { requireAdmin } from "../../../../lib/auth";
import { WorkEstimationRepository } from "../../../../repositories/work-estimation.repository";
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
        if (req.method === "GET") {
            const estimation =
                await WorkEstimationService.getEstimation(
                    id
                );

            return res.status(200).json({
                success: true,
                data: estimation.coworkers,
            });
        }

        if (req.method === "POST") {
            const coworker =
                await WorkEstimationService.addCoworker(
                    id,
                    req.body?.name
                );

            return res.status(201).json({
                success: true,
                data: coworker,
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (error) {
        console.error(
            "WORK ESTIMATION COWORKERS API ERROR:",
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