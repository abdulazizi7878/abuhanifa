"use client"

import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useTranslations } from "next-intl";

export default function CommentSection({blog_id, OnClick}){
    
    const t = useTranslations("comment");
    const [comments, setComments] = useState(null);
    const [isLoading, setLoading] = useState(true);

    function validate(id,message){
        let value = document.getElementById(id).value;
        if (!value) {
            toast.error(message);
            document.getElementById(id)?.focus();
            return null;
        }
        return value;
    }

    async function EnterComments() {

        
        let userName = validate("commentorName",t("Please enter your name"));
        if (!userName) return
        let userEmail = validate("commentorEmail",t("Please enter your email, Your email will never become visible to public"));
        if(!userEmail) return;
        let userComment = validate("comment",t("Please write some text!"));
        if (!userComment) return;

        const posting = toast.loading(t("Posting your comment!"));
        
        try {
                        
            const response = await fetch("/api/postcomment",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"post",
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    comment: userComment,
                    blogId: blog_id
                })
            })

            
            if (response.ok) {
                toast.success(t("Your comment successfully posted!"),{id:posting})
                OnClick();
            } else {
                toast.error(t("Your comment couldn't be posted!"),{id:posting})
            }
                
        } catch (err){
            toast.error(t("Your comment couldn't be posted!"),{id:posting})
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
                    <input type="text" id="commentorName" autoComplete="name" className="border border-background py-1 px-4 rounded-full outline-(--primary) text-background" placeholder={t("Name")} title={t("Name")}/>                    
                    <input type="text" id="commentorEmail" autoComplete="email" className="border border-background py-1 px-4 rounded-full outline-(--primary) text-background" placeholder={t("Email")} title={t("Email")} />
                    <textarea id="comment" placeholder={t("Comment")} className="border border-background py-1 px-4 rounded outline-0 text-background" title={t("Comment")}>
                    </textarea>
                    <input type="submit" value={t("Submit")} className="py-1 px-4 rounded-full bg-(--primary) text-black cursor-pointer" onClick={()=>{
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