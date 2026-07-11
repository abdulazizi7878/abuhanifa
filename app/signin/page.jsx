"use client"

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function signin(){
    return(
        <>
            <Header />
            <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh]">
                <Sss />
            </main>
           
            <Footer />       
        </>

    )
}


function Sss(){

    async function LogIn() {
        try {            
            const response = await fetch("/api/login",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                credentials:"include",
                body:JSON.stringify({
                    username: document.getElementById("username").value,
                    password: document.getElementById("password").value
                })
            })
            const responseData = await response.json();
            if(responseData.success == true){
                window.location.href = `/ahiadmin`
            } else {
                alert("INVALID CREDENTIALS!")
            }
        } catch(err){
            alert("SERVER ERROR!");
        }
    }

    return(
        <div className="flex flex-col justify-center items-center gap-6 border border-(--border) px-10 py-15 rounded-4xl shadow-lg">
            <h1>Welcome Back!</h1>
            <p id="test"></p>
            <div className="flex flex-col justify-center items-center gap-y-4">
                <input type="text" id="username" autoComplete="username" placeholder="username" title="Username" className="border border-(--border) duration-300 hover:px-8 px-6 py-2 rounded-4xl shadow-lg " />
                <input type="password" id="password" autoComplete="current-password webauthn" placeholder="password" title="Password" className="border border-(--border) duration-300 hover:px-8 px-6 py-2 rounded-4xl shadow-lg " />
                <input onClick={()=>{LogIn()}} type="submit" className="bg-foreground text-background w-fit duration-300 hover:px-3 px-4 py-1 rounded-4xl cursor-pointer shadow-lg" />
            </div>
        </div>         
    )
}