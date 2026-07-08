"use client"

import Loading from "../components/loading";
import { useEffect, useState } from "react";

export default function ViewPromotions(){
    return(
        <div className="w-50/51 flex flex-col gap-4">
            <h1 className="text-xl">All promotions</h1>
            <hr />
            <div className="w-full flex flex-col">
                <Promotions />
            </div>
        </div>
    )
}


function Promotions() {

    const [promotions, setPromotions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function GetPromotions() {
        try {
            const response = await fetch("/api/showallpromotions",{
                method:"POST"
            }
            );
            const responseData = await response.json();

            setPromotions(responseData?.promotions);
            setIsLoading(false);
        } catch(err){
            console.log(err);
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        GetPromotions()
    },[]);

    return(
        <div className="flex flex-col gap-4 ">
            {
                (isLoading ? (<Loading loadingItem={"promotions"} />) : (
                    promotions?.map((pr, index)=>(
                        <Promotion key={index} name={pr.name} email={pr.email} title={pr.title} description={pr.description} image={pr.image} link={pr.link} owner_link={pr.owner_link} phone_number={pr.phone_number} />
                    ))
                ))
            }
        </div>
    )
}


function Promotion({name,email,phone_number,title,description,image,link,owner_link}){
    return(
        <div className="pb-6 w-full sm:w-82 md:w-82 lg:w-82 overflow-hidden border border-(--border) rounded-2xl flex flex-col justify-center items-center gap-y-4 relative">
                
                <div className="w-full h-[35%] flex justify-center items-center overflow-hidden bg-foreground/20">
                    <img src={image} alt="PROMOTION_IMAGE" className="h-full max-h-50" />
                </div>

                <div className="gap-y-2 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold w-11/12">
                        {title}
                    </h2>
                    <p className="line-clamp-4 w-40/41 px-2">
                        {description}
                    </p>
                    <div className="w-full flex flex-col gap-y-4 justify-center items-start mt-4">
                        <a href={owner_link} className="px-4 py-2 duration-300 hover:px-6 bg-(--primary)/20 rounded-2xl text-sm shadow">Contact me on Telegram</a>
                        <a href={`tel:${phone_number}`} className="px-4 py-2 duration-300 hover:px-6 bg-(--primary)/20 rounded-2xl text-sm shadow">Phone :- {phone_number}</a>
                        <a href={`mailto:${email}`} className="px-4 py-2 duration-300 hover:px-6 bg-(--primary)/20 rounded-2xl text-sm shadow">Email :- {email}</a>                        
                    </div>

                </div>
                <a href={`/promotion/${link}`} className="absolute inset-0"></a>
            </div>
    )
}

