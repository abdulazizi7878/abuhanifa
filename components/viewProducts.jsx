"use client"


import { useEffect, useState } from "react";

export default function ViewProducts(){
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <p className="font-bold w-11/12">
                Edit and Delete Products
            </p>
            <hr className="w-full my-4" />
            <Products />
        </div>
    )
}

function Products() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);


    async function GetProducts() {
        
        try{
         const response = await fetch("/api/showproducts",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST",
        })
        const data = await response.json();
        setProducts(data?.data);
        setLoading(false);
           
        } catch(err){
            alert("Error while loading the products");
            setLoading(false);
        }

    }

    useEffect(()=>{
        GetProducts();
    },[]);


    return(
        <div className="w-11/12 flex flex-col gap-4">
            {
                (products && products?.map((pr, index)=>(
                    <Product key={index} name={pr.name} price={pr.price} link={pr.link} />
                )))
            }
        </div>
    )
}

function Product({name,price,link}){
    return(
        <div className="border border-(--border) px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-wrap justify-between items-center gap-6">
           
            <div className=" flex flex-row justify-evenly items-center gap-4">
                <span className="text-foreground/80 text-sm">{name}</span>
                <span className="text-foreground/80 text-sm">{price} Birr</span>
            </div>

            <div className="flex flex-row justify-evenly items-center gap-3">
                <a href={`/ahiadmin/edit/products/${link}`} className="text-blue-500 px-2 text-sm rounded-4xl bg-blue-500/20 cursor-pointer transition-all duration-300 hover:pr-4">Edit</a>
                <a className="text-red-400 px-2 text-sm rounded-4xl bg-red-400/20 cursor-pointer transition-all duration-300 hover:pl-4">Delete</a>
            </div>
        </div>
    )
}