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

    console.log("The result is",result);
    console.log("The link is",req.body.link);

    res.status(200).json({
        success:true,
        data: result
    });
}