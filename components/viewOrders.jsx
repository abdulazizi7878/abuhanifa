"use client"

import Loading from "../components/loading";
import { useEffect, useState } from "react";

export default function ViewComments(){
    return(
        <div className="w-50/51 flex flex-col gap-4">
            <h1 className="text-xl">Orders</h1>
            <hr />
            <div className="w-full flex flex-col">
                <Comments />
            </div>
        </div>
    )
}


function Comments() {

    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function GetOrders() {
        try {
            const response = await fetch("/api/showallorders");
            const responseData = await response.json();

            setOrders(responseData?.orders);
            setIsLoading(false);            
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        GetOrders()
    },[]);

    return(
        <div className="flex flex-col gap-4 ">
            {
                (isLoading ? (<Loading loadingItem={"Orders"} />) : (
                    orders?.map((or, index)=>(
                        <Order key={index} name={or.name} phone={or.phone_number} location={or.location} job={or.job} job_type={or.job_type} comment={or.comment} />
                    ))
                ))
            }
        </div>
    )
}


function Order({name,phone,location,job,job_type,comment}){
    return(
        <div className="border border-(--border)/50 rounded-2xl mx-auto p-4 w-full">
        <div>
            <p className="font-black text-[11px]">{name} <br /> {phone} <br /> {location} </p>
            <p>{job} <br /> {job_type}</p>
            <p className="mt-2 px-6 py-3 rounded-2xl border border-(--border)">{ (comment ? comment : (<span className="text-foreground/30">skipped by the user</span>))}</p>    
        </div>
        </div>
    )
}
