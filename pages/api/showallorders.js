import {GetAllOrders} from "../../services/view.services";

export default async function handler(req,res) {

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