import PaymentReceiverService from "@/services/payment-receiver.service";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req, res) {
    try {
        await requireAdmin(req, res);

        const { id } = req.query;

        if (req.method === "POST") {
            const data =
                await PaymentReceiverService.addPayment(
                    id,
                    req.body
                );

            return res.status(201).json({
                data,
            });
        }

        return res.status(405).json({
            message: "Method not allowed",
        });
    } catch (error) {
        console.error("Payment API error:", error);

        return res.status(400).json({
            message: error.message || "Something went wrong",
        });
    }
}