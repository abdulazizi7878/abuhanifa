import ContractService from "@/services/contract.service";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
    try {
        await requireAdmin(req, res);

        const { id } = req.query;

        if (req.method === "GET") {
            const contract =
                await ContractService.getContract(id);

            return res.status(200).json({
                data: contract,
            });
        }

        if (req.method === "PUT") {
            const contract =
                await ContractService.updateContract(
                    id,
                    req.body
                );

            return res.status(200).json({
                message: "Contract updated successfully",
                data: contract,
            });
        }

        if (req.method === "DELETE") {
            await ContractService.deleteContract(id);

            return res.status(200).json({
                message: "Contract deleted successfully",
            });
        }

        return res.status(405).json({
            message: "Method not allowed",
        });
    } catch (error) {
        console.error("Contract API error:", error);

        const statusCode =
            error.message === "Contract not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            message: error.message || "Something went wrong",
        });
    }
}