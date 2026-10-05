import ContractService from "@/services/contract.service";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }

    try {
        await requireAdmin(req, res);

        const { id } = req.query;

        const contract =
            await ContractService.duplicateContract(id);

        return res.status(201).json({
            message: "Contract duplicated successfully",
            data: contract,
        });
    } catch (error) {
        console.error("Duplicate contract error:", error);

        return res.status(400).json({
            message:
                error.message || "Failed to duplicate contract",
        });
    }
}