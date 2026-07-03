import { GetBlog } from "../../services/news"

export default async function handlers(req,res) {


    const result = await GetBlog(req.body.link);

    res.status(200).json({
        status:"success",
        data: result
    });
}