import Header from "@/components/header";
import Footer from "@/components/footer";
import NotFound from "@/components/notfound";
import EditProducts from "@/components/editProduct";
import EditBlogs from "@/components/editBlogs";

export default async function editthings({params}) {
    const {link} = await params;
    const {slug} = await params;

    const pages = {
        products: <EditProducts link={link} />,
        blogs: <EditBlogs link={link} />
    }
    
    return(
        <>
        <Header />
            <main className="flex flex-col justify-start items-center py-20 mt-10 min-h-[70vh]">
                {
                    (pages[slug] ? (pages[slug]) : ( <NotFound page={slug} />))
                }
            </main>
        <Footer />

        </>
    )
}

