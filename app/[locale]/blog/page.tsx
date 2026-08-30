import Heaader from "@/components/header";
import Footer from "@/components/footer";
import BlogPage from "@/components/blogPage";

export default function blogpage(){
    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-center items-center min-h-[70vh]">
            <BlogPage />
        </main>
        <Footer />
        </>
    )
}