"use client"

import { useEffect, useState } from "react";
import Loading from "./loading";
import Updating from "./updating";

export default function EditBlogs({link}){
    return(
        <>
            <Blog link={link} />
        </>
    )
}

function Blog({link}){

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    async function GetBlog() {
        try{
            const response = await fetch("/api/showblog",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link: link,
                })
            })
            const resData = await response.json();
            
            setLoading(false);
            if (resData.success) {
                setBlog(resData?.data?.blog?.result);
            } else {
                alert("We couldn't get the Blog");
            }

        } catch(err){
            setLoading(false);
            console.log("error while fetching");
        }
    }

    useEffect(()=>{
        GetBlog();
    },[])


    async function UpdateBlog() {
        setUpdating(true);
        try{
            const response = await fetch("/api/updateblog",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link:link,
                    title:document.getElementById("title").value,
                    description:document.getElementById("description").value
                })
            })

            const data = await response.json();
            if(data.success){
                window.location.href = "/ahiadmin/view/blogs"
                setUpdating(false);
            }
        } catch(err){
            alert("we couldn't update the Blog");            
        }

        setUpdating(false)
    }

    return(
        <>   
            <div className="w-full flex flex-col justify-center items-center">             
                <div className="flex flex-col justify-center items-start gap-4 w-24/26">
                    <input type="text" id="title" defaultValue={blog?.[0].title} contentEditable title="Blog Title" placeholder="Blog Title" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <textarea  id="description" defaultValue={blog?.[0].description} title="Description" placeholder="Blog Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>                
                    {
                        (updating && <Updating Updating_item={"blog"} />)
                    }                    
                    <button onClick={()=>{UpdateBlog()}} className="bg-foreground/90 text-background px-6 transition-all duration-300 hover:pl-8 cursor-pointer py-1 rounded-4xl">Update</button>

                </div>

                <div className="flex justify-center items-center mt-15">
                    <a href="/ahiadmin/create/blog" className="text-sm text-blue-600">Create a new Blog</a>
                </div>
            </div>        
        </>

    )
}