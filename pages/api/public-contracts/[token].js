import ContractService from "@/services/contract.service";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method not allowed",
        });
    }

    try {
        const { token } = req.query;

        const contract =
            await ContractService.getPublicContract(token);

        return res.status(200).json({
            data: contract,
        });
    } catch (error) {
        console.error("Public contract error:", error);

        const statusCode =
            error.message === "Contract not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            message:
                error.message || "Failed to load contract",
        });
    }
}