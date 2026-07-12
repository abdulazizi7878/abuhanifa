import { DeleteItem } from "../../services/delete.services";

export default async function handler(req,res) {
    
    const {item, id} = req.body;

    try {
        const response = await DeleteItem(item,id);
        res.status(200).json({
            success:true,
            message:"Item Deleted successfully"
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message:"We couldn't delete the item",
        })
    }
}