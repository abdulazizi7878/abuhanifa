import { DeleteItem } from "../../services/delete.services";
import { requireAdmin } from "../../lib/auth";
import { log } from "node:console";

export default async function handler(req,res) {
    
    const {item, id} = req.body;
    const auth = await requireAdmin(req);

    if (!auth.authorized) {
        return res.status(auth.status).json({
            success: false,
            message: auth.message,
        });
    }

    try {
        const response = await DeleteItem(item,id);
        res.status(200).json({
            success:true,
            message:"Item Deleted successfully"
        })

    } catch(err){
        console.log("The error is: ", err);
        
        res.status(500).json({
            success:false,
            message:"We couldn't delete the item",
        })
    }
}