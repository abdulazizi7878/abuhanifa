import Heaader from "@/components/some";
import Footer from "@/components/footer";
import Blog from "@/components/blog";
import Blogs from "@/components/blogs";

export default async function blog(params){

    const slug = await params?.params;
    const link = await slug?.link;

    console.log(link);
    

    return(
        <>
        <Heaader />
        <main className="flex flex-col justify-center items-center py-20 mt-10 min-h-[70vh]">
            <Blog link={link} />
            <Blogs />
        </main>
        <Footer />
        </>
    )
}