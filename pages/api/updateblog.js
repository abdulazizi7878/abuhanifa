import { EditBlog } from "../../services/update.services";

export default async function handler(req,res) {
    
    const {title, description, link} = req.body;

    try {
        const response = await EditBlog(title,description,link);

        res.status(200).json({
            success:true,
            data: response
        })
    } catch (err){
        res.status(500).json({
            success:false,
            error:err.message
        })
    }

    
}