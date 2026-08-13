import { EnterOrder } from "../../services/insert.service";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    const {
        name,
        phone_number,
        location,
        jobs,
        job_types,
        comment
    } = req.body;

    try {
        const response = await EnterOrder(
            name,
            phone_number,
            location,
            jobs,
            job_types,
            comment
        );

        return res.status(200).json({
            success: true,
            message: "Order Successfully Sent!"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message || err,
            sentData: {
                name,
                phone_number,
                location,
                jobs,
                job_types,
                comment
            }
        });
    }
}