import formidable from "formidable";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    try {
        const form = formidable({
            multiples: false,
            keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);

        const image = files.image?.[0];

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        const ext = path.extname(image.originalFilename || ".jpg");
        const fileName = `${randomUUID()}${ext}`;

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        await fs.mkdir(uploadDir, { recursive: true });

        await fs.copyFile(
            image.filepath,
            path.join(uploadDir, fileName)
        );

        return res.status(200).json({
            success: true,
            message: "Image Uploaded Successfully",
            fileName,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}