import { ShowOrderedProducts } from "../../repositories/viewQu";
import { requireAdmin } from "../../lib/auth";

export default async function handler(req,res) {
     
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        const response = await ShowOrderedProducts();

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