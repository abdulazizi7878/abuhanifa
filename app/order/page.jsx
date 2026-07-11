"use client"

import Header from "@/components/header";
import Footer from "@/components/footer"
import { useEffect, useState } from "react";

export default function order(){
    const [part, setPart] = useState(1);
    const [isNext, setIsNext] = useState(false);
    const [isBack, setIsBack] = useState(false);


    useEffect(()=>{
        let cont = document.getElementById("_P_CONT");
        cont.style.transform = `translateX(-${(part - 1) * 100}%)`
        
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
                alert("ORDER SUCCESSFULLY SUBMITED!");
                window.location.href = "/";
            } else {
                alert("ORDER COULDN'T BE POSTED RIGHT NOW");
            }
            const respData = await response.json();
            
        } catch(err){
            alert("ORDER COULDN'T BE POSTED RIGHT NOW");
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
                        Back
                    </button>                    
                    ) : (
                    <button className="bg-foreground/12 text-foreground/20 px-6 py-2 rounded-2xl cursor-not-allowed" title="fill the above field">
                        Back
                    </button>  
                    ))
                }
            
            
                {
                    (isNext ? (
                    <button className="bg-(--primary) text-background duration-300 hover:px-5 px-6 py-2 rounded-2xl cursor-pointer" onClick={()=>{setPart(part + 1)}} >
                        Next
                    </button>                    
                    ) : (
                    <button className="bg-foreground/12 text-foreground/20 px-6 py-2 rounded-2xl cursor-not-allowed" title="fill the above field correctly">
                        Next
                    </button>  
                    ))
                }                    
                </div>

            </div>


            <div className="absolute top-4 left-6">
                <a href="/" className="bg-(--primary) text-background shadow-lg px-4 py-3 rounded-2xl duration-300 hover:px-3">Back to Home</a>
            </div>
        </main>
        </>
    )
}

function EnterName({makeItAvailable, makeItUnAvailable}) {
    
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
                <label htmlFor="name" className="ml-3 text-foreground/55">Full Name / ሙሉ ስም</label>
                <input onChange={(e)=>{checker(e.target.value)}} autoComplete="name" type="text" placeholder="Name / ስም" title="full name" id="name" className="border border-(--border) rounded-4xl px-6 py-3 md:py-4 duration-300 hover:px-8 shadow-lg outline-(--primary)" />                
            </div>
        </div>
    )
}

function EnterPhoneNumber({makeItAvailable, makeItUnAvailable}) {
    
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
                <label htmlFor="phoneNumber" className="ml-3 text-foreground/55">Phone Number / ስልክ ቁጥር</label>
                <input onChange={(e)=>{checker(e.target.value)}} type="number" placeholder="Number / ቁጥር" title="Phone Number" id="phoneNumber" className="border border-(--border) rounded-4xl px-6 py-3 md:py-4 duration-300 hover:px-8 shadow-lg outline-(--primary)" />                
            </div>
        </div>
    )
}



function ChooseLocation({makeItAvailable, makeItUnAvailable}) {
    
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
                <label htmlFor="location" className="ml-3 text-foreground/55">Location / ቦታ (መገኛ)</label>
                <select title="location" id="location" className="border border-(--border) px-6 py-2 duration-300 hover:px-8 rounded-2xl outline-(--primary) " onChange={(e)=>{checker(e.target.value)}}>
                    <option className="text-black">Choose</option>
                    <option value="addis_ababa" className="text-black">Addis Ababa / አዲስ አበባ</option>
                    <option value="buta_jira" className="text-black">Buta Jira / ቡታጅራ</option>
                    <option value="worabe" className="text-black">Worabe / ወራቤ</option>
                    <option value="halaba" className="text-black">Halaba / ሃላባ</option>
                </select>
            </div>
        </div>
    )
}


function ChooseJob({makeItAvailable, makeItUnAvailable}) {
    
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
                <span className="ml-3 text-foreground/55">Select the Job / ስራውን ይምረጡ</span>
                
                <div className="flex gap-2">
                    <input type="checkbox" value={"electric"} id="electric" title="electric" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="electric">Electric / የማብራት</label> 
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"plumbing"} id="plumbing" title="plumbing" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="plumbing">Plumbing / የቧንቧ</label>                   
                </div>

            </div>
        </div>
    )
}


function ChooseJobType({makeItAvailable, makeItUnAvailable}) {
    
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
                <span className="ml-3 text-foreground/55">Select The Job Type / የስራ አይነት ይምረጡ</span>
                
                <div className="flex gap-2">
                    <input type="checkbox" value={"new"} id="new" title="New" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="new">New Installation / አዲስ ዝርጋታ</label> 
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"maintenance"} id="maintenance" title="Maintenance" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="maintenance">Renovation and Maintenance / የነበረን ማደስ</label>                   
                </div>

                <div className="flex gap-2">
                    <input type="checkbox" value={"finishing"} id="finishing" title="Finishing" onChange={(e)=>{checker(e.target.checked)}} /> 
                    <label htmlFor="finishing">Finishing Work / የማጠናቀቂያ ስራ</label>                   
                </div>

            </div>
        </div>
    )
}


function AddComment({makeItAvailable, makeItUnAvailable}) {
    
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
                <span className="ml-3 text-foreground/55">If you have any idea... / የትኛውም ሃሳብ ካሎት...</span>

                <textarea  onChange={(e)=>{checker(e.target.value)}} id="comment" className="w-11/12 sm:w-100 md:w-120 lg:w-130 min-h-60 border border-(--border) px-6 py-4 duration-300 hover:px-8 outline-(--primary) rounded-4xl" placeholder="If you have anything you want to say about the work...">
                </textarea>
            </div>
        </div>
    )
}


function Final({OnClick}){
    return(
        <div className="border border-(--border)/35 rounded-4xl flex flex-col justify-center items-center gap-10 shrink-0 w-full">
            <h1 className="text-foreground/50">🎉 You Are Almost Finished 🎉</h1>
            <p className="text-sm text-foreground/50">Tap submit button</p>
            <button onClick={OnClick} className="bg-(--primary) px-4 py-2 rounded-2xl duration-400 hover:px-5 cursor-pointer text-foreground/70">
                send / ይላኩ
            </button>
        </div>
    )
}