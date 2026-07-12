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
            const response = await fetch("/api/showpromotions",{
                method:"POST"
            }
            );
            const responseData = await response.json();

            setPromotions(responseData?.promotions);
            setIsLoading(false);
        } catch(err){
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


function Promotion({title,description,link}){
    return(
        <div className="border border-(--border) px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-wrap justify-between items-center gap-6">
           
            <div className="w-auto flex flex-row justify-between items-center gap-6">
                <span className="text-foreground/80 text-sm bg-foreground/10 px-2">{title}</span>
                <span className="text-foreground/80 text-sm line-clamp-2 bg-foreground/10 px-2">{description}</span>
            </div>

            <div className="flex flex-row justify-evenly items-center gap-4">
                <a href={`/ahiadmin/edit/promotions/${link}`} className="text-blue-500 px-2 text-sm rounded-4xl bg-blue-500/20 cursor-pointer transition-all duration-300 hover:pr-4">Edit</a>
                <a className="text-red-400 px-2 text-sm rounded-4xl bg-red-400/20 cursor-pointer transition-all duration-300 hover:pl-4">Delete</a>
            </div>
        </div>
    )
}