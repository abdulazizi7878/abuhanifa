"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Reviews from "@/components/reviews";
import { useTranslations } from "next-intl";
import FloatingButtons from "./floatingButtons";
import ImageSlider from "@/components/ImageSlider";
import { motion } from "motion/react";

// Centralized image paths & placeholders
const HERO_GALLERY_IMAGES = [
  {
    id: 1,
    url: "/images/hero/sec-1.jpg",
    alt: "Electrical Engineering and Installation",
  },
  {
    id: 2,
    url: "/images/hero/electrical-1.jpg",
    alt: "Electrical Installation Work",
  },
  {
    id: 3,
    url: "/images/hero/plumbing-1.jpg",
    alt: "Plumbing Installation Work",
  },
  {
    id: 4,
    url: "/images/hero/plumbing-2.jpg",
    alt: "Plumbing Installation Work",
  },
  {
    id: 5,
    url: "/images/hero/electrical-2.jpg",
    alt: "Electrical Installation Work",
  },
  {
    id: 6,
    url: "/images/hero/plumbing-3.jpg",
    alt: "Plumbing Installation Work",
  },
  {
    id: 7,
    url: "/images/finished_works/electrical-8.jpg",
    alt: "Plumbing Installation Work",
  },
  {
    id: 8,
    url: "/images/finished_works/electrical-13.jpg",
    alt: "Plumbing Installation Work",
  },
];

const FINISHED_WORKS_IMAGES = [
  {
    id: 1,
    url: "/images/finished_works/electrical-1.jpg",
    titleKey: "work_1_title",
    alt: "Industrial Electrical Breaker Box",
  },
  {
    id: 2,
    url: "/images/finished_works/electrical-11.jpg",
    titleKey: "work_2_title",
    alt: "Industrial Electrical Breaker Box",
  },
  {
    id: 3,
    url: "/images/finished_works/plumbing-1.jpg",
    titleKey: "work_3_title",
    alt: "Sanitary & Water Line Installation",
  },
  {
    id: 4,
    url: "/images/finished_works/electrical-13.jpg",
    titleKey: "work_4_title",
    alt: "Commercial Infrastructure Wiring",
  },
  {
    id: 5,
    url: "/images/finished_works/plan.jpg",
    titleKey: "work_5_title",
    alt: "Industrial Electrical Breaker Box",
  },
  {
    id: 6,
    url: "/images/finished_works/plumbing-2.jpg",
    titleKey: "work_6_title",
    alt: "Industrial Electrical Breaker Box",
  },
  {
    id: 7,
    url: "/images/finished_works/electrical-6.jpg",
    titleKey: "work_7_title",
    alt: "Industrial Electrical Breaker Box",
  },
];

const HERO_CTA_BG_IMAGE = "/images/finished_works/electrical-3.jpg";
//"https://img.magnific.com/premium-photo/man-repairing-electrical-system-house-office-electrician-checking-electric-scheme_106035-1624.jpg?ga=GA1.1.1344955290.1778578455&semt=ais_hybrid&w=740&q=80";
//"https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop";

export default function FullPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center w-full">
        {/* Reusable Image Slider at top */}
        <Cont />
        <FloatingButtons />
      </main>
      <Footer />
    </>
  );
}

