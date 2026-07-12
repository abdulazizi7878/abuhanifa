"use client"

import { useEffect, useState } from "react";

export default function CreatePromotion() {

    const [file, setFile] = useState(null);
    const [uploading,setUploading] = useState(false);

    function imageSelect(){
        let imageFile = document.getElementById("image");
        imageFile.click();
    }

    function GimmeId(id){
        return document.getElementById(id).value;
    }


    async function PostPromotion() {

        setUploading(true);

        try{
            const formData = new FormData();
            formData.append("file",file);
            const response = await fetch("/api/upload",{
                  method:"POST",
                  body:formData,
                });
            const data = await response.json();

            if (!data.success) throw new Error("Uploading file got an error");

            const fileUrl = data?.url;

            try{
                const response2 = await fetch("/api/postpromotion",{
                    headers:{
                        "Content-Type":"application/json"
                    },
                    method:"POST",
                    credentials:"include",
                    body:JSON.stringify({
                        name: GimmeId("name"),
                        email:GimmeId("email"),
                        phone_number:GimmeId("phoneNumber"),
                        title: GimmeId("title"),
                        description: GimmeId("description"),
                        image: fileUrl,
                        owner_link: GimmeId("link")
                    })
                })
                const responseData = await response2.json();
                setUploading(false);
                if (responseData.success) {
                   alert("Promotion posted successfully!");
                } else {
                    alert("We couldn't post the promotion!")
                }
                
            } catch(err){
                alert("We couldn't post the promotion!")
                setUploading(false);
            }

        } catch(err){
            alert("We couldn't post the promotion!");
            setUploading(false);
        }
    }



    return(
        <div className="w-50/53 h-full md:w-11/12 lg:w-11/12">
            <div>
                <div className="flex flex-col justify-center items-start gap-6">
                    <input type="text" id="name" title="Name" placeholder="Name"   className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="email" id="email" title="Email" placeholder="Email"   className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="number" id="phoneNumber" title="Phone Number" placeholder="Phone Number"  className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="text" id="title" title="Title of the Promotion" placeholder="Title"  className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <textarea  id="description" title="Description" placeholder="Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>
                    <input type="text" id="link" title="Owner link" placeholder="Owner Link... Telegram"   className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="file"   onChange={(e)=>setFile(e.target.files[0])} id="image" />
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <button onClick={()=>{imageSelect()}} className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                            Select a file
                        </button>                        
                        <span>
                            Slected Image Name: <i>{(file ? (file.name) : ("Not Selected"))} </i> 
                            <br /> 
                            Slected Image Size: <i>{(file ? (`${file.size/1000000} mb`) : ("Not Measured"))} </i> 
                        </span>
                    </div>
                    <div>
                        <button onClick={()=>{PostPromotion()}} title="Post the Promotion" className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                          POST
                        </button>                
                    </div>
                </div>
            </div>           
        </div>
    )
}