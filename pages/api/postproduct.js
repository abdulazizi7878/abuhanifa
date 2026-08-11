import { EnterProduct } from "../../services/insert.service";
import { requireAdmin } from "../../lib/auth";

export default async function handler(req, res) {
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const {
            name,
            price,
            description,
            image,
            publicId,
            resourceType,
        } = req.body;

        const response = await EnterProduct(
            name,
            price,
            description,
            image,
            publicId,
            resourceType
        );

        return res.status(200).json({
            success: true,
            response,
        });
    } catch (err) {
        console.error("POST PRODUCT ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Error while posting the product",
        });
    }
}