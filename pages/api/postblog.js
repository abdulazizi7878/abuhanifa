import { PostBlog } from "../../services/news";

export default async function handler(req, res) {

    const {title, description} = req.body;
    const response = await PostBlog(title,description);

    res.status(200).json({
        success:true,
        response: response
    })
}