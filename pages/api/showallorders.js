import {GetAllOrders} from "../../services/view.services";
import { requireAdmin } from "../../lib/auth";

export default async function handler(req,res) {

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

    try {
        const reponse = await GetAllOrders();

        res.status(200).json({
            success:true,
            orders: reponse
        })
    } catch (err) {
        res.status(500).json({
            success:false
        })
    }

}