function Cont() {
  const [productPreviews, setProductPreviews] = useState();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);

  async function GetProductsPreview() {
    try {
      const result = await fetch("/api/preview", { method: "GET" });
      const data = await result.json();
      setProductPreviews(data);
    } catch (err) {
      setErrors(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetProductsPreview();
  }, []);

  const t = useTranslations("home");

  return (
    <div className="flex flex-col justify-center items-center w-full overflow-hidden">
      <HeroSection />

      {/* 1. TOP HORIZONTALLY SCROLLABLE GALLERY */}
      <section className="w-11/12 my-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-4"
        >
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {t("Installation Showcase")}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {t("Swipe or scroll")}
          </span>
        </motion.div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 w-full">
          {HERO_GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="snap-center shrink-0 w-64 md:w-80 h-44 relative group rounded-2xl overflow-hidden border border-(--border)"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="my-2 w-11/12 border-(--border)" />

      {/* MISSION SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="my-10 w-11/12 bg-(--primary) px-6 py-8 rounded-4xl"
        id="mission"
      >
        <div className="flex flex-col gap-6">
          <p className="mx-auto text-sm text-black bg-white px-6 py-1 rounded-2xl font-semibold">
            {t("Our Mission")}
          </p>
          <p className="mx-auto text-md text-center text-white max-w-3xl leading-relaxed">
            {t("mission")}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit mx-auto px-6 py-2 bg-white rounded-4xl cursor-pointer relative duration-300"
          >
            <span className="text-black text-sm font-medium">
              {t("Get In touch")}
            </span>
            <a href="/order" className="absolute inset-0"></a>
          </motion.div>
        </div>
      </motion.section>

      {/* SERVICES SECTION */}
      <section id="services" className="w-11/12">
        <div className="w-full my-6">
          <p className="text-sm font-semibold">{t("OUR SERVICES")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Service
            imgSource={"a.webp"}
            title={t("Full Installations")}
            description={t("service 1")}
          />
          <Service
            imgSource={"b.jpg"}
            title={t("Circuit Breaker")}
            description={t("service 2")}
          />
          <Service
            imgSource={"d.jpeg"}
            title={t("Lighting Design")}
            description={t("service 3")}
          />
          <Service
            imgSource={"h.jpeg"}
            title={t("Water Heaters & Pumps")}
            description={t("service 4")}
          />
          <Service
            imgSource={"f.jpg"}
            title={t("Sanitary & Layout Design")}
            description={t("service 5")}
          />
          <Service
            imgSource={"i.jpg"}
            title={t("Plumbing Services")}
            description={t("service 6")}
          />
        </div>
      </section>

      {/* EXCELLENCE COMMITMENT SECTION */}
      <section className="my-20 flex flex-col gap-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex"
        >
          <h1 className="mx-auto text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {t("Our Commitment to Excellence")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-11/12 flex flex-wrap justify-center gap-y-8 mx-auto md:gap-x-10 lg:gap-x-10"
        >
          <p className="text-center text-md sm:w-1/2 md:w-2/3 lg:1/3 leading-relaxed text-muted-foreground">
            {t("commitment")}
          </p>
        </motion.div>
      </section>

      {/* 2. FINISHED WORKS SECTION */}
      <section className="my-26 py-20 items-center bg-(--primary) w-full px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-3 tracking-tight"
          >
            {t("Finished Works")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-center max-w-2xl mb-12 text-sm md:text-base"
          >
            {t("finished_works_description")}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {FINISHED_WORKS_IMAGES.map((work, idx) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl overflow-hidden bg-black/30 border border-white/10 shadow-xl"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS PREVIEW SECTION */}
      <section className="my-20 w-11/12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full text-center mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-(--primary) font-semibold mb-1">
            {t("Equipment & Materials")}
          </p>
          <h2 className="text-2xl md:text-3xl font-black">
            {t("Featured Products Preview")}
          </h2>
        </motion.div>

        {errors ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">Loading products failed!</span>
          </div>
        ) : loading ? (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-2xl relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">Loading products...</span>
          </div>
        ) : productPreviews?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            {productPreviews.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="border border-(--border) rounded-3xl p-4 flex flex-col justify-between bg-background hover:shadow-xl transition-all duration-300 group"
              >
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-2xl relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">No products found!</span>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10"
        >
          <div className="w-fit px-8 py-3 bg-(--primary) rounded-4xl cursor-pointer relative shadow-lg">
            <span className="text-white text-sm font-semibold">
              {t("View All Products")}
            </span>
            <a href="/products" className="absolute inset-0"></a>
          </div>
        </motion.div>
      </section>

      {/* WHY SECTION */}
      <section className="my-26" id="why">
        <div className="flex flex-col justify-center items-center gap-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex mx-auto"
          >
            <h1 className="text-center font-black text-2xl sm:text-3xl">
              {t("why abu hanifa installation")}
            </h1>
          </motion.div>

            {/* Modern Responsive Grid replacing the stacked list */}
            <div className="w-11/12 max-w-6xl mx-auto py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Why text={t("why 1")} index={0} />
            <Why text={t("why 2")} index={1} />
            <Why text={t("why 3")} index={2} />
            <Why text={t("why 4")} index={3} />
            {/* The 5th item spans across remaining columns on larger screens for balance */}
            <div className="md:col-span-2 lg:col-span-2">
                <Why text={t("why 5")} index={4} />
            </div>
            </div>

           <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-fit px-8 py-4 bg-(--primary) shadow-xl rounded-full cursor-pointer relative transition-all"
              >
                <span className="text-white text-sm font-bold tracking-wide">
                  {t("join")}
                </span>
                <a href="https://t.me/ahieth" className="absolute inset-0"><span className="sr-only">{t("join")}</span></a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-fit px-8 py-4 bg-background border border-(--border) shadow-lg rounded-full cursor-pointer relative transition-all"
              >
                <span className="text-foreground text-sm font-bold tracking-wide">
                  {t("order")}
                </span>
                <a href="/order" className="absolute inset-0"><span className="sr-only">{t("order")}</span></a>
              </motion.div>
            </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="flex flex-col w-11/12">
        <div className="w-full mx-auto px-4 py-10 flex flex-wrap justify-center items-center gap-10">
          <Reviews />
        </div>
      </section>

      {/* PROFILE SECTION */}
      <section className="my-20 flex flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="font-black text-3xl sm:text-4xl text-center">
            "{t("profile")}"
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="mx-auto max-w-[92%] md:w-5/9 w-auto py-6 px-10 border border-(--border) rounded-2xl bg-background transition-shadow duration-300"
        >
          <div>
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/images/profile-1.jpg"
              alt="OWNER'S IMAGE"
              className="size-35 rounded-full object-cover border-2 border-(--border)"
            />
          </div>
          <hr className="my-4 border-(--border)" />
          <div>
            <p className="my-2 text-sm text-muted-foreground leading-relaxed">
              {t("intro")}
            </p>
            <p className="font-black text-md mt-4">{t("My professions")}:</p>
            <ul className="my-2 space-y-1">
              <li className="_LI text-sm">{t("p1")}</li>
              <li className="_LI text-sm">{t("p3")}</li>
              <li className="_LI text-sm">{t("p4")}</li>
              <li className="_LI text-sm">{t("p5")}</li>
              <li className="_LI text-sm">{t("p6")}</li>
              <li className="_LI text-sm">{t("p7")}</li>
            </ul>
          </div>
        </motion.div>
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
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl sm:text-6xl md:text-7xl font-black tracking-tight"
          >
            {t("Let's work together")}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto flex justify-center gap-6 w-11/12 my-10 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative shadow-md"
          >
            <span className="text-black font-semibold">{t("contact")}</span>
            <a href="/contact" className="absolute inset-0"></a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit px-6 py-4 bg-white rounded-4xl cursor-pointer relative shadow-md"
          >
            <span className="text-black font-semibold">{t("order")}</span>
            <a href="/order" className="absolute inset-0"></a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-4 z-10">
          <h1 className="font-black bg-background text-foreground py-2 px-6 rounded-full">
            &copy;{t("ahi")}
          </h1>
        </div>
      </section>
    </div>
  );
}

const HERO_BG_IMAGE =
  "/images/hero/hero.jpg";

function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden py-16 mb-10 text-white">
      {/* Background Image Layer */}
      <div
        className="absolute  inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
        style={{ backgroundImage: `url('${HERO_BG_IMAGE}')` }}
        aria-hidden="true"
      />

      {/* Dark Translucent Overlay */}
      <div
        className="absolute inset-0 bg-black/75 opacity-90 transition-all duration-500 scale-105"
        aria-hidden="true"
      />

      {/* Hero Content Layer */}
      <div className="relative z-10 w-11/12 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Text & CTAs */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.5, delay: 0.2 }}
            src="/images/logo.jpg"
            alt="Logo"
            className="size-46 my-6 mx-auto rounded-full object-cover border border-(--border) shadow-md"
          />
        
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-(--primary) drop-shadow-md leading-tight"
          >
            {t("title")}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-2xl font-medium text-white my-3"
          >
            {t("sub-title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-sm sm:text-lg  text-white max-w-xl leading-relaxed"
          >
            {t("description")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit px-8 py-3.5 bg-(--primary) rounded-full cursor-pointer relative shadow-lg"
            >
              <span className="text-white text-sm sm:text-base font-semibold tracking-wide">
                {t("Get In touch")}
              </span>
              <a
                href="/order"
                className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary) rounded-full"
              >
                <span className="sr-only">{t("Get In touch")}</span>
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit px-8 py-3.5 border border-white bg-white/10 backdrop-blur-md rounded-full cursor-pointer relative shadow-md"
            >
              <span className="text-white text-sm sm:text-base font-semibold tracking-wide">
                {t("Learn More")}
              </span>
              <a
                href="#services"
                className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded-full"
              >
                <span className="sr-only">{t("Learn More")}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: ImageSlider with reduced height and subtle/no border */}
        <motion.div
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.6, delay: 0.2 }}
         className="w-full md:w-1/2 flex justify-center items-center"
         >
        {/* Decreased height (e.g., h-[250px] sm:h-[300px] md:h-[350px]) and softened border opacity (border-white/5 or remove border completely) */}
        <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-xl">
            <ImageSlider className="h-125! sm:h-80! md:h-115! md:w-full " />
        </div>
        </motion.div>

      </div>
    </section>
  );
}
function Service({ imgSource, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      className="border border-(--border) w-full overflow-hidden rounded-4xl p-8 relative z-10 flex flex-col justify-between bg-background/60 backdrop-blur-lg hover:shadow-2xl hover:border-(--primary)/40 transition-all duration-300 group"
    >
      <div className="mb-6 w-full flex items-center justify-between">
        <img
          src={`/images/demo-1-${imgSource}`}
          alt="SERVICE_PHOTO"
          className="w-16 h-16 rounded-2xl object-cover border border-(--border) shadow-md group-hover:scale-105 transition-transform duration-300"
        />
        <div className="w-2 h-2 rounded-full bg-(--primary)" />
      </div>
      <div>
        <h2 className="font-bold text-xl mb-3 text-foreground group-hover:text-(--primary) transition-colors">{title}</h2>
        <p className="font-normal text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}



function Why({ text, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="relative p-6 sm:p-8 rounded-3xl bg-background border border-(--border) shadow-sm hover:shadow-xl hover:border-(--primary)/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* Subtle Background Accent Glow */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-(--primary)/5 rounded-full blur-2xl group-hover:bg-(--primary)/15 transition-all duration-500" />

      {/* Number Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-black text-(--primary) opacity-80 font-mono">
          0{index + 1}
        </span>
        <div className="w-2 h-2 rounded-full bg-(--primary)/40 group-hover:bg-(--primary) transition-colors" />
      </div>

      {/* Card Content */}
      <p className="text-foreground/90 text-sm sm:text-base font-medium leading-relaxed relative z-10">
        {text}
      </p>
    </motion.div>
  );
}