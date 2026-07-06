import Heaader from "@/components/header";
import Footer from "@/components/footer";
import Blog from "@/components/blog";
import Blogs from "@/components/blogs";


type PageProps = {
  params: Promise<{
    link: string;
  }>;
};

export default async function blog({params}:PageProps){

    const {link} = await params;
    

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