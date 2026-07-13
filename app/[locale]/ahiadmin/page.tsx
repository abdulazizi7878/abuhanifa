import Header from "@/components/header";
import Footer from "@/components/footer";
import AdminPage from "@/components/admin";
import {VeriifyToken} from "../../../lib/jwt";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function adminPage() {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if(!token){
        redirect("/signin");
    }

    let user;

    try{
        user = await VeriifyToken(token)
    } catch{
        redirect("/signin")
    }

    if(user.role !== "admin"){
        redirect("/403");
    }

    return(
        <>
        <Header />  

           <main className="flex flex-col justify-start items-center p-2  md:w-screen md:h-screen lg:w-screen lg:h-screen">
                 <AdminPage />
           </main>
           <div className="md:hidden lg:hidden">
                <Footer/>
           </div>
           
        </>
    )
}
