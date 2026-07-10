import { ShowOrderedProducts } from "../../repositories/viewQu";

export default async function handler(req,res) {
    

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