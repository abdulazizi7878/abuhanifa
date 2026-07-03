"use client"

import { useEffect, useState } from "react";

export default function Heaader(){


    const [isDarkMode, setIsDarkMode] = useState(Boolean);

    

    function changeTheme(){
        setIsDarkMode(!isDarkMode);  
    }

    


    
    useEffect(()=>{                  
        let content = document.getElementById("theme")
        let root = document.documentElement;
        root.classList.toggle("dark");
        
        if (root.classList.contains("dark")) {
            //changes colors
            document.documentElement.classList.add("dark");            
            //stores the theme
            localStorage.setItem("theme", "dark changed by first");
            setIsDarkMode(true);
            //ui upgrade
            content.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
            content.style.rotate = "10deg";
        } else if(!root.classList.contains("dark")) {
            document.documentElement.classList.add("light");
            setIsDarkMode(false)
            localStorage.setItem("theme", "light, changed by first")
            content.style.rotate = "-360deg";
            content.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>';
        }
    },[isDarkMode]);



    useEffect(()=>{
        let content = document.getElementById("theme");
        let root = document.documentElement;
        root.classList.toggle("dark");

        if (localStorage.getItem("theme") == "dark") {
            //changes colors
            document.documentElement.classList.add("dark");
            content.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
        } else {
            document.documentElement.classList.add("light");
            content.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>';
        }

    },[])




    return(
        <div className="px-2 py-4 flex justify-center items-center w-full fixed top-0 left-0 z-10">
            <header 
            className="w-[100%] sm:w-[98%] md:w-[95%] lg:w-[93%] border-1 border-[var(--border)] p-3 px-6  dark:bg-background/50 rounded-full shadow-xl shadow-black/15"
            style={{backdropFilter:"blur(24px) saturate(180%) ;"}}>
                <div className="hd w-full flex justify-between items-center">

                    <div className="logo flex justify-center items-center gap-x-2 md:gap-x-4 lg:gap-x-4">
                        <img src="/images/logo.jpg" alt="ABUHANIFA_INSTALLATION_LOGO" width={50} height={50} className="rounded-full" />  
                        <p className="text-sm text-center sm:hidden md:flex lg:flex">Abu-Hanifa <br /> Installation</p>
                    </div>

                    <div className="navs w-0 overflow-hidden duration-300 sm:w-3/5 md:w-3/5 lg:4/5">
                        <ul className="w-full flex justify-around">
                            <li><a href="/home" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Home</a></li>
                            <li><a href="#mission" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Mission</a></li>
                            <li><a href="#services" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Services</a></li>
                            <li><a href="#contact" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Contact</a></li>
                            <li><a href="#order" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Order</a></li>
                            <li><a href="/blog" className="duration-400 text-sm hover:bg-foreground/80 hover:text-background hover:px-2 hover:py-0.5 rounded-2xl">Blog</a></li>
                        </ul>
                    </div>

                    <div className="border bg-foreground flex items-center gap-x-4  md:gap-x-6 lg:gap-x-6 px-5 py-2 rounded-full">

                        <div className="menu">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--background)">
                                 <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                            </svg>
                        </div>

                        <div className="theme transition-all duration-300 border-1  border-background/15 rounded-[8px] bg-background/20 hover:bg-background/25 cursor-pointer  px-2 py-1" onClick={()=>{
                            changeTheme();
                        }} >
                            <div id="theme" className="transition-all duration-1000" >
                            </div>

                        </div>
                    </div>

                </div>
            </header>            
        </div>
    )
}