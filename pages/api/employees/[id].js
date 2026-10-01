import { requireAdmin } from "@/lib/auth";
import { EmployeeService } from "@/services/employee.service";

export default async function handler(req, res) {
    if (
        req.method !== "GET" &&
        req.method !== "PUT" &&
        req.method !== "DELETE"
    ) {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await requireAdmin(req, res);

        const { id } = req.query;

        if (req.method === "GET") {
            const employee =
                await EmployeeService.getEmployee(id);

            return res.status(200).json({
                success: true,
                data: employee,
            });
        }

        if (req.method === "PUT") {
            const employee =
                await EmployeeService.updateEmployee(
                    id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                data: employee,
            });
        }

        await EmployeeService.deleteEmployee(id);

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.error("Employee API error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}