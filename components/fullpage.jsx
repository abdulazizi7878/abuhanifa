"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Reviews from "@/components/reviews";
import { useTranslations } from "next-intl";
import FloatingButtons from "./floatingButtons";

// Centralized image paths & placeholders
const HERO_GALLERY_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    alt: "Electrical Installation Work",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    alt: "Plumbing and Pipe Assembly",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    alt: "Engineering Construction Site",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    alt: "Circuit Breaker Maintenance",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=800&auto=format&fit=crop",
    alt: "Building Architectural Wiring",
  },
];

const FINISHED_WORKS_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    titleKey: "work_1_title",
    alt: "Modern Interior Lighting Project",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    titleKey: "work_2_title",
    alt: "Industrial Electrical Breaker Box",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    titleKey: "work_3_title",
    alt: "Sanitary & Water Line Installation",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    titleKey: "work_4_title",
    alt: "Commercial Infrastructure Wiring",
  },
];





const HERO_CTA_BG_IMAGE = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop";

export default function FullPage(){
    return(
        <>
            <Header />
            <main className="flex justify-center items-center w-full" >
                 <Cont />
                 <FloatingButtons />
            </main>
            <Footer />
        </>
    )
}

function Cont(){
    const [productPreviews, setProductPreviews] = useState();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(false);

    async function GetProductsPreview() {
        try{
            const result = await fetch("/api/preview", { method: "GET" });
            const data = await result.json();
            setProductPreviews(data);
        } catch(err){
            setErrors(true);
        } finally{
            setLoading(false);
        }    
    }

    useEffect(()=>{
        GetProductsPreview()
    },[])

    const t = useTranslations("home");

    return(
        <div className="flex flex-col justify-center items-center w-full overflow-hidden">

            <HeroSection />

            {/* 1. TOP HORIZONTALLY SCROLLABLE GALLERY */}
            <section className="w-11/12 my-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        {t("Installation Showcase")}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                        {t("Swipe or scroll")}
                    </span>
                </div>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 w-full">
                    {HERO_GALLERY_IMAGES.map((img) => (
                        <div key={img.id} className="snap-center shrink-0 w-64 md:w-80 h-44 relative group rounded-2xl overflow-hidden border border-(--border)">
                            <img 
                                src={img.url} 
                                alt={img.alt} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                        </div>
                    ))}
                </div>
            </section>

            <hr className="my-2 w-11/12" />

            <section className="my-10 w-11/12 bg-(--primary) px-6 py-8 rounded-4xl " id="mission">
                <div className="flex flex-col gap-6">
                    <p className="mx-auto text-sm text-black bg-white px-6 py-1 rounded-2xl">
                        {t("Our Mission")}
                    </p>
                    <p className="mx-auto text-md text-center text-white">
                        {t("mission")}
                    </p>
                    <div className="w-fit mx-auto px-6 py-2 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                        <span className="text-black  text-sm">
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
                <div className="flex flex-wrap my-10 gap-x-16 gap-y-10 justify-center items-center">
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

            {/* 2. FINISHED WORKS SECTION (Replaces Blank Section) */}
            <section className="my-26 py-20 items-center bg-(--primary) w-full px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-3">
                        {t("Finished Works")}
                    </h1>
                    <p className="text-white/80 text-center max-w-2xl mb-12 text-sm md:text-base">
                        {t("finished_works_description")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {FINISHED_WORKS_IMAGES.map((work) => (
                            <div key={work.id} className="group relative rounded-3xl overflow-hidden bg-black/30 border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                <div className="h-56 w-full overflow-hidden relative">
                                    <img 
                                        src={work.url} 
                                        alt={work.alt} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-(--primary)-950/90 via-(--primary)-950/30 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />
                                </div>
                                <div className="p-4 absolute bottom-0 left-0 right-0">
                                    <h3 className="text-white font-bold text-sm sm:text-base">
                                        {t(work.titleKey)}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PRODUCTS PREVIEW SECTION */}
            <section className="my-20 w-11/12 flex flex-col items-center">
                <div className="w-full text-center mb-10">
                    <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-1">
                        {t("Equipment & Materials")}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black">
                        {t("Featured Products Preview")}
                    </h2>
                </div>

                {
                    (errors.length > 0) ? 
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">Loading products failed!</span>
                        </div> : (loading) ? 
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">Loading products...</span>
                        </div> : (productPreviews.length > 0) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
                                {productPreviews?.map((product) => (
                                    <div key={product.id} className="border border-(--border) rounded-3xl p-4 flex flex-col justify-between bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                        <div>
                                            <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 bg-muted relative">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="font-bold text-sm mb-1 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : 
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">No products found!</span>
                        </div>
                        }



                <div className="mt-10">
                    <div className="w-fit px-8 py-3 bg-(--primary) rounded-4xl cursor-pointer relative duration-300 hover:px-10 shadow-lg">
                        <span className="text-white text-sm font-semibold">
                            {t("View All Products")}
                        </span>
                        <a href="/products" className="absolute inset-0"></a>
                    </div>
                </div>
            </section>

            <section className="my-26" id="why">
                <div className="flex flex-col justify-center items-center gap-y-10">
                    <div className="flex mx-auto">
                        <h1 className="text-center font-black text-xl">
                            {t("why abu hanifa installation")}                            
                        </h1>
                    </div>

                    <div className="w-29/30 py-4 flex flex-col justify-center items-center gap-y-8">
                        <Why text={t("why 1")} dir={"_AY"} />
                        <Why text={t("why 2")} dir={"_AY"} />
                        <Why text={t("why 3")} dir={"_AY"} />
                        <Why text={t("why 4")} dir={"_AY"} />
                        <Why text={t("why 5")} dir={"_AY  "} />
                    </div>

                    <div className="flex flex-col sm:flex-wrap md:flex-wrap lg:flex-wrap justify-around items-center gap-4">
                        <div className="_AY w-fit px-6 py-4 bg-(--primary) shadow-xl shadow-foreground/40 rounded-4xl cursor-pointer relative duration-300 hover:px-8">
                            <span className="text-white text-sm">
                                {t("join")}
                            </span>
                            <a href="https://t.me/ahieth" className="absolute inset-0" ></a>
                        </div>

                        <div className="_AY w-fit px-6 py-4 bg-(--primary) shadow-xl shadow-foreground/40 rounded-4xl cursor-pointer relative duration-300 hover:px-8">
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
                    <div>
                        <img src="/images/profile-1.jpg" alt="OWNER'S IMAGE" className="size-35 rounded-full object-cover" />
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
                            <li className="_LI text-sm">{t("p1")}</li>
                            <li className="_LI text-sm">{t("p3")}</li>
                            <li className="_LI text-sm">{t("p4")}</li>
                            <li className="_LI text-sm">{t("p5")}</li>
                            <li className="_LI text-sm">{t("p6")}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. BACKGROUND PHOTO ON "Let's work together" SECTION */}
            <section className="flex flex-col justify-center items-center mt-20 h-screen w-full relative overflow-hidden">
                <img 
                    src={HERO_CTA_BG_IMAGE} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                
                <div className="absolute inset-0 bg-black/60 opacity-85 z-0"></div>
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                <div className="mx-auto w-11/12 relative z-10 text-center">
                    <h1 className="text-white text-5xl font-black _AY">
                        {t("Let's work together")}
                    </h1>                    
                </div>

                <div className="mx-auto flex justify-center gap-6 w-11/12 my-10 relative z-10">
                    <div className="_AXX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8 shadow-md">
                        <span className="text-black font-semibold">
                            {t("contact")} 
                        </span>
                        <a href="/contact" className="absolute inset-0" ></a>
                    </div>  
                    
                    <div className="_AX w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative duration-300 hover:px-8 shadow-md">
                        <span className="text-black font-semibold">
                            {t("order")}
                        </span>
                        <a href="/order" className="absolute inset-0" ></a>
                    </div>  
                </div>

                <div className="absolute bottom-4 z-10">
                    <h1 className="font-black bg-background text-foreground py-2 px-6 rounded-full">&copy;{t("ahi")}</h1>
                </div>
            </section>
        </div>
    )
}

const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop";

function HeroSection() {
     const t = useTranslations("home");

    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-16 lg:py-24 mb-10 text-white">
            {/* Background Image Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
                style={{ backgroundImage: `url('${HERO_BG_IMAGE}')` }}
                aria-hidden="true"
            />

            {/* Dark Translucent Overlay */}
            <div 
                className="absolute inset-0 bg-linear-to-r from-black/80 via-black/70 to-black/50 backdrop-blur-[2px]" 
                aria-hidden="true"
            />

            {/* Hero Content Layer */}
            <div className="relative z-10 w-11/12 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">
                
                {/* Left Column: Text & CTAs */}
                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-(family-name:--secondary-font) drop-shadow-md">
                        {t("title")}
                    </h1>

                    <div className="w-20 h-1 bg-(--primary) my-6 rounded-full" />

                    <h2 className="text-xl sm:text-2xl font-medium text-gray-200">
                        {t("sub-title")}
                    </h2>

                    <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                        {t("description")}
                    </p>

                    {/* CTAs */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <div className="w-fit px-8 py-3.5 bg-(--primary) hover:bg-(--primary)/90 rounded-full cursor-pointer relative duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                            <span className="text-white text-sm sm:text-base font-semibold tracking-wide">
                                {t("Get In touch")}
                            </span>
                            <a href="/order" className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary) rounded-full">
                                <span className="sr-only">{t("Get In touch")}</span>
                            </a>
                        </div>

                        <div className="w-fit px-8 py-3.5 border-2 border-white/80 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full cursor-pointer relative duration-300 shadow-md hover:scale-105 active:scale-95 transition-all">
                            <span className="text-white text-sm sm:text-base font-semibold tracking-wide">
                                {t("Learn More")}
                            </span>
                            <a href="#services" className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-full">
                                <span className="sr-only">{t("Learn More")}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Logo Visual */}
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <div className="relative group">
                        {/* Decorative glow ring */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-(--primary) to-white/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
                        
                        <img
                            src="/images/logo.jpg"
                            alt="Abu Hanifa Installation Logo"
                            className="relative rounded-full size-48 sm:size-60 lg:size-72 object-cover border-4 border-white/20 shadow-2xl"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

function Service({imgSource, title, description}){
    return(
        <div className="_AY border border-(--border) w-96 overflow-hidden rounded-4xl px-8 py-6 relative z-6 flex flex-col justify-center items-start hover:shadow-lg hover:shadow-black/10 ">
            <div className="mb-4 w-full">
                <img src={`/images/demo-1-${imgSource}`} alt="SERVICE_PHOTO" className="size-16 rounded-2xl object-cover" />

                <div className="absolute -top-4 right-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl object-cover" alt="" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>

                <hr className="border-(--border) my-2" />
            </div>
            <div className="relative">
                <h2 className="font-bold mb-2">
                    {title}
                </h2>
                <p className="font-extralight">
                    {description}
                </p>
                <div className="absolute -bottom-20 left-[-15%] -z-1">
                    <img src={`/images/demo-1-${imgSource}`} className="w-60 h-30 z-2 rounded-4xl object-cover" alt="" />
                    <div className="bg-background/75 absolute inset-0 rounded-4xl"></div>
                </div>
            </div>
        </div>
    )
}

function Why({text, dir}){
    return(
        <div className={`${dir} max-w-[99%] w-11/12 flex flex-col gap-2 md:w-[90vw] lg:w-[70vw] border border-(--border) bg-(--primary) p-4 rounded-full duration-300 hover:shadow-2xl hover:shadow-foreground/50`}> 
            <p className="text-center text-white text-sm sm:text-md md:text-lg lg:text-lg ">{text}.</p>
        </div>
    )
}