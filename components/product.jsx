"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "@/components/loading";
import { Play, Pause, Volume2, VolumeX, Share2 } from "lucide-react";

export default function OneProduct({ link }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    async function GetProduct() {
        try {
            const response = await fetch("/api/showproduct", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                    amount: 1
                })
            });
            const resData = await response.json();
            setLoading(false);
            if (resData.success) {
                setProduct(resData?.data?.result);
            } else {
                alert("We couldn't fetch the product now");
            }
        } catch (err) {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetProduct();
    }, []);

    return (
        <div className="w-full flex justify-center py-10">
            <div className="w-[92%] max-w-5xl">
                {loading ? (
                    <Loading loadingItem={"product"} />
                ) : (
                    product && product.length > 0 ? (
                        product.map((pr, index) => (
                            <Product 
                                key={index} 
                                name={pr.name} 
                                description={pr.description} 
                                image={pr.image} 
                                resourceType={pr.media_resource_type}
                                link={pr.link} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-[var(--foreground)] opacity-60 font-medium">
                            Product not found.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function Product({ name, description, image, resourceType, link }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

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
                    title: name,
                    text: name + " - " + description,
                    url: window.location.href
                });
            }
        } catch (err) {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link has been copied!");
        }
    }

    const isVideo = resourceType === "video";

    return (
        <div className="w-full border-b border-[var(--border)] pb-12 mb-10 flex flex-wrap gap-10 justify-center">
            
            {/* Left/Main Content Column: Media & Actions */}
            <div className="flex flex-col gap-y-6 w-full max-w-3xl">
                
                {/* Title & Price Area (Prominent) */}
                <div className="flex flex-col gap-y-2 px-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--foreground)] leading-tight capitalize">
                        {name}
                    </h1>
                    {
                        /* price currently removed */
                    }
                    {
                        /*
                        <div className="text-lg font-bold text-[var(--primary)]">
                            Price: <span className="font-black">{price}</span> ETB
                        </div>
                        */
                    }
                </div>

                {/* Media Container (Supports both Image and Video based on resourceType) */}
                <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden bg-[var(--foreground)]/10 border border-[var(--border)] relative shadow-lg">
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
                                        className="w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                                    </button>

                                    <button 
                                        onClick={toggleMute}
                                        className="w-11 h-11 rounded-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <img src={image} alt={`${name}-image`} className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--foreground)] opacity-50 font-semibold text-sm">
                            No Media Preview
                        </div>
                    )}
                </div>

                {/* Description Content Area */}
                <div className="flex flex-col gap-y-4 px-2">
                    <p className="text-base sm:text-lg text-[var(--foreground)] opacity-90 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 px-2 pt-2">
                    <button 
                        onClick={Share} 
                        className="flex items-center gap-2 duration-300 cursor-pointer bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--border)] px-5 py-2.5 rounded-full text-sm font-medium text-[var(--foreground)] transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4 text-[var(--primary)]" />
                        <span>Share</span>
                    </button>

                    <a 
                        href={`/products/${link}/order`} 
                        className="flex items-center justify-center duration-300 cursor-pointer bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md"
                    >
                        Order Now
                    </a>
                </div>
            </div>
        </div>
    );
}