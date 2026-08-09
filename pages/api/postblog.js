import { PostBlog } from "../../services/news";
import { requireAdmin } from "../../lib/auth";

export default async function handler(req, res) {
    
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    const {title, description,image} = req.body;
    const response = await PostBlog(title,description,image);

    res.status(200).json({
        success:true,
        response: response
    })
}