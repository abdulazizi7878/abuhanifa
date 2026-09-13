import { ChangePassword } from "../../services/auth.services";

import { VeriifyToken } from "../../lib/jwt";

export default async function handler(
    req,
    res
) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const token =
            req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        let decodedToken;

        try {
            decodedToken =
                await VeriifyToken(token);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid or expired session",
            });
        }

        if (!decodedToken?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All password fields are required",
            });
        }

        if (
            newPassword !== confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New passwords do not match",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 8 characters",
            });
        }

        const response =
            await ChangePassword(
                decodedToken.id,
                currentPassword,
                newPassword
            );

        if (!response.success) {
            const status =
                response.message ===
                    "Current password is incorrect"
                    ? 400
                    : 500;

            return res.status(status).json(
                response
            );
        }

        return res.status(200).json(
            response
        );
    } catch (err) {
        console.error(
            "CHANGE PASSWORD API ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "SERVER ERROR",
        });
    }
}