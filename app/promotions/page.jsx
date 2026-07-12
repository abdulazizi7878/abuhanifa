import Heaader from "@/components/header";
import Footer from "@/components/footer";
import Promotions from "@/components/promotions";

export default function blogpage(){
    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-start items-center py-20 mt-4 min-h-[70vh]">
            <Promotions />
        </main>
        <Footer />
        </>
    )
}