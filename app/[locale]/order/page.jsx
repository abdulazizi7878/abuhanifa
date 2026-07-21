"use client"

import Header from "@/components/header";
import Footer from "@/components/footer"
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function order(){
    const t = useTranslations("order");
    const [part, setPart] = useState(1);
    const [isNext, setIsNext] = useState(false);
    const [isBack, setIsBack] = useState(false);


    useEffect(()=>{
        let dir = document.documentElement.dir;
        let direction;
        if (dir === "rtl") {
            direction = 0;
        } else {
            direction = 1;
        }

        let cont = document.getElementById("_P_CONT");
        cont.style.transform = `translateX(${direction == 1 ? "-" : ""}${(part - 1) * 100}%)`
        
        if (part > 1) {
            setIsBack(true);
        } else {
            setIsBack(false);
        }

        if(part != 6){
          setIsNext(false);
        }
    },[part]);


    async function SendData() {
        let name = document.getElementById("name").value;
        let phone_number = document.getElementById("phoneNumber").value;
        let location = document.getElementById("location").value;
        let job = document.getElementById("electric").checked ? "electric" : "plumbing";
        let job_type =  document.getElementById("new").checked ? "New" :  (document.getElementById("maintenance").checked ? "Maintenance" : ( document.getElementById("finishing").checked ? "Finishing" : "Invalid"));
        let comment = document.getElementById("comment").value ?? "No comment";

        const posting = toast.loading("Sending your order")
        try {
            const response = await fetch("/api/postorder",{
                headers:{
                    "Content-Type":"application/json"
                },
                method: "POST",
                credentials:"include",
                body: JSON.stringify({
                    name:name,
                    phone_number:phone_number,
                    location:location,
                    job:job,
                    job_type:job_type,
                    comment:comment
                })
            });

            if(response.ok){
                toast.success("Order successfully sent!",{id:posting});
                window.location.href = "/";
            } else {
                toast.error("Your order couldn't be sent!",{id:posting});
            }
            const respData = await response.json();
        } catch(err){
            toast.error("Your order couldn't be sent!",{id:posting});
        }
     }



    return(
        <>
        <div className="hidden">
            <Header />
        </div>
        <main className="flex flex-col justify-center items-center gap-4 h-screen relative">

            <div className="form overflow-hidden w-[95vw] h-[60%] py-10">
                <div className="flex" style={{transition:"transform .3s ease"}} id="_P_CONT">
                    
                   
                    <EnterName makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <EnterPhoneNumber makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <ChooseLocation makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <ChooseJob makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <ChooseJobType makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <AddComment makeItAvailable={()=>{setIsNext(true)}} makeItUnAvailable={()=>{setIsNext(false)}} />
                    <Final OnClick={()=>{SendData()}} />

                </div>
            </div>

            <div className="w-[95vw] ">
                <div className="sm:w-100 w-full flex flex-row justify-around">
                {
                    (isBack ? (
                    <button className="bg-(--primary) text-background duration-300 hover:px-5 px-6 py-2 rounded-2xl cursor-pointer" onClick={()=>{setPart(part - 1)}} >
                        {t("Back")}
                    </button>                    
                    ) : (
                    <button className="bg-foreground/12 text-foreground/20 px-6 py-2 rounded-2xl cursor-not-allowed" title="fill the above field">
                        {t("Back")}
                    </button>  
                    ))
                }
            
            
                {
                    (isNext ? (
                    <button className="bg-(--primary) text-background duration-300 hover:px-5 px-6 py-2 rounded-2xl cursor-pointer" onClick={()=>{setPart(part + 1)}} >
                        {t("Next")}
                    </button>                    
                    ) : (
                    <button className="bg-foreground/12 text-foreground/20 px-6 py-2 rounded-2xl cursor-not-allowed" title="fill the above field correctly">
                        {t("Next")}
                    </button>  
                    ))
                }                    
                </div>

            </div>


            <div className="absolute top-4 left-6">
                <a href="/" className="bg-(--primary) text-background shadow-lg px-4 py-3 rounded-2xl duration-300 hover:px-3">{t("Back to Home")}</a>
            </div>
        </main>
        </>
    )
}

