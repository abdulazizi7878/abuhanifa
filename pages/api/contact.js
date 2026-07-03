import sendEmail from "../../services/mailer";

export default async function handler(req, res) {
    const response = await sendEmail(req);
    
    return {
        response
    }
}