import { EnterProduct } from "../../services/insert.service";
import { requireAdmin } from "../../lib/auth";  

export default async function handler(req, res) {
    
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    try{
        const {name,price, description,image, publicId, resourceType} = req.body;
        const reponse = await EnterProduct(name,price,description,image,publicId,resourceType);

        res.status(200).json({
            success:true,
            response: response
        })
    } catch(err){

        res.status(500).json({
            success:false,
            message: "error while posting the product"
        })
    }


}