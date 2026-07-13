import Heaader from "@/components/header";
import Footer from "@/components/footer";
import OrderProduct from "@/components/productorderpage";


export default async function orderproduct({params}){

    const {link} = await params;
    
    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-start items-center py-20 mt-10 min-h-[70vh]">
            <OrderProduct link={link} />
        </main>
        <Footer />
        </>
    )
}


