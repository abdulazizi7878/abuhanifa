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
        if (req.method === "GET") {
            const estimation =
                await WorkEstimationService.getEstimation(
                    id
                );

            return res.status(200).json({
                success: true,
                data: estimation.tasks,
            });
        }

        if (req.method === "POST") {
            const body = req.body || {};

            let task;

            if (body.taskId !== undefined) {
                task =
                    await WorkEstimationService.addTaskFromLibrary(
                        id,
                        body.taskId,
                        body.quantity ?? 1
                    );
            } else {
                task =
                    await WorkEstimationService.addTask(
                        id,
                        body
                    );
            }

            return res.status(201).json({
                success: true,
                data: task,
            });
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (error) {
        console.error(
            "WORK ESTIMATION TASKS API ERROR:",
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