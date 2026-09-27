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

    const { id } = req.query;

    try {
        if (req.method === "GET") {
            const task =
                await WorkTaskService.getTask(id);

            return res.status(200).json({
                success: true,
                data: task,
            });
        }

        if (req.method === "PUT") {
            const task =
                await WorkTaskService.updateTask(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: task,
            });
        }

        if (req.method === "DELETE") {
            const result =
                await WorkTaskService.deleteTask(id);

            return res.status(200).json(result);
        }

        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    } catch (error) {
        console.error(
            "WORK TASK [ID] API ERROR:",
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