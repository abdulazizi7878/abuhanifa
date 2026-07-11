import { EditProduct } from "../../services/update.services";

export default async function handler(req,res) {
    
    const {name,price,description,link} = req.body;

    try {
        const response = await EditProduct(name,price,description,link);

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