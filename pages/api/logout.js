export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        res.setHeader(
            "Set-Cookie",
            "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
        );

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("ADMIN LOGOUT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to logout",
        });
    }
}
