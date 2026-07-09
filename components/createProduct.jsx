"use client"

import { useEffect, useState } from "react";

import Uploading from "./uploading";
export default function CreateProduct() {

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    function imageSelect(){
        let imageFile = document.getElementById("image");
        imageFile.click();
    }

    async function PostProduct() {
        setUploading(true);
        const formData = new FormData();
        formData.append("image",file);

        try{

            const response = await fetch("/api/upload",{
                method:"POST",
                body:formData
            });

            const data = await response.json();            

            if (data.success === true) {
                let name = document.querySelector("#name").value;
                let price = document.querySelector("#price").value;
                let description = document.querySelector("#description").value;
                let image = data.url;

                try {
                    const responsePost = await fetch("/api/postproduct",{
                            headers:{
                                "Content-Type":"application/json"
                            },
                            method:"POST",
                            credentials:"include",
                            body:JSON.stringify({
                                name: name,
                                price:price,
                                description: description,
                                image:image
                            })
                    })

                    setUploading(false);
                    alert("Product successfuly posted");
                    location.reload();

                } catch(err){
                    setUploading(false);
                    alert("We couldn't post the Product")
                }
            }            
        } catch(err){
            setUploading(false);
            alert("we couldn't post the product")
        }

        setUploading(false);

    }



    return(
        <div className="w-29/30 h-full md:w-11/12 lg:w-11/12">
            <div>
                <div className="flex flex-col justify-center items-start gap-6">
                    <input type="text" id="name" title="Product Name" placeholder="Product Name" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <input type="number" id="price" title="Product Price" placeholder="Product Price in birr..." required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                    <textarea  id="description" title="Description" placeholder="Product Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>
                    <input type="file" hidden  onChange={(e)=>setFile(e.target.files[0])} id="image" />
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <button onClick={()=>{imageSelect()}} className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                            Upload an Image
                        </button>                        
                        <span className="text-sm">
                            Slected Image Name: <i>{(file ? (file.name) : ("Not Selected"))} </i> 
                            <br /> 
                            Slected Image Size: <i>{(file ? (`${file.size/1000000} mb`) : ("Not Measured"))} </i> 
                        </span>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        {uploading && <Uploading uploadingItem="product" />}
                    </div>
                    <div>
                        <button onClick={()=>{PostProduct()}} title="Post the blog" className="px-4 py-2 hover:px-5 shadow-lg outline-(--primary) rounded-4xl bg-(--primary) duration-300 hover:bg-(--primary)/80 text-background cursor-pointer">
                            POST
                        </button>                
                    </div>

                </div>

            </div>           
        </div>
    )
}