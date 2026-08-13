"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "./loading";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

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
            <div className="w-[92%] max-w-4xl flex flex-col gap-12">
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
                                email={pr.email} 
                                phone_number={pr.phone_number} 
                                telegram={pr.owner_link} 
                                link={pr.link} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-foreground opacity-60 font-medium">
                            Promotions not found.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function Promotion({ title, description, image, resourceType, name, email, phone_number, telegram, link }) {
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

    const isVideo = resourceType === "video";

    return (
        <div className="w-full border-b border-(--border) pb-12 flex flex-col gap-y-5">
            
            {/* Title Section (Above Media) */}
            <div className="flex flex-col gap-y-1 px-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                    {title}
                </h2>
            </div>

            {/* Media Container (Image or Video) */}
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
                                    aria-label="Play video"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                                </button>
                                <button 
                                    onClick={toggleMute}
                                    className="w-11 h-11 rounded-full bg-background text-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                                    aria-label="Mute video"
                                >
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <img src={image} alt="PROMOTION_IMAGE" className="w-full h-full object-cover" loading="lazy" />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center  opacity-50 font-semibold text-sm">
                        No Media Preview
                    </div>
                )}
            </div>

            {/* Description & Contact Section */}
            <div className="flex flex-col gap-y-4 px-2">
                <p className="text-base sm:text-lg text-foreground opacity-90 leading-relaxed whitespace-pre-line">
                   {description}
                </p>

                {/* Contact Options */}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-bold text-sm text-foreground opacity-80">Contact us:</span>
                    
                    {phone_number && (
                        <div className="relative bg-foreground text-background px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="var(--background)">
                                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/>
                            </svg>
                            <span className="text-xs font-semibold">Call</span>
                            <a href={`tel:${phone_number}`} className="absolute inset-0" aria-label="Phone contact"></a>
                        </div>
                    )}

                    {telegram && (
                        <div className="relative bg-foreground text-background px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 shadow-sm">
                            <img src="/telegram.svg" alt="TELEGRAM" className="w-4 h-4 brightness-0 invert" />
                            <span className="text-xs font-semibold">Telegram</span>
                            <a href={telegram} className="absolute inset-0" target="_blank" rel="noopener noreferrer" aria-label="Telegram contact"></a>
                        </div>
                    )}

                    {email && (
                        <div className="relative bg-foreground text-background px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="var(--background)">
                                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v58q0 59-40.5 100.5T740-280q-35 0-66-15t-52-43q-29 29-65.5 43.5T480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480v58q0 26 17 44t43 18q26 0 43-18t17-44v-58q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h200v80H480Zm85-315q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Z"/>
                            </svg>
                            <span className="text-xs font-semibold">Email</span>
                            <a href={`mailto:${email}`} className="absolute inset-0" aria-label="Email contact"></a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}