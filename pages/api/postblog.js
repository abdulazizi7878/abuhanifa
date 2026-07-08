import { PostBlog } from "../../services/news";

export default async function handler(req, res) {
    
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