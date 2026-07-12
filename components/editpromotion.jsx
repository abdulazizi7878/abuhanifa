"use client"

import { useEffect, useState } from "react";
import Loading from "./loading";
import Updating from "./updating";

export default function EditPromotions({link}){
    return(
        <>
            <Promotion link={link} />
        </>
    )
}

function Promotion({link}){

    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    async function GetPromotion() {
        try{
            const response = await fetch("/api/showpromotion",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link: link,
                })
            })
            const resData = await response.json();            
            setLoading(false);
            
            if (resData.success) {
                setPromotion(resData?.data);
            } else {
                alert("We couldn't get the Promotion");
            }

        } catch(err){
            setLoading(false);
            alert("We couldn't get the promotion")
            console.log("error while fetching");
        }
    }


    useEffect(()=>{
        GetPromotion();
    },[])


    async function UpdatePromotion() {
        setUpdating(true);
        try{
            const response = await fetch("/api/updatepromotion",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    name:document.getElementById("name").value,
                    email:document.getElementById("email").value,
                    phone_number:document.getElementById("phoneNumber").value,
                    title:document.getElementById("title").value,
                    description:document.getElementById("description").value,
                    owner_link:document.getElementById("ownerLink").value,
                    link:link,
                })
            })

            const data = await response.json();
            if(data.success){
                window.location.href = "/ahiadmin/view/promotions"
                setUpdating(false);
            }
        } catch(err){
            alert("we couldn't update the Promotion");            
        }

        setUpdating(false)
    }

    return(
        <>   
            <div className="w-full flex flex-col justify-center items-center">             
                <div className="flex flex-col justify-center items-start gap-4 w-24/26">
                    <input type="text" id="name" defaultValue={promotion?.[0].name} contentEditable title="Promotion Name" placeholder="Promotion Name" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="email" id="email" defaultValue={promotion?.[0].email} contentEditable title="Promotion Email" placeholder="Promotion Email" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="number" id="phoneNumber" defaultValue={promotion?.[0].phone_number} contentEditable title="Promotion Phone Number" placeholder="Promotion Title" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="text" id="title" defaultValue={promotion?.[0].title} contentEditable title="Promotion Title" placeholder="Promotion Title" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <textarea  id="description" defaultValue={promotion?.[0].description} title="Description" placeholder="Promotion Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>                
                    <input type="text" id="ownerLink" defaultValue={promotion?.[0].owner_link} contentEditable title="Promotion Owner Link" placeholder="Promotion owner link" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    
                    {
                        (updating && <Updating Updating_item={"Promotion"} />)
                    }                    
                    <button onClick={()=>{UpdatePromotion()}} className="bg-foreground/90 text-background px-6 transition-all duration-300 hover:pl-8 cursor-pointer py-1 rounded-4xl">Update</button>

                </div>

                <div className="flex justify-center items-center mt-15">
                    <a href="/ahiadmin/create/promotion" className="text-sm text-blue-600">Create a new Promotion</a>
                </div>
            </div>        
        </>

    )
}