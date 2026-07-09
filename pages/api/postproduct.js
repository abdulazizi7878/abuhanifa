import { EnterProduct } from "../../services/insert.service";

export default async function handler(req, res) {
    
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    try{
        const {name,price, description,image} = req.body;
        const reponse = await EnterProduct(name,price,description,image);

        res.status(200).json({
            success:true,
            response: response
        })
    } catch(err){

        res.status(500).json({
            success:false,
            message: "error while posting the product"
        })
    }


}