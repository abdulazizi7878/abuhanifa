"use client";

import Link from "next/link";
import Loading from "./loading";
import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Share2 } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="w-full flex justify-center py-10">
            <Products />
        </div>
    );
}

function Products() {
    const [products, setProducts] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetProducts() {
        try {
            const response = await fetch("/api/showproducts", {
                method: "POST"
            });
            const data = await response.json();            
            setProducts(data?.data);
            setLoading(false);                                            
        } catch (err) {
            alert("ERROR, WHILE FETCHING");
            setLoading(false);
        }
    }
    
    useEffect(() => {
        GetProducts();
    }, []);

    return (
        <div className="w-[92%] max-w-7xl flex justify-center">
            {isLoading ? (
                <Loading loadingItem={"Products"} />
            ) : (
                products && products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                        {products.map((pr, index) => (
                            <Product 
                                key={index}
                                name={pr.name}
                                description={pr.description}
                                image={pr.image}
                                resourceType={pr.media_resource_type}
                                link={pr.link}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-[var(--foreground)] opacity-60 font-medium">
                        Products not found.
                    </div>
                )
            )}
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
                    url: window.location.origin + `/products/${link}`
                });
            }
        } catch (err) {
            console.error("Error sharing:", err);
            await navigator.clipboard.writeText(window.location.origin + `/products/${link}`);
            alert("Link has been copied!");
        }
    }

    const isVideo = resourceType === "video";

    return (
        <Link href={`/products/${link}`} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden border border-[var(--border)]/50 rounded-4xl flex flex-col relative bg-[var(--background)]">
            
            <div className="w-full h-44 sm:h-48 flex justify-center items-center overflow-hidden bg-[var(--foreground)]/25 relative group/video">
                {image ? (
                    isVideo ? (
                        <div className="w-full h-full relative">
                            <video 
                                ref={videoRef}
                                src={image} 
                                muted={isMuted}
                                playsInline
                                loop
                                onEnded={() => setIsPlaying(false)}
                                className="w-full h-full object-cover" 
                            />
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button 
                                    onClick={togglePlay}
                                    className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer"
                                    aria-label="Play video"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </button>
                                <button 
                                    onClick={toggleMute}
                                    className="w-9 h-9 rounded-full bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer"
                                    aria-label="Mute video"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img src={image} alt={`${name}-image`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground)] opacity-50 font-semibold text-xs">
                        No Media
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-col mx-3 mb-12">
                <p className="text-sm font-bold capitalize line-clamp-1">
                    {name}
                </p>
                <p className="line-clamp-1 text-xs opacity-80 mt-1">
                   {description} 
                </p>
                {/* price currently removed */}
                {
                    /* <p className="text-sm font-bold mt-2 text-[var(--primary)]" title={`${price} Ethiopian Birr`}>
                        {price} ETB
                    </p> */
                }
            </div>

            <div className="absolute bottom-3 right-3">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); Share(); }} className="p-2.5 rounded-full bg-[var(--foreground)]/10 transition-transform cursor-pointer duration-300 hover:bg-[var(--foreground)]/20" aria-label="Share product">
                    <Share2 className="w-4 h-4 text-[var(--foreground)]" />
                </button>
            </div>
        </Link>
    );
}