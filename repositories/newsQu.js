import {db} from "@/lib/db";


export async function ShowAllBlogs() {
    const [result] = await db.query("SELECT * FROM blogs;");
    
    if (!result) throw new Error("We couldn't found Blogs");
    
    return {
        result
    };
}

export async function ShowBlog(link) {
    const [result] = await db.query(
        "SELECT * FROM blogs WHERE link = ?",
        [link]
    );
    
    if (!result) throw new Error("We couldn't fint the blog");

    return {
        link,
        result
    };
}

export async function InsertComment(email,comment,blogId) {
    const [result] = await db.query(
        "INSERT INTO comments (email,comment,blog_id) VALUES (?,?,?);",
        [email,comment,blogId]
    );

    if (!result) throw new Error("Comment cann't be posted!");
     
    return{
        message: "comment posted successfully"
    } 
}

export async function ShowComments(blogId) {
    const [result] = await db.query(
        "SELECT comment FROM comments WHERE blog_id = ? ORDER BY id DESC",
        [blogId]
    );

    if(!result) throw new Error("No comment found!");

    return{
        result
    }
}