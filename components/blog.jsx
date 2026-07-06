"use client"

import { useEffect, useState } from "react";
import CommentSection from "./over";
import Loading from "./loading";

export default function Blog({link}){
    const [blog, setBlog] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetBlog() {
        try{
            const response = await fetch("/api/showblog",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body: JSON.stringify({
                    link
                })
            });
            const data = await response.json();
            setBlog(data?.data?.blog?.result);
            setLoading(false);
        } catch (err) {
            console.log("ERROR, WHILE FETCHING", err);
        }
    }
    
    
    useEffect(()=>{
        GetBlog();
    },[]);


    return(
        <div className="w-full">

            {
                (isLoading ? (<Loading loadingItem={"Blog"} />) : (blog?.map((bl,index)=>(
                    <OneBlog 
                    key={index} 
                    title={bl.title} 
                    description={bl.description} 
                    link={bl.link}
                    image={bl.image}
                    created_at={bl.created_at} 
                    blog_id={bl.id}
                    />
                )) ))
            }
            
        </div>
        
    )
}

function OneBlog({title,description,image,created_at,link, blog_id}){

    const [isCommentSectionShown, setCommentSectionShown] = useState(false);

    async function shareBlog() {

        const blogData = {
            title: title,
            text: description,
            url: window.location.href
        }

        try {
            if(navigator.share){
               await navigator.share(blogData);
            }
        } catch (err){
            await navigator.clipboard.writeText(window.location.href);
            console.log(err);
            
        }

    }

    return(
        <div className="w-full border-b border-b-(--border) pb-10 mb-10 flex flex-wrap gap-y-10">

            <div className={`flex duration-400 flex-col gap-y-6 ${isCommentSectionShown ? "sm:w-full md:w-1/2" : "w-full"}`}>
                
                <div className="w-full flex justify-center items-center overflow-hidden bg-foreground/20">
                    <img src={image} alt="NEWS_IMAGE" className="h-full max-h-70" />
                </div>

                <div className="gap-y-2 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold w-40/41">
                        {title}
                    </h2>
                    <p className="w-40/41">
                    {description}
                    <br /> <br />
                    {created_at}
                    </p>
                </div>
                <div className="flex  flex-wrap gap-10 w-11/12 mx-auto">

                    <div
                    className="cursor-pointer hover:bg-foreground/20" 
                    onClick={()=>{setCommentSectionShown(!isCommentSectionShown)}}
                    >
                    <p>Comment</p> 
                    </div>

                    <div onClick={()=>{
                        shareBlog();
                    }}>

                    <p>Share</p>  
                    </div>
                </div>
            </div>            

            {
                (isCommentSectionShown && <CommentSection OnClick={()=>{setCommentSectionShown(!isCommentSectionShown)}} blog_id={blog_id} /> )
            }
        </div>

    )
}