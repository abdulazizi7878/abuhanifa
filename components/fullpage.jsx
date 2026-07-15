import Header from "@/components/header";
import Footer from "@/components/footer";
import Reviews from "@/components/reviews";
import { useTranslations } from "next-intl";
import Telegram from "./telegram";

export default function FullPage(){
    return(
        <>
            <Header />
            <main className="mt-25 flex justify-center items-center w-full" >
                 <Cont />
                 <Telegram />
            </main>
            <Footer />
        </>
    )
}




function Cont(){

    const t = useTranslations("home");

    return(
        <div className="flex flex-col justify-center items-center w-full">
            <section className="w-11/12 my-10 flex flex-wrap gap-y-20 ">

                <div className="md:w-1/2 lg:w-1/2 flex justify-center items-center">

                    <div className=" flex flex-col">
                        <div>
                            <h1 className="text-4xl my-2 font-(family-name:--secondary-font) ">
                                {t("title")} 
                            </h1>
                            <hr  />
                            <h2 className="text-xl mt-6 mb-2 ">
                                {t("sub-title")}
                            </h2>        
                            <p className="mt-6 text-md">
                                {t("description")}
                            </p>

                                                        
                        </div>

                        <div className="mt-6 flex flex-wrap gap-4">

                            <div className="w-fit px-6 py-2 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                                <span className="text-white text-sm">
                                    {t("Get In touch")}
                                </span>
                                <a href="/order" className="absolute inset-0" ></a>
                            </div>

                            <div className="w-fit px-6 py-2 border border-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                                <span className="text-(--primary) text-sm">
                                    {t("Learn More")}
                                </span>
                                <a href="#services" className="absolute inset-0" ></a>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="hidden md:w-1/2 lg:w-1/2 md:flex justify-center items-center">
                    <img src="/images/logo.jpg" className="rounded-full size-60" />
                </div>
            </section>


            <hr className="my-2" />

            <section className="my-10 w-11/12  bg-purple-950/60 px-6 py-8 rounded-4xl " id="mission">
                <div className="flex flex-col gap-6">
                    <p className="mx-auto text-sm  text-white bg-(--primary) px-6 py-1 rounded-2xl">
                        {t("Our Mission")}
                    </p>
                    <p className="mx-auto text-md text-center text-white">
                        {t("mission")}
                    </p>
                    <div className="w-fit mx-auto px-6 py-2 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-white text-sm">
                            {t("Get In touch")}
                        </span>
                        <a href="/order" className="absolute inset-0" ></a>
                    </div>
                </div>
            </section>

            <section id="services" className="w-11/12">
                <div className="w-full">
                    <p className="text-sm">{t("OUR SERVICES")}</p>
                    <hr />
                </div>
                <div className="flex flex-wrap my-10 gap-x-16 gap-y-10  justify-center items-center">
                    <Service imgSource={"a.webp"} title={t("Full Installations")} description={t("service 1")} />  
                    <Service imgSource={"b.jpg"} title={t("Circuit Breaker")} description={t("service 2")} />  
                    <Service imgSource={"d.jpeg"} title={t("Lighting Design")} description={t("service 3")} />  
                    <Service imgSource={"h.jpeg"} title={t("Water Heaters & Pumps")} description={t("service 4")} />  
                    <Service imgSource={"g.jpg"} title={t("Sanitary & Layout Design")} description={t("service 5")} />  
                    <Service imgSource={"f.jpeg"} title={t("Plumbing Services")} description={t("service 6")} />  

                </div>
                
            </section>

            <section className="my-20 flex flex-col gap-y-6">
                
                <div className="flex">
                    <h1 className="mx-auto text-center text-2xl font-extrabold">
                        {t("Our Commitment to Excellence")}
                    </h1>
                </div>

                <div className="w-11/12 flex flex-wrap justify-center gap-y-8 mx-auto md:gap-x-10 lg:gap-x-10">
                    <p className="text-center text-md sm:w-1/2 md:w-2/3 lg:1/3">
                        {t("commitment")}
                    </p>
                </div>
            </section>

            <section className="my-26 py-20  items-center bg-purple-950/60 w-full">
                     <div>
                          <h1 className="text-4xl font-black text-white mx-2"></h1>
                     </div>
            </section>

            <section className="my-26" id="why">
                <div className="flex flex-col justify-center items-center gap-y-10">

                    <div className="flex mx-auto">
                        <h1 className="text-center font-black text-xl">
                            {t("why abu hanifa installation")}                            
                        </h1>
                    </div>

                    <div className="w-29/30  py-4 flex flex-col justify-center items-center gap-y-8">

                        <Why text={t("why 1")} dir={"_AY"} />
                        <Why text={t("why 2")} dir={"_AY"} />
                        <Why text={t("why 3")} dir={"_AY"} />
                        <Why text={t("why 4")} dir={"_AY"} />
                        <Why text={t("why 5")} dir={"_AY  "} />

                    </div>

                    <div className="flex flex-col sm:flex-wrap md:flex-wrap lg:flex-wrap  justify-around items-center gap-4">
                             
                        <div className="_AY w-fit px-6 py-4 bg-purple-950/60 shadow-xl shadow-foreground/40 rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                            <span className="text-white text-sm">
                                {t("join")}
                            </span>
                            <a href="https://t.me/ahieth" className="absolute inset-0" ></a>
                        </div>

                        <div className="_AY w-fit px-6 py-4 bg-purple-950/60 shadow-xl shadow-foreground/40 rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                            <span className="text-white text-sm">
                                {t("order")}
                            </span>
                            <a href="/order" className="absolute inset-0" ></a>
                        </div>                    
                    </div>
                </div>
            </section>

            <section className="my-20 flex flex-col w-11/12">
                <div className="mx-auto w-11/12">
                    <h1 className="text-center font-bold text-xl">
                       {t("review")}
                    </h1>
                </div>

                <div className="w-full mx-auto px-4 py-10 flex flex-wrap justify-center items-center gap-10">
                    <Reviews />
                </div>
            </section>

            <section className="my-20 flex flex-col gap-10">
                <div>
                    <h1 className="font-black text-3xl text-center">
                        "{t("profile")}"
                    </h1>    
                </div> 

                <div className="mx-auto max-w-[92%] md:w-5/9 w-auto py-6 px-10 border border-(--border) duration-200 hover:shadow-lg rounded-2xl">
                    <div className="">
                        <img src="/images/profile-1.jpg" alt="OWNER'S IMAGE" className="size-35 rounded-full" />
                    </div>
                    <hr className="my-4"/>
                    <div>
                        <p className="my-2 text-sm">
                            {t("intro")}
                        </p>
                        <p className="font-black text-md">
                            {t("My professions")}:
                        </p>
                        <ul className="my-2">
                            <li className="_LI _AY text-sm">{t("p1")}</li>
                            <li className="_LI _AY text-sm">{t("p2")}</li>
                            <li className="_LI _AY text-sm">{t("p3")}</li>
                            <li className="_LI _AY text-sm">{t("p4")}</li>
                            <li className="_LI _AY text-sm">{t("p5")}</li>
                            <li className="_LI _AY text-sm">{t("p6")}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="flex flex-col justify-center items-center mt-20 bg-(--primary) h-screen w-full  relative">

                <div className="mx-auto  w-11/12">
                    <h1 className="text-white text-5xl _AY">
                        {t("Let's work together")}
                    </h1>                    
                </div>

                <div className="mx-auto flex gap-6  w-11/12 my-10">
                    <div className="_AXX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-black">
                            {t("contact")} 
                        </span>
                        <a href="/contact" className="absolute inset-0" ></a>
                    </div>  
                    
                    <div className="_AX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-black">
                            {t("order")}
                        </span>
                        <a href="/order" className="absolute inset-0" ></a>
                    </div>  
                </div>

                <div className="absolute bottom-4">
                    <h1 className="font-black bg-background text-foreground py-2 px-6 rounded-full">&copy;{t("ahi")}</h1>
                </div>
            </section>
        </div>

    )
}


