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

    const { taskId } = req.query;

    try {
        if (req.method === "PUT") {
            const task =
                await WorkEstimationService.updateTask(
                    taskId,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: task,
            });
        }

        if (req.method === "DELETE") {
            const result =
                await WorkEstimationService.deleteTask(
                    taskId
                );

            return res.status(200).json(result);
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (error) {
        console.error(
            "WORK ESTIMATION TASK API ERROR:",
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