import sendEmail from "../../services/mailer";
import {EnterMessage} from "../../services/insert.service";

export default async function handler(req, res) {

   if(req.method != "POST"){
        res.status(405).json({
            success:false,
            message:"Method Not Allowed"
        })

        return;
    }
    
    const {name,email, message} = req.body;

    try{
        

        try{
            const emailSent = await sendEmail({name, email, message});
        } catch(err){

           return res.status(500).json({
                success:false,
                message:"Email couldn't be sent but message was saved",
            })

            
        }
        const messageInserted = await EnterMessage(name,email,message);

        res.status(200).json({
            success:true,
            message:"email sent"
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Email couldn't be sent and message couldn't be saved",
        })
    }
}