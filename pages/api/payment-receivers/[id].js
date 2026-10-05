import PaymentReceiverService from "../../../services/payment-receiver.service";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
    try {
        await requireAdmin(req, res);

        const { id } = req.query;

        if (req.method === "GET") {
            const data =
                await PaymentReceiverService.getPaymentReceiver(id);

            return res.status(200).json({
                data,
            });
        }

        if (req.method === "PUT") {
            const data =
                await PaymentReceiverService.updatePaymentReceiver(
                    id,
                    req.body
                );

            return res.status(200).json({
                data,
            });
        }

        if (req.method === "DELETE") {
            await PaymentReceiverService.deletePaymentReceiver(id);

            return res.status(200).json({
                message: "Payment receiver deleted successfully",
            });
        }

        return res.status(405).json({
            message: "Method not allowed",
        });
    } catch (error) {
        console.error("Payment receiver API error:", error);

        return res.status(400).json({
            message: error.message || "Something went wrong",
        });
    }
}