function EnterName({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");

    
    function checker(e){

        if (e.replaceAll(" ","").length > 3) {
           makeItAvailable();   
        } else {
            makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <label htmlFor="name" className="ml-3 text-foreground/55">{t("Name")}</label>
                <input onChange={(e)=>{checker(e.target.value)}} autoComplete="name" type="text" placeholder={t("Name")} title="full name" id="name" className="border border-(--border) rounded-4xl px-6 py-3 md:py-4 duration-300 hover:px-8 shadow-lg outline-(--primary)" />                
            </div>
        </div>
    )
}

function EnterPhoneNumber({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");
    
    function checker(e){
        
        if (e.replaceAll(" ","").length >= 10 && e.replaceAll(" ","").length <= 12) {
           makeItAvailable();   
        } else {
            makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <label htmlFor="phoneNumber" className="ml-3 text-foreground/55">{t("Phone Number")}</label>
                <input onChange={(e)=>{checker(e.target.value)}} type="number" placeholder={t("Phone Number")} title="Phone Number" id="phoneNumber" className="border border-(--border) rounded-4xl px-6 py-3 md:py-4 duration-300 hover:px-8 shadow-lg outline-(--primary)" />                
            </div>
        </div>
    )
}



function ChooseLocation({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");
    
    function checker(e){
                
        if (e == "addis_ababa" || e == "buta_jira" || e == "worabe" || e == "halaba") {
           makeItAvailable();   
        } else {
            makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <label htmlFor="location" className="ml-3 text-foreground/55">{t("Location")}</label>
                <select title="location" id="location" className="border border-(--border) px-6 py-2 duration-300 hover:px-8 rounded-2xl outline-(--primary) " onChange={(e)=>{checker(e.target.value)}}>
                    <option className="text-black">{t("Choose")}</option>
                    <option value="addis_ababa" className="text-black">{t("Addis Ababa")}</option>
                    <option value="buta_jira" className="text-black">{t("Buta Jira")}</option>
                    <option value="worabe" className="text-black">{t("Worabe")}</option>
                    <option value="halaba" className="text-black">{t("Halaba")}</option>
                </select>
            </div>
        </div>
    )
}


function ChooseJob({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");
    
    function checker(e){
                
        let ele = document.getElementById("electric").checked;
        let plu = document.getElementById("plumbing").checked;

        if (ele || plu) {
           makeItAvailable();   
        } else {
            makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <span className="ml-3 text-foreground/55">{t("Select the job")}</span>
                
                <div className="flex gap-2">
                    <input type="checkbox" value={"electric"} id="electric" title="electric" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="electric">{t("Electric")}</label> 
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"plumbing"} id="plumbing" title="plumbing" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="plumbing">{t("Plumbing")}</label>                   
                </div>

            </div>
        </div>
    )
}


function ChooseJobType({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");
    
    function checker(e){
                
        let newIns = document.getElementById("new").checked;
        let mainTe = document.getElementById("maintenance").checked;
        let finiS = document.getElementById("finishing").checked;

        if (newIns || mainTe || finiS) {
           makeItAvailable();   
        } else {
           makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <span className="ml-3 text-foreground/55">{t("Select the job")}</span>
                
                <div className="flex gap-2">
                    <input type="checkbox" value={"new"} id="new" title="New" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="new">{t("New Installation")}</label> 
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"maintenance"} id="maintenance" title="Maintenance" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="maintenance">{t("Renovation and Maintenance")}</label>                   
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"finishing"} id="finishing" title="Finishing" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="finishing">{t("Finishing Work")}</label>                   
                </div>

            </div>
        </div>
    )
}


function AddComment({makeItAvailable, makeItUnAvailable}) {
    const t = useTranslations("order");
    
    function checker(e){

        if (e.length > 5) {
           makeItAvailable();   
        } else {
           makeItUnAvailable();
        }
    }

    return(
        <div className="rounded-4xl p-6 w-full shrink-0">
            <div className="flex flex-col justify-center items-start gap-y-4">
                <span className="ml-3 text-foreground/55">{t("If you have any idea")}...</span>

                <textarea  onChange={(e)=>{checker(e.target.value)}} id="comment" className="w-11/12 sm:w-100 md:w-120 lg:w-130 min-h-60 border border-(--border) px-6 py-4 duration-300 hover:px-8 outline-(--primary) rounded-4xl" placeholder="......">
                </textarea>
            </div>
        </div>
    )
}


function Final({OnClick}){
    const t = useTranslations("order");

    return(
        <div className="border border-(--border)/35 rounded-4xl flex flex-col justify-center items-center gap-10 shrink-0 w-full">
            <h1 className="text-foreground/50">🎉 {t("You Are Almost Finished")} 🎉</h1>
            <button onClick={OnClick} className="bg-(--primary) px-4 py-2 rounded-2xl duration-400 hover:px-5 cursor-pointer text-foreground/70">
                {t("Send")}
            </button>
        </div>
    )
}