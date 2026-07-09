import Heaader from "@/components/header";
import Footer from "@/components/footer";
import OneProduct from "@/components/product";
import ProductsPage from "@/components/products";


export default async function product({params}){

    const {link} = await params;
    
    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-center items-center py-20 mt-6 min-h-[70vh]">
            <OneProduct link={link} />
            <hr />
            <ProductsPage />
        </main>
        <Footer />
        </>
    )
}