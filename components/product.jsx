"use client"

import { useState, useEffect } from "react";
import Loading from "@/components/loading";

export default function OneProduct({link}) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    async function GetProduct() {
        try{
            const response = await fetch("/api/showproduct",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link: link
                })
            })
            const resData = await response.json();
            setLoading(false);
            if (resData.success) {
                setProduct(resData?.data);
            } else {
                alert("We couldn't fetch the product now");
            }

        } catch(err){
            setLoading(false);
            console.log("error while fetching",err);
        }
    }

    useEffect(()=>{
        GetProduct();
    },[])


    return(
        <>
        {
            (loading ? (<Loading loadingItem={"product"} />) : (product?.map((pr,index)=>(
                <Product key={index} name={pr.name} price={pr.price} description={pr.description} image={pr.image} link={pr.link} />
            ))))
        }
        </>
    )
}


function Product({name,price,description,image,link}) {

    async function Share() {
        try{
            if(navigator.share){
              await navigator.share({
                    title:name,
                    text:name + "-" + description,
                    url:window.location.href
                })
            }
        } catch(err){
           await navigator.clipboard.writeText(window.location.href);
            alert("link has copied!")
        }
    }
    return(
        <div className="w-full p-4 flex flex-wrap justify-evenly border-b border-b-(--border)/50 pb-8 mb-8 gap-4 bg-foreground/2">
            <div className="w-full sm:w-11/24 flex flex-col justify-center items-center bg-foreground/6 border border-(--border)/20 rounded-4xl px-4 py-8">
                 <img src={image} alt={`${name}-image`} className="w-8/12 rounded-4xl brightness-80" />
                 <div className="w-full flex justify-around mt-10">
                    <button onClick={()=>Share()} className="cursor-pointer transition-all duration-300 p-3 rounded-2xl hover:pl-7 bg-foreground/20">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
                             <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"/>
                        </svg>  
                    </button>
                    <button>

                    </button>
                 </div>
            </div>
            <div className="w-full sm:w-11/24 border border-(--border)/20 min-h-full flex flex-col justify-start gap-2 items-start px-4 py-10 bg-foreground/6 sm:bg-transparent rounded-4xl">
                <p className="capitalize font-bold text-2xl">{name}</p>
                <p className="text-sm font-bold">Price: <span className="font-black">{price}</span> ETB</p>
                <p className="mt-4">{description}</p>
            </div>
        </div>
    )
}