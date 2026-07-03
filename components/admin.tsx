export default function AdminPage(){
    return(
        <div className="flex justify-between w-full h-full">
            <AdminHeader />
            <AdminMain />
        </div>
    )
}



function AdminHeader(){
    return(
        <div className="w-[20%] h-full flex flex-col items-start gap-4 border-r border-r-(--border)">

            <div className="w-[99%] h-[90%] flex flex-col justify-start items-center gap-4">

                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <img src="/images/logo.jpg" className="size-18 rounded-full" alt="LOGO" />
                    <span className="text-sm">Abu-Hanifa Admin Page</span>
                </div>

                <div className="border border-(--border) rounded-4xl px-4 py-3 w-49/52 h-[90%] flex flex-col gap-4 overflow-scroll">
                  
                  <div className="w-49/50">
                        <p className="pl-4 text-sm">View</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="/ahiadmin/status">Status</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="/ahiadmin/orders">Orders</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="/ahiadmin/comments">Messages & Comments</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="/ahiadmin/registered">Registered</a>
                            </ul>
                        </nav>                    
                    </div>

                    <div className="w-49/50">
                        <p className="pl-4 text-sm">blogs</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="/ahiadmin/create/blog">Create blog</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Edit blog</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Remove blog</a>
                            </ul>
                        </nav>                    
                    </div>
                    
                    <div className="w-49/50">
                        <p className="pl-4 text-sm">product</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Create Product</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Edit Product</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Remove Product</a>
                            </ul>
                        </nav>                    
                    </div>
                                        
                    <div className="w-49/50">
                        <p className="pl-4 text-sm">promotion</p>
                        <nav>
                            <ul className="flex flex-col gap-2 justify-center items-center">
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Create Promotion</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Edit Promotion</a>
                                <a className="bg-(--secondary) w-11/12 text-center text-sm rounded-xl duration-300 hover:bg-(--secondary)/80" href="">Remove Promotion</a>
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
        <div className="w-[70%]">
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