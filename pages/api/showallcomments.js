import {GetAllComments} from "../../services/view.services";

export default async function handler(req,res) {

    try {
        const reponse = await GetAllComments();

        res.status(200).json({
            success:true,
            comments: reponse
        })
    } catch (err) {
        res.status(500).json({
            success:false
        })
    }

}