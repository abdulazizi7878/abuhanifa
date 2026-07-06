"use client"

import { useEffect, useState } from "react"

export default function AdminPage(){
    return(
        <div className="flex justify-center items-start  w-full min-h-[70vh]">
            <AdminHeader />
            <AdminMain />
            <AdminMainSm />
        </div>
    )
}



function AdminHeader(){
    return(
        <div className="w-50 h-full flex-col items-start gap-4 border-r border-r-(--border) hidden md:flex lg:flex  ">

            <div className="w-[99%] h-[90%] flex flex-col justify-start items-center gap-4">

                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <img src="/images/logo.jpg" className="size-18 rounded-full" alt="LOGO" />
                    <span className="text-sm">Abu-Hanifa Admin Page</span>
                </div>

                <div className="border border-(--border) rounded-4xl px-4 py-3 w-49/52 h-[90%] flex flex-col gap-4 overflow-scroll">
                  
                  <div className="w-49/50">
                        <p className="p-4 text-sm">View</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/view/orders">Orders</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/view/comments">Messages & Comments</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/view/blogs">Blogs</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/view/products">Products</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/view/promotions">Promotions</a>
                            </ul>
                        </nav>                    
                    </div>

                    <div className="w-49/50">
                        <p className="p-4 text-sm">blogs</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/create/blog">Create</a>
                            </ul>
                        </nav>                    
                    </div>
                    
                    <div className="w-49/50">
                        <p className="p-4 text-sm">product</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Create</a>
                            </ul>
                        </nav>                    
                    </div>
                                        
                    <div className="w-49/50">
                        <p className="p-4 text-sm">promotion</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/create/promotion">Create </a>
                            </ul>
                        </nav>                    
                    </div>
                </div>

            </div>

            <div className="h-[5%] w-full flex items-center justify-center">
                <span className="text-sm text-center">
                    Abu Hanifa Installation &copy; 2026
                </span>
            </div>

        </div>
    )
}

function AdminMain() {
    return(
        <div className="w-11/12 h-full border hidden md:flex overflow-y-scroll">
            <div>

            </div>
            <h1>
                Im admin main
            </h1>
        </div>
    )
}

function AdminMainSm(){
    return(
        <div className="mt-25 w-full flex flex-col justify-center items-center gap-y-6 md:hidden">
            <div>
                <h1 className="text-2xl">Welcome to Admin Page</h1>
            </div>
            <div className="w-full flex flex-wrap justify-center items-center gap-6">
                <LinkDivs text={"Create Blog"} link={"/ahiadmin/create/blog"}  />
                <LinkDivs text={"Create Promotion"} link={"/ahiadmin/create/promotion"}  />
                <LinkDivs text={"Create Product"} link={"/ahiadmin/create/product"}  />
                <LinkDivs text={"View Blogs"} link={"/ahiadmin/view/blog"}  />
                <LinkDivs text={"View Comments & messages"} link={"/ahiadmin/view/comments"}  />
                <LinkDivs text={"View Orders"} link={"/ahiadmin/view/orders"}  />
                <LinkDivs text={"View Products"} link={"/ahiadmin/view/products"}  />
                <LinkDivs text={"View Promotions"} link={"/ahiadmin/view/promotions"}  />
            </div>
        </div>
    )
}

function LinkDivs({text,link}){

    return(
    <div className={`bg-(--secondary) size-35 border border-(--border) px-4 flex justify-center items-center rounded-2xl shadow-lg relative`}>
        <p className="text-center">{text}</p>
        <a href={link} className="absolute inset-0"></a>
    </div>
    )
}





























function ad(){
    return(
        <div className="border border-[var(--border)]/40 p-10 rounded-4xl">
            <div className="flex flex-col gap-6">
                <div className="border border-[var(--border)] px-4 py-2 rounded-4xl flex bg-foreground">
                    <p className="bg-background text-foreground px-4 rounded-2xl">Abu Hanifa Installation</p>
                    <p className="mx-auto text-background">Login</p>
                </div>
                <div className="border border-[var(--border)] flex flex-col rounded-4xl gap-4 p-6">
                    <input type="email" id="email" placeholder="Username" className="border border-[var(--border)] px-4 py-1 rounded-2xl" />
                    <input type="password" placeholder="Password" className="border border-[var(--border)] px-4 py-1 rounded-2xl" id="password" />
                    <input type="submit" className="border border-[var(--border)] px-2 py-1 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}