"use client"

import Loading from "../components/loading";
import { useEffect, useState } from "react";

export default function ViewComments(){
    return(
        <div className="w-50/51 flex flex-col gap-4">
            <h1 className="text-xl">Comments From Blog Post</h1>
            <hr />
            <div className="w-full flex flex-col">
                <Comments />
            </div>
            
            <h1 className="text-xl">Message From contact Page</h1>
            <hr />
            <div>
                <Messages />
            </div>
        </div>
    )
}


function Comments() {

    const [comments, setComments] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function GetComments() {
        try {
            const response = await fetch("/api/showallcomments",{
                method:"POST"
            }
            );
            const responseData = await response.json();

            setComments(responseData?.comments);
            setIsLoading(false);
        } catch(err){
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        GetComments()
    },[]);

    return(
        <div className="flex flex-col gap-4 ">
            {
                (isLoading ? (<Loading loadingItem={"comments"} />) : (
                    comments?.map((cm, index)=>(
                        <Comment key={index} name={cm.name} email={cm.email} comment={cm.comment} />
                    ))
                ))
            }
        </div>
    )
}


function Comment({name,email,comment}){
    return(
        <div className="border border-(--border)/50 rounded-2xl mx-auto p-4 w-full">
        <div>
            <p className="font-black text-[11px]">{name} <br /> {email} </p>
            <p>{comment}</p>    
        </div>
        </div>
    )
}

function Messages() {

    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function GetMessages() {
        try {
            const response = await fetch("/api/showallmessages",{
                method:"POST"
            }
            );
            const responseData = await response.json();

            setMessages(responseData?.messages);
            setIsLoading(false);
        } catch(err){
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        GetMessages()
    },[]);

    return(
        <div className="flex flex-col gap-4 ">
            {
                (isLoading ? (<Loading loadingItem={"messages"} />) : (
                    messages?.map((ms, index)=>(
                        <Message key={index} name={ms.name} email={ms.email} message={ms.message} />
                    ))
                ))
            }
        </div>
    )
}


function Message({name,email,message}){
    return(
        <div className="border border-(--border)/50 rounded-2xl mx-auto p-4 w-full">
        <div>
            <p className="font-black text-[11px]">{name} <br /> {email} </p>
            <p>{message}</p>    
        </div>
        </div>
    )
}
