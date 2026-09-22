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

  // Fetch showcase images
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

  // Automatic scrolling
  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || showcases.length <= 1) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const startAutoScroll = () => {
      if (interval) {
        clearInterval(interval);
      }

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

    const pause = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const resume = () => {
      startAutoScroll();
    };

    startAutoScroll();

    // Pause only for desktop mouse interaction.
    // Touch scrolling is left completely to the browser.
    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      carousel.removeEventListener("mouseenter", pause);
      carousel.removeEventListener("mouseleave", resume);
    };
  }, [showcases]);

  // Loading state
  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-(--primary)" />
      </div>
    );
  }

  // Empty/error state
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
