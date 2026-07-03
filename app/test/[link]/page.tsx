import Blog from "@/components/blog";
import Blogs from "@/components/blogs";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function OneBlog(params) {
    const slug = await params?.params;
    const link = await slug?.link;

    return(
        <>
        <Header />
           <main className="mt-34 flex flex-col justify-center items-center pb-10">
              <Blog link={link} />
              <Blogs />
           </main>
           <Footer />
        </>
    )
}