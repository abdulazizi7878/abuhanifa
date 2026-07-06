import { uploadImage } from "../../services/upload";

export default async function handler(req,res) {

   const response =  uploadImage(req);

    res.status(200).json({
        success:true,
        response: response
    })

}