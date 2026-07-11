"use client"

import Loading from "../components/loading";
import { useEffect, useState } from "react";
import ImageViewer from "./imgviewer";

export default function ViewOrders(){
    return(
        <div className="w-50/51 flex flex-col gap-4">

            <div className="w-full flex flex-col">
                <h1 className="text-xl">Job Orders</h1>
                <hr />
                <JobOrders />

                <h1 className="text-xl">Product Orders</h1>
                <hr />
                <ProductOrders />
            </div>
        </div>
    )
}


function JobOrders() {

    const [orders, setOrders] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function GetOrders() {
        try {
            const response = await fetch("/api/showallorders",{
                method:"POST"
            });
            const responseData = await response.json();

            setOrders(responseData?.orders);
            setIsLoading(false);            
        } catch(err){
            console.log(err);
            setIsLoading(false); 
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


function ProductOrders() {

    const [ordered, setOrdered] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getProOrders() {

        try{
        const response = await fetch("/api/showproductorders",{
            headers:{
                "Content-Type":"application/josn"
            },
            method:"POST",
        })
        const data = await response.json();         
        setOrdered(data?.data) 
        setLoading(false);
        } catch(err){
            alert("Error while fetching")
            setLoading(false)
        }

        
    }

    useEffect(()=>{
        getProOrders();
    },[])

    return(
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            {
                (loading ? (<Loading loadingItem={"ordered products"} />) :(ordered?.map((or,index)=>(
                    <ProOrder 
                        key={index} 
                        username={or.username} 
                        phone_number={or.phone_number} 
                        location={or.location}
                        account_number={or.account_number}  
                        image={or.image}
                        product_name={or.product_name} 
                        product_price={or.price} 
                        product_image={or.product_image}
                        ordered_amount={or.amount}
                        total_price={Number(or.price) * Number(or.amount)}
                        date={or.created_at}
                    />
                ))))
            }
        </div>
    )
}

function ProOrder({username,phone_number,location,account_number,image,product_name,product_price,product_image,ordered_amount,total_price,date}){
 
    const [rImageVisible,setRImageVisible] = useState(false);
    const [pImageVisible,setPImageVisible] = useState(false);


    return(
        <div className="border border-(--border)/60 rounded-4xl flex flex-col gap-6 p-6">
            {            
                (rImageVisible && (<ImageViewer imageSrc={image} OnClick={()=>{setRImageVisible(false)}} />))
            }
            {
                (pImageVisible && (<ImageViewer imageSrc={product_image} OnClick={()=>{setPImageVisible(false)}} />))
            }
            <div className="flex flex-col gap-2">
                <p>Name:  <span className="font-black">{username} </span> </p>
                <p>Phone Number: <span className="font-black">{phone_number}</span> </p>
                <p>Location: <span className="font-black">{location}</span> </p>
                <p>Account Number: <span className="font-black">{account_number}</span> </p>
                <p>Product Name:  <span className="font-black">{product_name}</span></p>
                <p>Product Price: <span className="font-black">{product_price}</span> </p>
                <p>Ordered Amount: <span className="font-black">{ordered_amount}</span>  </p>
                <p>Total: <span className="font-black">{total_price}</span></p>
                <p>Date: <span className="font-black text-sm">{date}</span></p>
            </div>

            <div className="flex flex-wrap justify-start items-start gap-3">
                <p>Recept Image:</p>
                <button onClick={()=>{setRImageVisible(true)}} className="bg-foreground/30 px-2 py-1 rounded-4xl text-sm">View image</button> 
            </div>

            <div className="flex flex-wrap justify-start items-start gap-3">
                <p>Product Image:</p>
                <button onClick={()=>{setPImageVisible(true)}} className="bg-foreground/30 px-2 py-1 rounded-4xl text-sm">View image</button> 
            </div>
        </div>
    )
}