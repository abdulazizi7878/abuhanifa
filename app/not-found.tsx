import Header from "@/components/header";
import Footer from "@/components/footer";


export default async function NotFound(){


    return( 
        <>
           <Header />

           <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh]">
                <div className="flex flex-col justify-center items-center gap-6">
                    <img src="/not-found.svg" className="w-100" alt="" />
                    <h1 className="text-center">
                        Page : /<br />
                        404 | The page you are looking for couldn't be found 
                    </h1>        
                    <a href="/" className="font-black bg-foreground text-background py-2 px-6 rounded-full">&copy;Abu-Hanifa Installation</a>
                </div>               
           </main>


            <Footer />     
        </>


    )
}