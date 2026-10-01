import { requireAdmin } from "@/lib/auth";
import { EmployeeAttendanceService } from "@/services/employee-attendance.service";

export default async function handler(req, res) {
    if (
        req.method !== "GET" &&
        req.method !== "POST"
    ) {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await requireAdmin(req, res);

        if (req.method === "GET") {
            const date =
                req.query.date ||
                new Date().toISOString().slice(0, 10);

            const data =
                await EmployeeAttendanceService.getWeek(
                    date
                );

            return res.status(200).json({
                success: true,
                data,
            });
        }

        const data =
            await EmployeeAttendanceService.saveAttendance(
                req.body
            );

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(
            "Employee attendance API error:",
            error
        );

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Something went wrong",
        });
    }
}