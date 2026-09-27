import { requireAdmin } from "../../../lib/auth";
import { WorkTaskService } from "../../../services/work-task.service";

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

    try {
        if (req.method === "GET") {
            const result =
                await WorkTaskService.getTasks({
                    page: req.query.page,
                    limit: req.query.limit,
                    search: req.query.search,
                });

            return res.status(200).json({
                success: true,
                ...result,
            });
        }

        if (req.method === "POST") {
            const task =
                await WorkTaskService.createTask(
                    req.body
                );

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
            "WORK TASK API ERROR:",
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