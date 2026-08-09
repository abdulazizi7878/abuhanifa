import { EditBlog } from "../../services/update.services";
import { requireAdmin } from "../../lib/auth";


export default async function handler(req,res) {

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
            message: "Method not allowed",
        });
    }
    
    const {title, description, link} = req.body;

    try {
        const response = await EditBlog(title,description,link);

        res.status(200).json({
            success:true,
            data: response
        })
    } catch (err){
        res.status(500).json({
            success:false,
            error:err.message
        })
    }

    
}