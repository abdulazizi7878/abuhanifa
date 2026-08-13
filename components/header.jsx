"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./lannguageSwitcher";

export default function Header() {
    const t = useTranslations("header");
    const [isNavVisible, setNavvisible] = useState(false);
    const [screenPosition, setScreenPosition] = useState(0);
    const [lastScreenPosition, setLastScreenPosition] = useState(0);

    function ChangeTheme() {
        let themeContainer = document.getElementById("theme");
        let root = document.documentElement;
        root.classList.toggle("dark");

        let theme = (localStorage.getItem("theme") == "dark") ? "dark" : "light";

        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            if (themeContainer) {
                themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>';
                themeContainer.style.rotate = "360deg";
            }
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            if (themeContainer) {
                themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
                themeContainer.style.rotate = "-360deg";
            }
            localStorage.setItem("theme", "dark");
        }
    }

    useEffect(() => {
        let themeContainer = document.getElementById("theme");
        if (!themeContainer) return;
        let theme = localStorage.getItem("theme") == "dark" ? "dark" : "light";
        let root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/></svg>';
            themeContainer.style.rotate = "720deg";
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            themeContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20px" fill="var(--background)"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>';
            themeContainer.style.rotate = "-720deg";
            localStorage.setItem("theme", "light");
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScreenPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const header = document.getElementById("header");
        if (!header) return;

        if (screenPosition > lastScreenPosition) {
            header.style.transform = "translateY(-100%)";
        } else if (screenPosition < lastScreenPosition) {
            header.style.transform = "translateY(0)";
        }

        setLastScreenPosition(screenPosition);
    }, [screenPosition, lastScreenPosition]);

    return (
        <div className="py-4 flex flex-col justify-center items-center w-[96%] max-w-7xl h-fit fixed top-0 left-[50%] -translate-x-[50%] z-40 transition-transform duration-500" id="header">
            <header className="w-full border border-[var(--border)] p-3 px-4 md:px-6 dark:bg-background/60 bg-background/80 backdrop-blur-2xl backdrop-saturate-250 rounded-full shadow-xl shadow-black/15">
                <div className="hd w-full flex justify-between items-center">

                    {/* Logo & Title */}
                    <div className="logo flex justify-start items-center gap-x-2 md:gap-x-4">
                        <img src="/images/logo.jpg" alt="ABUHANIFA_INSTALLATION_LOGO" width={42} height={42} className="rounded-full object-cover" />  
                        <p className=" w-[40%] text-xs md:text-sm font-bold text-left sm:flex tracking-tight text-[var(--foreground)]">{t("title")}</p>
                    </div>

                    {/* Medium Screens Navs */}
                    <div className="navs hidden md:flex lg:hidden items-center">
                        <ul className="flex items-center gap-x-1">
                            <li><a href="/#" className="duration-300 text-xs font-medium px-3 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("home")}</a></li>
                            <li><a href="/order/" className="duration-300 text-xs font-medium px-3 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("order")}</a></li>
                            <li><a href="/#services" className="duration-300 text-xs font-medium px-3 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("services")}</a></li>
                        </ul>       
                    </div>

                    {/* Large Screens Navs */}
                    <div className="navs hidden lg:flex items-center">
                        <ul className="flex items-center gap-x-1">
                            <li><a href="/#" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("home")}</a></li>
                            <li><a href="/order/" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("order")}</a></li>
                            <li><a href="/products/" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("products")}</a></li>
                            <li><a href="/promotions/" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("promotions")}</a></li>
                            <li><a href="/blog/" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("blog")}</a></li>
                            <li><a href="/#services" className="duration-300 text-sm font-medium px-4 py-1.5 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full">{t("services")}</a></li>
                        </ul>       
                    </div>

                    {/* Language Switcher - Always Visible */}
                    <div className="flex items-center">
                       <LanguageSwitcher display={false} /> 
                    </div>

                    {/* Menu and Theme Toggles */}
                    <div className="flex items-center gap-x-3 px-3 ">
                        <div className="border bg-[var(--foreground)] flex items-center p-1.5 px-3 rounded-full shadow-sm gap-x-2">
                            <div className="menu cursor-pointer p-1 rounded-full hover:opacity-80 transition-opacity lg:hidden" onClick={() => { setNavvisible(!isNavVisible) }}>
                                {isNavVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--background)">
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--background)">
                                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                    </svg>            
                                )}
                            </div>

                            <div className="theme transition-all duration-300 border border-background/15 rounded-full bg-background/25 hover:bg-background/40 cursor-pointer p-1.5" onClick={() => { ChangeTheme(); }}>
                                <div id="theme" className="transition-all duration-700 flex items-center justify-center"></div>
                            </div>
                        </div>
                    </div>
                </div>      
            </header>

            <Nav isNavVisible={isNavVisible} onClick={() => setNavvisible(false)} /> 
        </div>
    );
}

function Nav({ isNavVisible, onClick }) {
    const t = useTranslations("header");

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${isNavVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
                onClick={onClick}
            />

            {/* Strictly Centered Menu */}
            <div className={`fixed top-24 left-0 right-0 mx-auto z-40 w-[90%] max-w-sm flex justify-center min-h-40 transition-all duration-500 transform ${isNavVisible ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "-translate-y-6 opacity-0 scale-95 pointer-events-none"}`} id="nav">
                <div className="relative w-full bg-[var(--background)]/90 border border-[var(--border)] backdrop-blur-2xl backdrop-saturate-200 rounded-3xl flex flex-col gap-5 justify-start items-center py-8 px-6 sm:px-10 shadow-2xl shadow-black/20">
                    <div className="w-full text-center">
                        <h1 className="font-extrabold text-base tracking-tight text-[var(--foreground)]">{t("title")}</h1>    
                        <hr className="w-full my-2 border-[var(--border)]" />            
                    </div>
                
                    <div className="flex flex-col gap-5 justify-center items-center w-full">
                        <ul className="flex flex-col gap-2 justify-center items-center w-full">
                            <li className="w-full text-center"><a href="/" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("home")}</a></li>
                            <li className="w-full text-center"><a href="/blog" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("blog")}</a></li>
                            <li className="w-full text-center"><a href="/products" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("products")}</a></li>
                            <li className="w-full text-center"><a href="/promotions" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("promotions")}</a></li>
                            <li className="w-full text-center"><a href="/contact" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("contact")}</a></li>
                            <li className="w-full text-center"><a href="/order" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("order")}</a></li>
                            <li className="w-full text-center"><a href="/#services" onClick={onClick} className="block text-sm font-medium duration-200 px-6 py-2 hover:bg-[var(--foreground)] hover:text-[var(--background)] rounded-full transition-colors">{t("services")}</a></li>
                        </ul>
                        
                        <div className="w-full flex justify-center pt-2 border-t border-[var(--border)]">
                            <LanguageSwitcher display={true} />
                        </div>

                        <span className="text-[11px] text-center opacity-60 font-medium leading-tight">Abu-Hanifa Installation <br /> &copy; All Right Reserved</span>
                    </div>

                    <div className="absolute top-4 right-4 bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 rounded-full p-2 cursor-pointer transition-colors" onClick={onClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="var(--foreground)">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}