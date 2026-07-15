"use client"

import { useEffect, useState } from "react";
import Loading from "./loading";
import Image from "next/image";
import Uploading from "./uploading";
import { useTranslations } from "next-intl";

export default function OrderProduct({link}){
    return(
        <>
            <CheckPriceAndOrder link={link} />
        </>
    )
}



function CheckPriceAndOrder({link}){

    const t = useTranslations("orderProduct")
    const [priceLoading, setPriceLoading] = useState(false);
    const [product, setProduct]= useState(null);
    const [file,setFile] = useState(null);
    const [uploading,setUploading] = useState(false);
    const [location,setLocation] = useState(null);

    async function CheckPrice(type) {
        setPriceLoading(true);
        let amount = document.querySelector(`#amount${type}`).value || 1;

        try{
            const response = await fetch("/api/showproduct",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"post",
                body:JSON.stringify({
                    link:link,
                    amount:amount
                })
            })

            const resData = await response.json();
            
            setProduct(resData?.data);
            setPriceLoading(false);
        } catch(err){
            setProduct("error");
            setPriceLoading(false)            
        }


    }
    
    useEffect(()=>{
        CheckPrice(1);
    },[]);


    async function SendOrder() {

        let name = document.getElementById("name").value;
        let phoneNumber = document.getElementById("phoneNumber").value;
        let accountNumber = document.getElementById("accountNumber").value;
        let amount = document.getElementById("amount2").value; 

        if (!name) {
            alert("please enter your name!");
            return;
        }
        if (!phoneNumber) {
            alert("please enter your phone number!");
            return;
        }
        if (!location || location == "other" || location == null || location == "choose") {
           alert("choose or write your location") ;
           return;
        } 
        if (!accountNumber) {
            alert("please enter your account number!");
            return;
        }
        if (!amount) {
            amount = 1;
        }
        if (!file) {
            alert("please upload image");
            return;
        }
        
        setUploading(true);

        const imageData = new FormData();
        imageData.append("file",file);

        try{
            const imgResponse = await fetch("/api/upload",{
                method:"POST",
                body:imageData
            })
            const imgUrl = await imgResponse.json();

            if (imgUrl.success) {
                const image = imgUrl?.url;

                try{
                    const response = await fetch("/api/orderproduct",{
                        headers:{
                            "Content-Type":"application/json"
                        },
                        method:"POST",
                        body: JSON.stringify({
                            name:name,
                            phone_number:phoneNumber,
                            location: location,
                            account_number:accountNumber,
                            amount:amount,
                            image:image,
                            product_id:product?.result[0]?.id
                        })
                    })

                    const data = await response.json();                    
                    
                    if (data.success) {
                        alert("Product Successfully submitted");
                        window.location.reload();
                        setUploading(false);
                    } else{
                        alert("We couldn't order your product");
                        setUploading(false);
                    }

                } catch(err){
                    alert("We couldn't order your product");
                    setUploading(false);                    
                }
            } else {
                alert("We couldn't order your product");
                setUploading(false);
            }
        } catch(err){
            alert("We couldn't order your product");
            setUploading(false);
        }
    }

    return(
        <>
        <div className="w-25/26 md:w-23/26 flex flex-col justify-center items-center gap-10">

            <div className="flex flex-col gap-y-6">
                <p className="text-foreground/60 max-w-80 text-center">{t("title")}</p>
            </div>

            <div className="flex flex-col gap-y-6 justify-center items-center">
                <label htmlFor="amount" className="text-foreground/50" >{t("Amount of product")}</label>
                <div className="flex flex-col items-center justify-around gap-4">
                    <input type="number" id="amount1" min={1} placeholder="1" title="Amount of product, the default amount is one" className="w-20 border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />                
                    <button onClick={()=>{CheckPrice(1)}} className="px-4 py-2 bg-foreground text-background/80 rounded-4xl shadow-lg cursor-pointer transition-all duration-300 hover:pl-5 hover:shadow-xl hover:bg-foreground/80">{t("Check price")}</button>
                    <div>
                        {
                            (priceLoading ? (<Loading loadingItem={"price"} /> ) : (<p className="text-foreground/60 text-xl"> {product?.totalPrice} {t("birr")}</p>))
                        }
                    </div>
                </div>
            </div>

            <div className="flex gap-2" id="account">
                <p className="text-foreground/60 max-w-100">{t("Account Number")} : 10001234567</p>
                <button className="bg-foreground/20 px-2 text-sm text-foreground/60" onClick={()=>{navigator.clipboard.writeText(10001234567);}} >copy</button>
            </div>
        </div>  

        <hr className="my-6 w-full border border-(--border)" />

        <div className="w-25/26 md:w-23/26 flex flex-col justify-center items-center gap-2">
            <p className="text-foreground/60">{t("Product Name")} : {product?.result[0]?.name}</p> 
            <p className="text-foreground/60">{t("Product Price")}: {product?.result[0]?.price}</p>
            <div className="flex items-center gap-4">
                <p className="text-foreground/60">{t("Product Image")}:</p>
                <img src={product?.result[0]?.image} width={50} className="brightness-75 rounded-2xl" loading="lazy" />                 
            </div> 
        </div>

        <hr className="my-6 w-full border border-(--border)" />


        <div className="w-25/26 md:w-23/26 flex flex-col gap-y-5">

        <div>
            <p className="ml-3 text-foreground/60">{t("Fill the form to order")}</p>
        </div>

            <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="name" className="ml-3 text-foreground/50" >{t("Full Name")}</label>
                <input type="text" id="name" autoComplete="name" placeholder={t("Full Name")} title="Name" className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />                
            </div>
            
            <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="phoneNumber" className="ml-3 text-foreground/50" >{t("Phone Number")}</label>
                <input type="number" id="phoneNumber" min={90000000} placeholder={t("Phone Number")} title="Phone Number" className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />                
            </div>

           <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="location" className="ml-3 text-foreground/50" >{t("Location")}</label>
                <select  id="location" onChange={(e)=>{setLocation(e.target.value);}} className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl">
                    <option value="" className="text-black" >{t("choose")}</option>
                    <option value="addis_ababa" className="text-black">{t("Addis ababa")}</option>
                    <option value="buta_jira" className="text-black" >{t("Butajira")}</option>
                    <option value="worabe" className="text-black">{t("Worabe")}</option>
                    <option value="halaba" className="text-black">{t("Halaba")}</option>
                    <option value="other" className="text-black">{t("Other")}</option>
                </select>
                {
                    (location == "other" || location != null && location != "choose" && location != "addis_ababa" && location != "buta_jira" && location != "worabe" && location != "halaba" ? (<input onChange={(e)=>{setLocation(e.target.value)}} type="text" id="customeLocation" placeholder={t("write the location")} className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />) : (""))
                }
            </div>

            <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="accountNumber" className="ml-3 text-foreground/50" >{t("Your Bank Account Number")}</label>
                <input type="number" id="accountNumber" min={1000000} placeholder={t("Your Bank Account Number")} title="Your Bank account Number, you can write any type of account number..." className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />                
            </div>

            <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="amount" className="ml-3 text-foreground/50" >{t("Amount of product")}</label>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <input type="number" id="amount2" min={1} onChange={(e)=>{CheckPrice(2)}} placeholder={t("Amount Number")} title="Amount of product, the default amount is one" className="border border-(--border) px-4 py-2 outline-(--primary) rounded-4xl" />                
                       <p className="text-md text-center"> {product?.totalPrice} <span className="text-red-400 text-sm">{t("birr")}</span></p>
                    </div>
                        {
                            (priceLoading && (<Loading loadingItem={"price"} />))
                        }                    
                </div>
            </div>

            <div className="flex flex-col gap-2 p-2 justify-center items-start">
                <label htmlFor="file" className="ml-3 text-foreground/50" >{t("Upload payment receiption image")}</label>
                <input type="file" id="file" title="File" hidden onChange={(e)=>setFile(e.target.files[0])} />
                <button onClick={()=>{document.getElementById("file").click();}} className="bg-foreground/20 px-4 py-1 rounded-4xl shadow cursor-pointer text-foreground/70 transition-all duration-300 hover:pl-6">{t("Upload Image")}</button>         
                <div>
                    {
                        (uploading && (<Uploading uploadingItem={"order"} />))
                    }
                </div>
                <button onClick={()=>{SendOrder();}} className="bg-foreground mt-10 px-4 py-1 rounded-4xl shadow cursor-pointer text-background/80 transition-all duration-300 hover:pl-6">{t("Send")}</button>                
            </div>
        </div>           
        </>
    )
}
