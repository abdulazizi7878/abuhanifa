import CreateBlog from "@/components/createBlog";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CreateProduct from "@/components/createProduct";
import CreatePromotion from "@/components/createPromotion";
import NotFound from "@/components/notfound";

export default async function createLinked({params}) {
    const {slug} = await params;
    
    const pages = {
        blog: <CreateBlog/>,
        product: <CreateProduct />,
        promotion: <CreatePromotion/>
    }

    return(
        <>
            <Header />
            <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh]">
                {
                    (pages[slug] ? (pages[slug]) : <NotFound page={slug} />)
                }
            </main>
            <Footer />
            
        </>
    )
}