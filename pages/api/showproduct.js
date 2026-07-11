import {GetOneProduct} from "../../services/view.services"

export default async function handler(req, res) {

    const {link,amount} = req.body;

    try{

        const response = await GetOneProduct(link,amount);
        
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