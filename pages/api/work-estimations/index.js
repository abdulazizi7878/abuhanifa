import { requireAdmin } from "@/lib/auth";
import {WorkEstimationService} from "@/services/work-estimation.service";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await requireAdmin(req, res);

            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 20);
            const search = String(req.query.search || "");

            const result = await WorkEstimationService.getEstimations({
                page,
                limit,
                search,
            });

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination,
            });
        } catch (error) {
            console.error("GET /api/work-estimations error:", error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Failed to fetch work estimations.",
            });
        }
    }

    if (req.method === "POST") {
        try {
            await requireAdmin(req, res);

            const result = await WorkEstimationService.createEstimation(
                req.body
            );

            return res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("POST /api/work-estimations error:", error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Failed to create work estimation.",
            });
        }
    }

    return res.status(405).json({
        success: false,
        message: "Method not allowed.",
    });
}