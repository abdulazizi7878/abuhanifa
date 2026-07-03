import { GetBlogs } from "../../services/news";

export default async function handler(req,res) {
    
    const response = await GetBlogs();

    res.status(200).json({
        status:"success",
        data: response
    })
    
}