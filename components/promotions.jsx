"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "./loading";
import ParsedContent from "@/utils/linkParser";
import { Play, Pause, Volume2, VolumeX, Share2, Phone, Send, MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Promotions() {
    const [promotions, setPromotions] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetPromotions() {
        try {
            const response = await fetch("/api/showpromotions", {
                method: "POST"
            });
            const data = await response.json();
            setPromotions(data?.promotions);
            setLoading(false);
        } catch (err) {
            alert("ERROR, WHILE FETCHING");
            setLoading(false);
        }
    }

    useEffect(() => {
        GetPromotions();
    }, []);

    return (
        <div className="w-full flex justify-center py-10">
            <div className="w-[92%] max-w-5xl">
                {isLoading ? (
                    <Loading loadingItem={"promotions"} />
                ) : (
                    promotions && promotions.length > 0 ? (
                        promotions.map((pr, index) => (
                            <Promotion
                                key={index}
                                title={pr.title}
                                description={pr.description}
                                image={pr.image}
                                resourceType={pr.media_resource_type}
                                name={pr.name}
                                link={pr.link}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-(--foreground) opacity-60 font-medium">
                            Promotions not found.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function Promotion({ title, description, image, resourceType, name, link }) {
    const t = useTranslations("products");
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const togglePlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    async function Share() {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: title,
                    text: title + " - " + description,
                    url: window.location.href
                });
            }
        } catch (err) {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link has been copied!");
        }
    }

    const isVideo = resourceType === "video";

    // Prefilled text with promotion title only
    const promoTitle = title || name || "Promotion";
    const orderMessage = encodeURIComponent(`Hello, I am interested in this promotion: ${promoTitle}`);

    const telegramUsername = "abuhanifaInstallation";
    const telegramLink = `https://t.me/${telegramUsername}?text=${orderMessage}`;

    const whatsappNumber = "+251936489696";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${orderMessage}`;

    const phoneNumber = "+251936489696";

    return (
        <div className="w-full border-b border-(--border) pb-12 mb-10 flex flex-wrap gap-10 justify-center">

            {/* Left/Main Content Column: Media & Actions */}
            <div className="flex flex-col gap-y-6 w-full max-w-3xl">

                {/* Title Area */}
                <div className="flex flex-col gap-y-2 px-2">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-(--foreground) leading-tight">
                        {title}
                    </h2>
                </div>

                {/* Media Container (Supports both Image and Video based on resourceType) */}
                <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-(--foreground)/10 border border-(--border) relative shadow-lg">
                    {image ? (
                        isVideo ? (
                            <div className="w-full h-full relative group/video">
                                <video
                                    ref={videoRef}
                                    src={image}
                                    muted={isMuted}
                                    playsInline
                                    loop
                                    onEnded={() => setIsPlaying(false)}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    <button
                                        onClick={togglePlay}
                                        className="w-14 h-14 rounded-full bg-(--primary) text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                                    </button>

                                    <button
                                        onClick={toggleMute}
                                        className="w-11 h-11 rounded-full bg-(--background) text-(--foreground) flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <img src={image} alt={`${title}-image`} className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-(--foreground) opacity-50 font-semibold text-sm">
                            No Media Preview
                        </div>
                    )}
                </div>

                {/* Description Content Area */}
                <div className="flex flex-col gap-y-4 px-2">
                    <ParsedContent
                        content={description}
                        className="text-base sm:text-lg text-(--foreground) opacity-90"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 px-2 pt-2">
                    <button
                        onClick={Share}
                        className="flex items-center gap-2 duration-300 cursor-pointer bg-(--foreground)/5 hover:bg-(--foreground)/10 border border-(--border) px-5 py-2.5 rounded-full text-sm font-medium text-(--foreground) transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4 text-(--primary)" />
                        <span>{t("Share")}</span>
                    </button>

                    <button
                        onClick={() => setIsOrderModalOpen(true)}
                        className="flex items-center justify-center duration-300 cursor-pointer bg-(--foreground) text-(--background) hover:opacity-90 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md"
                    >
                        {t("Order")}
                    </button>
                </div>
            </div>

            {/* Order Options Modal */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-6 rounded-3xl shadow-2xl bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] space-y-6 relative animate-in fade-in zoom-in duration-200">

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOrderModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--foreground)]/10 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-2xl font-black tracking-tight">{t("Choose Order Method")}</h3>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Option 1: Call Now */}
                            <a
                                href={`tel:${phoneNumber}`}
                                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{t("Call Now")}</h4>
                                </div>
                            </a>

                            {/* Option 2: Order with Telegram */}
                            <a
                                href={telegramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                                    <Send className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{t("Order with Telegram")}</h4>
                                </div>
                            </a>

                            {/* Option 3: Order with WhatsApp */}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{t("Order with WhatsApp")}</h4>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}