import { GetComments } from "../../services/news";

export default async function handler(req, res) {
    
    const response = await GetComments(req.body.blog_id);
    
    res.status(200).json({
        status:"success",
        data: response
    })
}