"use client"

import Loading from "./loading";
import { useEffect, useState } from "react";

export default function Blogs(){
    const [blogs, setBlogs] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetBlogs() {
        try{
            const response = await fetch("/api/showblogs",{
                method:"POST"
            });
            const data = await response.json();
            setBlogs(data?.data?.blogs?.result);
            setLoading(false);                        
        } catch (err) {
            console.log("ERROR, WHILE FETCHING", err);
        }
    }
    
    
    useEffect(()=>{
        GetBlogs();
    },[]);

    return(
        <div className="flex flex-wrap justify-center items-center gap-10 w-24/25 ">

            {
                (isLoading ? (<Loading loadingItem={"Blogs"} />) : (blogs && (blogs?.map((bl,index)=>(
                    <Blog 
                    key={index} 
                    title={bl.title} 
                    description={bl.description} 
                    link={bl.link}
                    image={bl.image}
                    created_at={bl.created_at} 
                    />
                )) )))
            }
            
        </div>
        
    )
}

function Blog({title,description,image,created_at,link}){
    return(
        <div className="pb-6 w-full sm:w-82 md:w-82 lg:w-82 overflow-hidden border border-(--border) rounded-2xl flex flex-col justify-center items-center gap-y-4 relative">
            
            <div className="w-full h-[35%] flex justify-center items-center overflow-hidden bg-foreground/20">
                <img src={image} alt="NEWS_IMAGE" className="h-full max-h-50" />
            </div>

            <div className="gap-y-2 flex flex-col justify-center items-center">
                <h2 className="text-xl font-bold w-11/12">
                    {title}
                </h2>
                <p className="line-clamp-4 w-40/41 px-2">
                   {description}
                </p>
            </div>
            <a href={`/blog/${link}`} className="absolute inset-0"></a>
        </div>
    )
}