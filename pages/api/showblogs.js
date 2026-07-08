import { GetBlogs } from "../../services/news";

export default async function handler(req,res) {
    
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    try {
        const response = await GetBlogs();

        res.status(200).json({
            success:true,
            data: response
        })
    } catch (err){
        res.status(500).json({
            success:false,
            error:err
        })
    }

    
}