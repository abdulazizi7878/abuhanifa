import { randomUUID } from "crypto";
import { InserBlog, InsertComment, ShowAllBlogs, ShowBlog, ShowComments } from "../repositories/newsQu";

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

export async function PostComment(name,email,comment,blogId) {

    if (!name) throw new Error("name required!");
    if (!email) throw new Error("email required!");
    if (!comment) throw new Error("comment text required!");
    if (!blogId) throw new Error("comment can't be posted right now!");

    const Rcomment = await InsertComment(name, email, comment, blogId);

    return Rcomment;

}

export async function GetComments(blogId) {
    
    const comments = await ShowComments(blogId);
    if (!comments) throw new Error("We couldn't load comments");
    
    return{
        comments
    }
}

export async function PostBlog(title, description) {
    if(!title) throw new Error("Title Required");
    if(!description) throw new Error("DEscription Required");

    const link = randomUUID();

    const Rblog = await InserBlog(title,description,link);
    return Rblog;
}