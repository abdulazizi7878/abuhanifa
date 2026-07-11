import formidable from "formidable";
import cloudinary from "cloudinary";
import { url } from "node:inspector";

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    /*
    res.status(200).json({
        success: true,
        url:"/images/demo-1-a.webp",
    });
    return;
    */


    try {

        const form = formidable({
            keepExtensions: true,
        });


        const [fields, files] = await form.parse(req);


        const image = files.image[0];


        const result = await cloudinary.v2.uploader.upload(
            image.filepath,
            {
                folder: "my-project",
            }
        );


        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            url: result.secure_url,
        });


    } catch(error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}