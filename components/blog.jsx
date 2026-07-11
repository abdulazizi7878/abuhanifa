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

    useEffect(() => {
        document.title = title;

        document.querySelector('meta[name="description"]')
            ?.setAttribute("content", description);

        document.querySelector('meta[property="og:title"]')
            ?.setAttribute("content", title);

        document.querySelector('meta[property="og:description"]')
            ?.setAttribute("content", description);

        document.querySelector('meta[property="og:image"]')
            ?.setAttribute("content", image);

        document.querySelector('meta[property="og:url"]')
            ?.setAttribute("content", window.location.href);

    }, [title, description, image]);

    const isVideo = /\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|mpeg)$/i.test(image);

    return(
        <div className="w-full border-b border-b-(--border) pb-10 mb-10 flex flex-wrap gap-y-10">

            <div className={`flex duration-400 flex-col gap-y-6 ${isCommentSectionShown ? "sm:w-full md:w-1/2" : "w-full"}`}>
                
                <div className="w-full flex justify-center items-center overflow-hidden bg-foreground/20">
                     {
                        (isVideo ? (
                            <video autoPlay controls  className="h-full max-h-70" width="100%" loop >
                                <source src={image} type="video/mp4" />
                                Your browser doesn't support the video tag
                            </video>
                        ) : (
                            <img src={image} alt="NEWS_IMAGE" className="h-full max-h-70" />
                        ))
                     }
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

                    <div onClick={()=>{setCommentSectionShown(!isCommentSectionShown)}} className="duration-300 cursor-pointer hover:bg-foreground/20 px-4 py-2 rounded-4xl">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
                         <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z"/>
                    </svg>
                    </div>

                    <div onClick={()=>{shareBlog();}} className="duration-300 cursor-pointer hover:bg-foreground/20 px-4 py-2 rounded-4xl">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
                             <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"/>
                        </svg>  
                    </div>
                </div>
            </div>            

            {
                (isCommentSectionShown && <CommentSection OnClick={()=>{setCommentSectionShown(!isCommentSectionShown)}} blog_id={blog_id} /> )
            }
        </div>

    )
}