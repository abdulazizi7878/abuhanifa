import {GetOneProduct} from "../../services/view.services"

export default async function handler(req, res) {

    try{

        const response = await GetOneProduct(req.body.link);
        
        res.status(200).json({
            success:true,
            data: response
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message:"We couldn't fetch the data"
        })
    }
}