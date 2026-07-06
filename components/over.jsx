"use client"

import { useEffect, useState } from "react";
import Loading from "./loading";

export default function CommentSection({blog_id, OnClick}){

    const [comments, setComments] = useState(null);
    const [isLoading, setLoading] = useState(true)

    async function EnterComments() {

        
        let userName = document.querySelector("#commentorName")
        let userEmail = document.querySelector("#commentorEmail");
        let userComment = document.querySelector("#comment");
        
        try {
                        
            const response = await fetch("/api/postcomment",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"post",
                body: JSON.stringify({
                    name: userName.value,
                    email: userEmail.value,
                    comment: userComment.value,
                    blogId: blog_id
                })
            })

            
            if (response.ok) {
                alert("Comment Posted successfully");
                OnClick();
            } else {
                alert("We couldn't post your comment!");
            }
                
        } catch (err){
            alert("We couldn't post your comment!");
        }
    }

    async function GetComments() {
        const response = await fetch("/api/showcomments",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST",
            body: JSON.stringify({
                blog_id:blog_id
            })
        })

        const comments = await response.json();
        setComments(comments?.data?.comments?.result);
        setLoading(false);
    }



    useEffect(()=>{
        GetComments();
    },[]);

    return(
        <div className="w-full sm:w-full min-h-[90vh] md:w-1/2 flex justify-center items-center">

            <div className="border z-1 border-(--border)  overflow-hidden rounded-4xl  p-6 w-[90%] h-full relative flex flex-col justify-start items-center">
                

                <div className="flex flex-col gap-2 w-full h-full z-10  pt-6 overflow-y-scroll pb-40">
                    {
                        (isLoading ? (<Loading loadingItem={"comments"} />) : ( comments && comments?.map((cm,index)=>(
                            <Comment key={index} comment={cm.comment} name={cm.name} />
                        )) ))
                    }
                </div>



                <div className="absolute  bottom-0 z-10 w-full bg-foreground  flex flex-col justify-center items-center py-2 gap-y-4">
                    <input type="text" id="commentorName" autoComplete="name" className="border border-background py-1 px-4 rounded-full outline-(--primary) text-background" placeholder="Name" title="Name" />                    
                    <input type="text" id="commentorEmail" autoComplete="email" className="border border-background py-1 px-4 rounded-full outline-(--primary) text-background" placeholder="Email" title="Email" />
                    <textarea id="comment" className="border border-background py-1 px-4 rounded outline-0 text-background" title="comment">
                    </textarea>
                    <input type="submit" className="py-1 px-4 rounded-full bg-(--primary) text-black cursor-pointer" onClick={()=>{
                        EnterComments();
                    }} />
                </div>


                <div className="absolute top-4 right-6 z-10"  onClick={OnClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </div>          
            </div>
            
        </div>
    )
}

function Comment({comment,name}){
    return(
        <div className="border border-(--border)/50 rounded-2xl mx-auto p-4 w-11/12 shrink-0">
        <div>
            <p className="font-black text-[11px]">{name}</p>
            <p>
                     {comment}
            </p>
            </div>
        </div>
    )
}