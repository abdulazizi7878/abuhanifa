import { requireAdmin } from "@/lib/auth";
import { EmployeeService } from "@/services/employee.service";

export default async function handler(req, res) {
    if (req.method !== "GET" && req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        await requireAdmin(req, res);

        if (req.method === "GET") {
            const employees =
                await EmployeeService.getEmployees();

            return res.status(200).json({
                success: true,
                data: employees,
            });
        }

        const employee =
            await EmployeeService.createEmployee(
                req.body
            );

        return res.status(201).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error("Employees API error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}