"use client"


import { useState, useEffect } from "react";
import Loading from "./loading";

export default function Promotions(){

    const [promotions, setPromotions] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetPromotions() {
        try{
            const response = await fetch("/api/showpromotions",{
                method:"POST"
            });
            const data = await response.json();
            setPromotions(data?.promotions);            
            setLoading(false);                        
        } catch (err) {
            alert("ERROR, WHILE FETCHING");
        }
    }
    
    
    useEffect(()=>{
        GetPromotions();
    },[]);

    return(
        <div className="w-full">

            {
                (isLoading ? (<Loading loadingItem={"promotions"} />) : ( promotions?.map((pr,index)=>(
                    <Promotion key={index} title={pr.title} description={pr.description} image={pr.image} name={pr.name} email={pr.email} phone_number={pr.phone_number} telegram={pr.owner_link} link={pr.link}  />
                )) ))
            }
        </div>
    )
}




function Promotion({title,description,image,name,email,phone_number,telegram,link}){

    const isVideo = /\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|mpeg)$/i.test(image);

    return(
        <div className="w-full overflow-hidden flex flex-col justify-center items-center gap-y-2 relative">
            
            <div className="w-full h-[35%] flex justify-center items-center overflow-hidden bg-foreground/20">
                {
                    isVideo ? (
                        <video controls  src={image} className="h-full max-h-50" width="100%" />
                    ) : (
                        <img src={image} alt="NEWS_IMAGE" className="h-full max-h-50" loading="lazy" />
                    )
                }
            </div>

            <div className="gap-y-2 flex flex-col justify-center items-start w-59/60">
                <h2 className="text-xl font-bold w-11/12">
                    {title}
                </h2>
                <p>
                   {description}
                </p>
                <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
                    <p className="font-bold">Contact us: </p>
                    <div className="relative bg-foreground px-3 py-1 rounded-4xl transition-all duration-300 hover:pl-4 hover:bg-foreground/90 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                             <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
                        </svg>
                        <a href={`tel:${phone_number}`}className="absolute inset-0"></a>
                    </div>

                    <div className="relative bg-foreground px-3 py-1 rounded-4xl transition-all duration-300 hover:pl-4 hover:bg-foreground/90 cursor-pointer">
                        <img src="/telegram.svg" alt="TELEGRAM" />
                        <a href={telegram}className="absolute inset-0"></a>
                    </div>

                    <div className="relative bg-foreground px-3 py-1 rounded-4xl transition-all duration-300 hover:pl-4 hover:bg-foreground/90 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                             <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v58q0 26 17 44t43 18q26 0 43-18t17-44v-58q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h200v80H480Zm85-315q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"/>
                        </svg>
                        <a href={`maileto:${email}`}className="absolute inset-0"></a>
                    </div>
                </div>
            </div>
            <hr className="w-full mt-4  border border-(--border)" />
        </div>
    )
}
