import Header from "@/components/header";
import Footer from "@/components/footer";
import BlogPage from "@/components/blogPage";
import AdminPage from "@/components/admin";
import OrderPage from "@/components/order";
import NotFound from "../not-found";
import ContactPage from "@/components/contact";

export default async function Slug(params) {

    const slug = await params?.params;
    const cslug = await slug?.slug;

    console.log(cslug)

    return(
        <>
            <Header />

            <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh] ">
                {
                    (
                        (cslug === "blog") ? (<BlogPage />) : 
                        (cslug === "ahiadmin" ? (<AdminPage />) : 
                        (cslug === "order") ? (<OrderPage/>) : 
                        (cslug === "contact") ? (<ContactPage/>) : <NotFound pg={cslug} />)    
                    )
                }
            </main>

            <Footer />
        </>
    )
}