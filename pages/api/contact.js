import sendEmail from "../../services/mailer";
import { EnterMessage } from "../../services/insert.service";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    const { name, email, message } = req.body;

    try {
        let emailSent = false;

        // Try sending the email
        try {
            await sendEmail({
                name,
                email,
                message,
            });

            emailSent = true;
        } catch (emailError) {
            console.error("CONTACT EMAIL ERROR:", emailError);
        }

        // Always save the message
        await EnterMessage(name, email, message);

        if (!emailSent) {
            return res.status(200).json({
                success: true,
                message: "Message was saved, but email couldn't be sent.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email sent and message saved.",
        });
    } catch (err) {
        console.error("CONTACT API ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Email couldn't be sent and message couldn't be saved.",
            error: err.message,
        });
    }
}