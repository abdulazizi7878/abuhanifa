import { ShowPromotion } from "../../repositories/viewQu";

export default async function handler(req, res) {

    const {link} = req.body;

    try{

        const response = await ShowPromotion(link);
        
        res.status(200).json({
            success:true,
            data: response
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message:"We couldn't fetch the data",
        })
    }
}