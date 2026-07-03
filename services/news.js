import { InsertComment, ShowAllBlogs, ShowBlog, ShowComments } from "../repositories/newsQu";

export async function GetBlogs() {
    const blogs = await ShowAllBlogs();
    return {
        blogs
    }
}

export async function GetBlog(link) {
    const blog = await ShowBlog(link);

    return{
        blog
    }
}

export async function PostComment(email,comment,blogId) {
    
    if (!email) throw new Error("email required!");
    if (!comment) throw new Error("comment text required!");
    if (!blogId) throw new Error("comment can't be posted right now!");

    const Rcomment = await InsertComment(email, comment, blogId);

    return Rcomment;

}

export async function GetComments(blogId) {
    
    const comments = await ShowComments(blogId);
    if (!comments) throw new Error("We couldn't load comments");
    
    return{
        comments
    }
}