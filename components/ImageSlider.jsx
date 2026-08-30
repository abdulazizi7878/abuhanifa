"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";

const DEFAULT_SLIDES = [
  {
    id: 1,
    url: "/images/hero/sec-1.jpg",
    alt: "Electrical Engineering and Installation",
    titleKey: "title-1",
    subtitleKey: "subtitle-1",
  },
  {
    id: 2,
    url: "/images/hero/sec-2.jpg",
    alt: "Industrial Electrical Panel",
    titleKey: "title-2",
    subtitleKey: "subtitle-2",
  },
  {
    id: 3,
    url: "/images/hero/sec-3.jpg",
    alt: "Plumbing and Water Systems",
    titleKey: "title-3",
    subtitleKey: "subtitle-3",
  },
  {
    id: 4,
    url: "/images/hero/sec-4.jpg",
    alt: "Sanitary Installation System",
    titleKey: "title-4",
    subtitleKey: "subtitle-4",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98,
  }),
};

export default function ImageSlider({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  interval = 5000,
  className = "",
}) {

    const t = useTranslations("imageSlider");

  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const activeIndex = Math.abs(page % slides.length);

  const activeSlide = slides[activeIndex];
  
  const title = activeSlide?.titleKey
    ? t(activeSlide.titleKey)
    : "";

    const subtitle = activeSlide?.subtitleKey
    ? t(activeSlide.subtitleKey)
    : "";

  const paginate = useCallback((newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  }, []);

  const goToSlide = (index) => {
    const diff = index - activeIndex;
    if (diff !== 0) {
      setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
    }
  };

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, paginate, slides.length]);

  if (!slides || slides.length === 0) return null;



  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full h-[380px] sm:h-[460px] md:h-[540px] overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 32 },
            opacity: { duration: 0.35 },
            scale: { duration: 0.35 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[activeIndex].url}
            alt={slides[activeIndex].alt}
            className="w-full h-full object-cover"
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {(title || subtitle) && (
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 max-w-4xl">
                {title && (
                <motion.h2
                    key={`title-${activeSlide.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md"
                >
                    {title}
                </motion.h2>
                )}

                {subtitle && (
                <motion.p
                    key={`subtitle-${activeSlide.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mt-3 text-sm sm:text-sm md:text-md text-white/80 max-w-2xl leading-relaxed"
                >
                    {subtitle}
                </motion.p>
                )}
            </div>
            )}

        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Buttons */}
      {slides.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-lg"
          >
            &#10094;
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-10 sm:size-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-lg"
          >
            &#10095;
          </motion.button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="relative py-1 focus:outline-none"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}