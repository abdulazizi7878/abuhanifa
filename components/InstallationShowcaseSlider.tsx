"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type Showcase = {
  id: string | number;
  image: string;
};

export default function InstallationShowcaseSlider() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const response = await fetch("/api/public-installation-showcase");

        if (!response.ok) {
          throw new Error("Failed to fetch showcase");
        }

        const json = await response.json();

        const data = Array.isArray(json.showcases)
          ? json.showcases
          : Array.isArray(json.data)
            ? json.data
            : [];

        setShowcases(data);
      } catch (error) {
        console.error("Showcase fetch error:", error);
        setShowcases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcase();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || showcases.length <= 1) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const startAutoScroll = () => {
      if (interval) clearInterval(interval);

      interval = setInterval(() => {
        if (!carousel) return;

        const maxScroll =
          carousel.scrollWidth - carousel.clientWidth;

        const nextScroll = carousel.scrollLeft + 320;

        if (carousel.scrollLeft >= maxScroll - 5) {
          carousel.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          carousel.scrollTo({
            left: Math.min(nextScroll, maxScroll),
            behavior: "smooth",
          });
        }
      }, 3500);
    };

    startAutoScroll();

    const pause = () => {
      if (interval) clearInterval(interval);
    };

    const resume = () => {
      startAutoScroll();
    };

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("touchstart", pause, { passive: true });
    carousel.addEventListener("touchend", resume, { passive: true });

    return () => {
      if (interval) clearInterval(interval);

      carousel.removeEventListener("mouseenter", pause);
      carousel.removeEventListener("mouseleave", resume);
      carousel.removeEventListener("touchstart", pause);
      carousel.removeEventListener("touchend", resume);
    };
  }, [showcases]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-(--primary)" />
      </div>
    );
  }

  if (!showcases.length) {
    return null;
  }

  return (
    <section className="w-full py-6">
      <div
        ref={carouselRef}
        className="
          flex
          w-full
          gap-5
          overflow-x-auto
          px-4
          py-3
          sm:gap-6
          sm:px-8
          snap-x
          snap-mandatory
          scroll-smooth
          overscroll-x-contain
          touch-pan-x
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {showcases.map((item) => (
          <article
            key={item.id}
            className="
              group
              relative
              h-80
              w-[82vw]
              max-w-96
              shrink-0
              snap-center
              overflow-hidden
              rounded-3xl
              border
              border-(--border)
              bg-(--foreground)/5
              shadow-md
              sm:h-96
              sm:w-80
              md:w-96
            "
          >
            <img
              src={item.image}
              alt="Installation showcase"
              loading="lazy"
              draggable={false}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.03]
              "
              onError={(event) => {
                event.currentTarget.parentElement?.remove();
              }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
