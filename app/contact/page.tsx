import Heaader from "@/components/some";
import Footer from "@/components/footer";
import ContactPage from "@/components/contact";

export default function contact(){
    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh]">
            <ContactPage />
        </main>
        <Footer />
        </>
    )
}