function Service({imgSource, title, description}){
    return(
        <div className="_AY border border-(--border) w-96 overflow-hidden rounded-4xl px-8 py-6 relative z-6 flex flex-col justify-center items-start hover:shadow-lg hover:shadow-black/10 ">
            <div className="mb-4 w-full">
                <img src={`/images/demo-1-${imgSource}`} alt="SERVICE_PHOTO" className="size-16 rounded-2xl" />

                <div className="absolute -top-4 right-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>

                <hr  className="border-(--border) my-2" />
            </div>
            <div className="relative">
                <h2 className="font-bold mb-2">
                    {title}
                </h2>
                <p className="font-extralight">
                    {description}
                </p>
                <div className="absolute -bottom-20 left-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>
            </div>
        </div>
    )
}


function Img({src}){
    return(
        <div className="relative w-60 max-h-100">
            <img src={`/images/w-${src}.jpg`} className="w-full h-full rounded-2xl" alt="OUR_WORKS" /> 
            <div className="absolute inset-0 bg-foreground/20  rounded-2xl"></div>                           
        </div>
    )
}
function Why({text, dir}){
    return(
        <div className={`${dir} max-w-[99%] w-11/12 flex flex-col gap-2  md:w-[90vw] lg:w-[70vw] border border-(--border) bg-purple-950/60 p-4 rounded-full duration-300 hover:shadow-2xl hover:shadow-foreground/50`}> 
            <p className="text-center text-white text-sm sm:text-md md:text-lg lg:text-lg ">{text}.</p>
        </div>
    )
}
