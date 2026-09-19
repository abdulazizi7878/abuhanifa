"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function InstallationShowcaseSlider() {
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const carouselRef = useRef(null);
    const [width, setWidth] = useState(0);

    // Load public showcase images strictly from /api/public-installation-showcase
    useEffect(() => {
        async function fetchPublicShowcase() {
            try {
                const res = await fetch("/api/public-installation-showcase");
                const json = await res.json();

                if (json.success && Array.isArray(json.showcases)) {
                    setShowcases(json.showcases);
                } else if (json.success && Array.isArray(json.data)) {
                    setShowcases(json.data);
                } else {
                    setError(json.message || "Failed to load showcase");
                }
            } catch (err) {
                setError("Network error fetching showcase");
            } finally {
                setLoading(false);
            }
        }
        fetchPublicShowcase();
    }, []);

    // Compute drag bounds based on total scrollable width
    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, [showcases]);

    // Smooth automatic sliding; pauses on mouse hover or active drag gesture
    useEffect(() => {
        if (isHovered || isDragging || !carouselRef.current || width <= 0) return;

        const interval = setInterval(() => {
            if (carouselRef.current) {
                const currentScroll = carouselRef.current.scrollLeft;
                const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

                if (currentScroll >= maxScroll - 10) {
                    carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
                }
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [isHovered, isDragging, width]);

    if (loading) {
        return (
            <div className="w-full py-16 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-(--primary)" />
            </div>
        );
    }

    if (error || showcases.length === 0) {
        return null; // Gracefully render nothing if empty or errored
    }

    return (
        <div
            className="w-full overflow-hidden py-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={carouselRef}
                className="w-full overflow-x-auto scrollbar-none scroll-smooth cursor-grab active:cursor-grabbing flex gap-6 px-4 sm:px-8 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    className="flex gap-6 shrink-0"
                >
                    {showcases.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-72 sm:w-80 md:w-96 h-80 sm:h-96 rounded-3xl overflow-hidden bg-(--foreground)/5 border border-(--border) shadow-md shrink-0 select-none"
                        >
                            <img
                                src={item.image}
                                alt="Installation Showcase"
                                className="w-full h-full object-cover pointer-events-none"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}