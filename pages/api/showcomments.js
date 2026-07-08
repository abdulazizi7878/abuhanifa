import { GetComments } from "../../services/news";

export default async function handler(req, res) {
    
   if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }
    
    const response = await GetComments(req.body.blog_id);
    
    res.status(200).json({
        status:"success",
        data: response
    })
}