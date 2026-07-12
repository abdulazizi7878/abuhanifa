"use client"

import { useEffect, useState } from "react";

export default function ViewBlogs(){
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <h1 className="text-xl">All Blogs</h1>
            <hr className="w-full my-4" />
            <Blogs />
        </div>
    )
}

function Blogs() {

    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(true);


    async function GetBlogs() {
        
        try{
         const response = await fetch("/api/showblogs",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST",
        })
        const data = await response.json();        
        setBlogs(data?.data?.blogs?.result);
        setLoading(false);
           
        } catch(err){
            alert("Error while loading the Blogs");
            setLoading(false);
        }

    }

    useEffect(()=>{
        GetBlogs();
    },[]);


    return(
        <div className="w-11/12 flex flex-col gap-4">
            {
                (blogs && blogs?.map((bl, index)=>(
                    <Blog key={index} title={bl.title} description={bl.description} link={bl.link} />
                )))
            }
        </div>
    )
}

function Blog({title,description,link}){
    return(
        <div className="border border-(--border) px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-wrap justify-between items-center gap-6">
           
            <div className="w-auto flex flex-row justify-between items-center gap-6">
                <span className="text-foreground/80 text-sm bg-foreground/10 px-2">{title}</span>
                <span className="text-foreground/80 text-sm line-clamp-2 bg-foreground/10 px-2">{description}</span>
            </div>

            <div className="flex flex-row justify-evenly items-center gap-4">
                <a href={`/ahiadmin/edit/blogs/${link}`} className="text-blue-500 px-2 text-sm rounded-4xl bg-blue-500/20 cursor-pointer transition-all duration-300 hover:pr-4">Edit</a>
                <a className="text-red-400 px-2 text-sm rounded-4xl bg-red-400/20 cursor-pointer transition-all duration-300 hover:pl-4">Delete</a>
            </div>
        </div>
    )
}