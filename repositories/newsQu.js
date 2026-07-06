import {db} from "@/lib/db";


export async function ShowAllBlogs() {
    const [result] = await db.query("SELECT * FROM blog;");
    
    if (!result) throw new Error("We couldn't found Blogs");
    
    return {
        result
    };
}

export async function ShowBlog(link) {
    const [result] = await db.query(
        "SELECT * FROM blog WHERE link = ?",
        [link]
    );
    
    if (!result) throw new Error("We couldn't fint the blog");

    return {
        link,
        result
    };
}

export async function InsertComment(name,email,comment,blogId) {
    const [result] = await db.query(
        "INSERT INTO comments (name,email,comment,blog_id) VALUES (?,?,?,?);",
        [name,email,comment,blogId]
    );

    if (!result) throw new Error("Comment cann't be posted!");
     
    return{
        message: "comment posted successfully"
    } 
}

export async function ShowComments(blogId) {
    const [result] = await db.query(
        "SELECT comment, name FROM comments WHERE blog_id = ? ORDER BY id DESC",
        [blogId]
    );

    if(!result) throw new Error("No comment found!");

    return{
        result
    }
}

export async function InserBlog(title,description,link) {
    const [result] = await db.query(
        "INSERT INTO blog (title, description, link) VALUE(?,?,?)",
        [title,description,link]
    )
}