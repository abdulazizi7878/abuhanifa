import Header from "@/components/header";
import Footer from "@/components/footer";
import AdminPage from "@/components/admin";

export default function adminPage() {
    return(
        <>
            
           <div className="md:hidden lg:hidden">
                <Header />  
           </div>

           <main className="flex flex-col justify-start items-center py-4 px-4  md:w-screen md:h-screen lg:w-screen lg:h-screen">
                 <AdminPage />
           </main>
           <div className="md:hidden lg:hidden">
                <Footer/>
           </div>
           
        </>
    )
}