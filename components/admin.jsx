export default function AdminPage(){
    return(
        <div className="flex justify-center items-start  w-full h-full">
            <AdminHeader />
            <AdminMain />
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
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/status">Status</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/orders">Orders</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/comments">Messages & Comments</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/registered">Registered</a>
                            </ul>
                        </nav>                    
                    </div>

                    <div className="w-49/50">
                        <p className="p-4 text-sm">blogs</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="/ahiadmin/create/blog">Create</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Edit</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Remove</a>
                            </ul>
                        </nav>                    
                    </div>
                    
                    <div className="w-49/50">
                        <p className="p-4 text-sm">product</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Create</a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Edit </a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Remove </a>
                            </ul>
                        </nav>                    
                    </div>
                                        
                    <div className="w-49/50">
                        <p className="p-4 text-sm">promotion</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Create </a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Edit </a>
                                <a className="border-y border-y-(--border)/50 w-11/12 text-center text-[12px] duration-300 hover:bg-foreground/10" href="">Remove </a>
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
        <div className="w-11/12 h-full border overflow-y-scroll">
            <div>

            </div>
            <h1>
                Im admin main
            </h1>
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