import {GetAllPromotions} from "../../services/view.services";

export default async function handler(req,res) {
   
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }


    try {
        const reponse = await GetAllPromotions();

        res.status(200).json({
            success:true,
            promotions: reponse
        })
    } catch (err) {
        res.status(500).json({
            success:false,
        })
    }

}