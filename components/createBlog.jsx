"use client"

import { useEffect, useState } from "react";

export default function CreateBlog() {

    const [file, setFile] = useState(null);

    function imageSelect(){
        let imageFile = document.getElementById("image");
        imageFile.click();
    }

    async function PostBlog() {
        const formData = new FormData();
        formData.append("image",file);

        try{

            const response = await fetch("/api/upload",{
                method:"POST",
                body:formData
            });

            const data = await response.json();

            if (data.success === true) {
                let title = document.querySelector("#title").value;
                let description = document.querySelector("#description").value;
                let image = data.fileName;

                try {
                    const responsePost = await fetch("/api/postblog",{
                            headers:{
                                "Content-Type":"application/json"
                            },
                            method:"POST",
                            credentials:"include",
                            body:JSON.stringify({
                                title: title,
                                description: description,
                                image:image
                            })
                    })

                    alert("Blog successfuly posted");
                    location.reload();

                } catch(err){
                    alert("We couldn't post the blog")
                }
            }            
        } catch(err){
            alert("we couldn't post the blog")
        }


        

    }



    return(
        <div className="w-29/30 h-full md:w-11/12 lg:w-11/12">
            <div>
                <div className="flex flex-col justify-center items-start gap-6">
                    <input type="text" id="title" title="Title of the blog" placeholder="Title" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <textarea  id="description" title="Description" placeholder="Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>
                    <input type="file" hidden  onChange={(e)=>setFile(e.target.files[0])} id="image" />
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <button onClick={()=>{imageSelect()}} className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                            Select an Image
                        </button>                        
                        <span>
                            Slected Image Name: <i>{(file ? (file.name) : ("Not Selected"))} </i> 
                            <br /> 
                            Slected Image Size: <i>{(file ? (`${file.size/1000000} mb`) : ("Not Measured"))} </i> 
                        </span>
                    </div>
                    <div>
                        <button onClick={()=>{PostBlog()}} title="Post the blog" className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                            POST
                        </button>                
                    </div>

                </div>

            </div>           
        </div>
    )
}