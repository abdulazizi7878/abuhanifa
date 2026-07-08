import { uploadImage } from "../../services/upload";

export default async function handler(req,res) {

    if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }   

   const response =  uploadImage(req);

    res.status(200).json({
        success:true,
        response: response
    })

}