import Header from "@/components/header";
import Footer from "@/components/footer";
import ViewComments from "@/components/viewComments";
import ViewOrders from "@/components/viewOrders";
import ViewProducts from "@/components/viewProducts";
import ViewPromotions from "@/components/viewPromotions";
import NotFound from "@/components/notfound";

export default async function view({params}) {
    const {slug} = await params;

    const avPage = {
        comments: <ViewComments/>,
        orders:<ViewOrders />,
        products: <ViewProducts />,
        promotions:<ViewPromotions />
    };

    return(
        <>
        <Header />
        <main className="flex flex-col justify-start items-center py-20 mt-10 min-h-[70vh]">
            {
                (avPage[slug] ? (avPage[slug]) : (<NotFound page={slug} />))
            }
        </main>
        <Footer />
        </>
    )
}