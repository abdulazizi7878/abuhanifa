import { EnterOrder } from "../../services/order.service"

export default async function handler(req, res) {
    
    const {name,phone_number, location, job, job_type, comment} = req.body;
    
    try {    

        const response = await EnterOrder(name,phone_number,location,job,job_type,comment);

        res.status(200).json({
            success:true,
            message: "Order Successfully Sent!" 
        });

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err,
            sentData: {
                name: name,
                phone_number: phone_number,
                location:location,
                job:job,
                job_type:job_type,
                comment:comment
            }
        });
    }
}