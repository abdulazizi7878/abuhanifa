import { GetBlog } from "../../services/news"

export default async function handlers(req,res) {
  
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    const result = await GetBlog(req.body.link);

    res.status(200).json({
        status:"success",
        data: result
    });
}