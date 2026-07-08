//import sendEmail from "../../services/mailer";
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

    const messageInserted = await EnterMessage(name,email,message);
  //  const emailSent = await sendEmail(req);
    
    
    return messageInserted
}