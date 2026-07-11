import {EnterOrderProduct} from "../../services/insert.service";

export default async function handler(req, res) {
    
    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }

    const {name,phone_number,location,account_number,amount,image,product_id} = req.body;

    try{

    const response = await EnterOrderProduct(name,phone_number,location,account_number,amount,image,product_id);

    res.status(200).json({
        success:true,
        response: response
    })
    } catch(err){

    res.status(500).json({
        success:false,
        message:"error while ordering" + err
    })
    }

}