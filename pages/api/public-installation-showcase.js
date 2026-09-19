import {
    GetInstallationShowcasesService,
} from "../../services/installationShowcase.service";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const showcases =
            await GetInstallationShowcasesService();

        const publicShowcases = showcases.map(
            (showcase) => ({
                id: showcase.id,
                image: showcase.image,
                created_at: showcase.created_at,
            })
        );

        return res.status(200).json({
            success: true,
            showcases: publicShowcases,
        });
    } catch (err) {
        console.error(
            "PUBLIC INSTALLATION SHOWCASE API ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load installation showcase",
        });
    }
}