"use client"

import { useEffect, useState } from "react";

export default function Header(){

    const [isNavVisible, setNavvisible] = useState(false);

   function ChangeTheme() {

        let themeContainer = document.getElementById("theme");
        let root  = document.documentElement;
        root.classList.toggle("dark");

        let theme = (localStorage.getItem("theme") == "dark") ? ("dark") : "light";

        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>'
            themeContainer.style.rotate = "360deg";
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
            themeContainer.style.rotate = "-360deg";
            localStorage.setItem("theme", "dark");
        }     
   }



    useEffect(()=>{
        let themeContainer = document.getElementById("theme");
        let theme = localStorage.getItem("theme") == "dark" ? "dark" : "light";
        let root = document.documentElement;
        root.classList.toggle("dark");

        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
            themeContainer.style.rotate = "720deg";
            localStorage.setItem("theme","dark");
        } else {
            document.documentElement.classList.remove("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>'
            themeContainer.style.rotate = "-720deg";
            localStorage.setItem("theme","light");
        }

    },[]);


    return(
        <div className="py-4 flex flex-col justify-center items-center w-22/23 h-fit fixed top-0 left-[50%] translate-x-[-50%] z-10 ">
            <header 
            className="w-full sm:w-[98%] md:w-[95%] lg:w-[93%] border border-(--border) p-3 px-6  dark:bg-background/60 backdrop-blur-2xl backdrop-saturate-250 rounded-full shadow-xl shadow-black/15"
            >
                <div className="hd w-full flex justify-between items-center">

                    <div className="logo flex justify-center items-center gap-x-2 md:gap-x-4 lg:gap-x-4">
                        <img src="/images/logo.jpg" alt="ABUHANIFA_INSTALLATION_LOGO" width={50} height={50} className="rounded-full" />  
                        <p className="text-[10px] md:text-sm text-center sm:hidden md:flex lg:flex">Abu-Hanifa <br /> Installation</p>
                    </div>

                    <div className="navs w-0 overflow-hidden duration-300 sm:w-3/5 md:w-3/5 lg:4/5">
                        <ul className="w-full flex justify-around">
                            <li><a href="/#" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Home</a></li>
                            <li><a href="/#mission" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Mission</a></li>
                            <li><a href="/#services" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Services</a></li>
                            <li><a href="/contact/" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Contact</a></li>
                            <li><a href="/order/" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Order</a></li>
                            <li><a href="/blog/" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Blog</a></li>
                        </ul>
                    </div>

                    <div className="border bg-foreground flex items-center gap-x-4  md:gap-x-6 lg:gap-x-6 px-5 py-2 rounded-full">

                        <div className="menu cursor-pointer" onClick={()=>{setNavvisible(!isNavVisible)}}>
                            {
                                (isNavVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg"  height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                    </svg>                                    
                                ))
                            }

                        </div>

                        <div className="theme transition-all duration-300 border-1  border-background/15 rounded-[8px] bg-background/20 hover:bg-background/25 cursor-pointer  px-2 py-1" onClick={()=>{
                            ChangeTheme()
                        }} >
                            <div id="theme" className="transition-all duration-1000" >
                            </div>

                        </div>
                    </div>
                </div>       
            </header>

            <Nav isNavVisible={isNavVisible} onClick={()=>(setNavvisible(!isNavVisible))} /> 
        </div>
    )
}


function Nav({isNavVisible, onClick}){
    return(
            <div className={`duration-400 fixed top-22 ${(isNavVisible ? "right-[5%]" : "-right-100")}  flex justify-end min-h-40 py-2`} id="nav">
                <div className="relative bg-background rounded-[50px] flex flex-col gap-6 justify-start items-center py-10 px-20 md:px-26 shadow-xl shadow-foreground/30 relative">
                   <div>
                        <h1>Abu-Hanifa <span className="text-(--primary)">Installation</span></h1>    
                        <hr className="w-full my-1" />                     
                   </div>
                
                   <div className="flex flex-col gap-6 justify-center items-center">
                    <ul className="flex flex-col gap-1.5 justify-center items-center">
                        <li className="text-sm duration-200 px-4 hover:bg-foreground hover:text-background rounded-2xl"><a href="/">home</a></li>
                        <li className="text-sm duration-200 px-4 hover:bg-foreground hover:text-background rounded-2xl"><a href="/blog">blog</a></li>
                        <li className="text-sm duration-200 px-4 hover:bg-foreground hover:text-background rounded-2xl"><a href="/contact">contact</a></li>
                        <li className="text-sm duration-200 px-4 hover:bg-foreground hover:text-background rounded-2xl"><a href="/order">order</a></li>
                        <li className="text-sm duration-200 px-4 hover:bg-foreground hover:text-background rounded-2xl"><a href="/#services">services</a></li>
                    </ul>
                    <span className="text-[11px] text-center">Abu-Hanifa Installation <br /> &copy; All Right Reserved</span>
                   </div>
                   <div className="absolute top-6 right-6 bg-foreground/50  rounded-xl px-2 py-1 cursor-pointer" onClick={onClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                           <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                      </svg>
                   </div>
                </div>
            </div>         
    )
}