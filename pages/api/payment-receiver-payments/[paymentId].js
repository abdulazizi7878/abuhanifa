import PaymentReceiverService from "../../../services/payment-receiver.service";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
    try {
        await requireAdmin(req, res);

        const { paymentId } = req.query;

        if (req.method === "PUT") {
            const data =
                await PaymentReceiverService.updatePayment(
                    paymentId,
                    req.body
                );

            if (!data) {
                return res.status(404).json({
                    message: "Payment not found",
                });
            }

            return res.status(200).json({
                data,
            });
        }

        if (req.method === "DELETE") {
            await PaymentReceiverService.deletePayment(paymentId);

            return res.status(200).json({
                message: "Payment deleted successfully",
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