"use client"


export default function AdminPage(){
    return(
        <div className="flex justify-center items-start  w-full min-h-[70vh]">
            <AdminMainSm />
        </div>
    )
}




function AdminMainSm(){
    return(
        <div className="mt-25 w-full flex flex-col justify-center items-center gap-y-6">
            <div>
                <h1 className="text-2xl">Welcome to Admin Page</h1>
            </div>
            <div className="w-full flex flex-wrap justify-center items-center gap-6">
                <LinkDivs text={"Create Blog"} link={"/ahiadmin/create/blog"}  />
                <LinkDivs text={"Create Promotion"} link={"/ahiadmin/create/promotion"}  />
                <LinkDivs text={"Create Product"} link={"/ahiadmin/create/product"}  />
                <LinkDivs text={"View Blogs"} link={"/ahiadmin/view/blog"}  />
                <LinkDivs text={"View Comments & messages"} link={"/ahiadmin/view/comments"}  />
                <LinkDivs text={"View Job and Product Orders"} link={"/ahiadmin/view/orders"}  />
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