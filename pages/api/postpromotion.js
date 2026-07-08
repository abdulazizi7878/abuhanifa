import { EnterPromotion } from "../../services/insert.service";

export default async function handler(req, res) {
    
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    try {
    const {name,email,phone_number, title, description, image, owner_link} = req.body;
    const response = await EnterPromotion(name,email,phone_number,title,description,image,owner_link);

    res.status(200).json({
        success:true,
        response: response
    })        
    } catch (err){
        res.status(500).json({
            success:false,
            message:"error while fetching",
            error:err.message
        })
    }

}