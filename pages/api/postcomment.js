import { PostComment } from "../../services/news";

export default async function handler(req, res) {
  
try {
    const response = await PostComment(req.body.email,req.body.comment,req.body.blogId);
    
    res.status(200).json({
        status:"success",
        message:"comment posted successfully"
    })    

} catch (err){
    
        res.status(500).json({
            status: "failed",
            message: "unable to post comment"
        })
    }
    
}