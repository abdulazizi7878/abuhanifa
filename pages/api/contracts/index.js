import ContractService from "@/services/contract.service";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await requireAdmin(req, res);

            const {
                page = 1,
                limit = 20,
                search = "",
                status = "",
            } = req.query;

            const result = await ContractService.getContracts({
                page: Number(page),
                limit: Number(limit),
                search,
                status,
            });

            return res.status(200).json(result);
        } catch (error) {
            console.error("GET contracts error:", error);

            return res.status(500).json({
                message: error.message || "Failed to get contracts",
            });
        }
    }

    if (req.method === "POST") {
        try {
            await requireAdmin(req, res);

            const contract =
                await ContractService.createContract(req.body);

            return res.status(201).json({
                message: "Contract created successfully",
                data: contract,
            });
        } catch (error) {
            console.error("POST contract error:", error);

            return res.status(400).json({
                message: error.message || "Failed to create contract",
            });
        }
    }

    return res.status(405).json({
        message: "Method not allowed",
    });
}