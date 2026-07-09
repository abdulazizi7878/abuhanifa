"use client"

import Link from "next/link";

export default function ProductsPage(){
    return(
        <>
           <Products />
        </>
    )
}



import Loading from "./loading";
import { useEffect, useState } from "react";

function Products(){
    const [products, setProducts] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetProducts() {
        try{
            const response = await fetch("/api/showproducts",{
                method:"POST"
            });
            const data = await response.json();
            console.log(data);
            
            setProducts(data?.data);
            setLoading(false);                        
        } catch (err) {
            console.log("ERROR, WHILE FETCHING");
            setLoading(false);
        }
    }
    
    
    useEffect(()=>{
        GetProducts();
    },[]);

    return(
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-24/25">

            {
                (isLoading ? (<Loading loadingItem={"Products"} />) : (products && (products?.map((pr,index)=>(
                    <Product 
                      key={index}
                      name={pr.name}
                      price={pr.price}
                      description={pr.description}
                      image={pr.image}
                      link={pr.link}
                    />
                )) )))
            }
            
        </div>
        
    )
}

function Product({name,price,description,image,link}){

    async function Share() {
        try{
            if(navigator.share){
                await navigator.share({
                    title:name,
                    text:description,
                    url:window.location.origin + `/products/${link}`
                });
            }
        } catch (err) {
            console.error("Error sharing:", err);
            await navigator.clipboard.writeText(window.location.origin + `/products/${link}`);
        }
    }

    return(
        <Link href={`/products/${link}`} className="group duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden border border-(--border)/50 rounded-4xl flex flex-col relative">
            
            <div className="w-full h-[55%] flex justify-center items-center overflow-hidden bg-foreground/20">
                <img src={image} alt="PRODUCTS_IMAGE" className="h-full w-auto transition-transform duration-300 group-hover:scale-110 " />
            </div>

            <div className="mt-2 flex flex-col mx-2">
                <p className="text-sm font-bold capitalize">
                    {name}
                </p>
                <p className="line-clamp-1 text-sm">
                   {description} 
                </p>
                <p className="text-sm font-bold mt-2" title={`${price} Ethiopian Birr`}>
                    {price} ETB
                </p>
            </div>
            <div className="absolute bottom-4 right-4">
                <button onClick={(e)=>{e.preventDefault(); e.stopPropagation(); Share()}} className="p-2 rounded-full bg-foreground/10 transition-transform cursor-pointer duration-300 hover:bg-foreground/20 ">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={`var(--foreground)`}>
                         <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm508.5-291.5Q720-743 720-760t-11.5-28.5Q697-800 680-800t-28.5 11.5Q640-777 640-760t11.5 28.5Q663-720 680-720t28.5-11.5ZM680-200ZM200-480Zm480-280Z"/>
                    </svg>
                </button>
            </div>
        </Link>
    )
}
