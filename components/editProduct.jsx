"use client"

import { useEffect, useState } from "react";
import Updating from "./updating";

export default function EditProducts({link}){
    return(
        <>
            <Product link={link} />
        </>
    )
}

function Product({link}){

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    async function GetProduct() {
        try{
            const response = await fetch("/api/showproduct",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link: link,
                    amount: 1
                })
            })
            const resData = await response.json();
            
            setLoading(false);
            if (resData.success) {
                setProduct(resData?.data?.result);
            } else {
                alert("We couldn't get the product");
            }

        } catch(err){
            setLoading(false);
            alert("error while fetching");
        }
    }

    useEffect(()=>{
        GetProduct();
    },[])


    async function UpdateProduct() {
        setUpdating(true);

        try{
            const response = await fetch("/api/updateproduct",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({
                    link:link,
                    name:document.getElementById("name").value,
                    price:document.getElementById("price").value,
                    description:document.getElementById("description").value
                })
            })

            const data = await response.json();
            if(data.success){
                window.location.href = "/ahiadmin/view/products"
                setUpdating(false);
            }
        } catch(err){
            alert("we couldn't update the product");      
            setUpdating(false);      
        }
    }

    return(
        <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-start gap-4 w-24/26">
                <input type="text" id="name" defaultValue={product?.[0].name} contentEditable title="Product Name" placeholder="Product Name" required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                <input type="number" id="price" defaultValue={product?.[0].price} title="Product Price" placeholder="Product Price in birr..." required className="px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" />
                <textarea  id="description" defaultValue={product?.[0].description} title="Description" placeholder="Product Description" className="w-11/12 min-h-80 px-6 py-2 border border-(--border) rounded-4xl outline-(--primary) shadow-lg" ></textarea>                
                {
                    (updating && <Updating Updating_item={"blog"} />)
                }
                <button onClick={()=>{UpdateProduct()}} className="bg-foreground/90 text-background px-6 transition-all duration-300 hover:pl-8 cursor-pointer py-1 rounded-4xl">Update</button>
            </div>

            <div className="flex justify-center items-center mt-15">
                <a href="/ahiadmin/create/product" className="text-sm text-blue-600">Create a new Product</a>
            </div>
        </div>
    )
}