import { PostComment } from "../../services/news";

export default async function handler(req, res) {

    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    const {name,email,comment, blogId} = req.body;
  
try {

    const response = await PostComment(name,email,comment,blogId);
    
    res.status(200).json({
        status:"success",
        message:"comment posted successfully",
    })    

} catch (err){
    
    res.status(500).json({
        status: "failed",
        message: "unable to post comment",
    })
    }
    
}