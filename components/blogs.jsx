"use client";

import Loading from "./loading";
import { useEffect, useState, useRef } from "react";
import { Calendar, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function Blogs(){
    const [blogs, setBlogs] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetBlogs() {
        try{
            const response = await fetch("/api/showblogs",{
                method:"POST"
            });
            const data = await response.json();
            setBlogs(data?.data?.blogs?.result);
            setLoading(false);                        
        } catch (err) {
            alert("ERROR, WHILE FETCHING");
        }
    }
    
    useEffect(()=>{
        GetBlogs();
    },[]);

    return(
        <div className="w-full py-12 flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[92%] max-w-7xl justify-items-center">
                {
                    (isLoading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <Loading loadingItem={"Blogs"} />
                        </div>
                    ) : (
                        blogs && blogs.length > 0 ? (
                            blogs.map((bl, index) => (
                                <Blog 
                                    key={index} 
                                    title={bl.title} 
                                    description={bl.description} 
                                    link={bl.link}
                                    image={bl.image}
                                    created_at={bl.created_at} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-(--foreground) opacity-60 font-medium">
                                No blogs available right now.
                            </div>
                        )
                    ))
                }
            </div>
        </div>
    )
}

function Blog({title, description, image, created_at, link}) {
    const isVideo = /\.(mp4|mov|avi|wmv|flv|mkv|webm|m4v|3gp|mpeg)$/i.test(image);
    
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

    return (
        <article className="group w-full max-w-sm bg-(--background) backdrop-blur-xl border border-(--border) rounded-3xl overflow-hidden flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 relative">
            
            {/* Media Container */}
            <div className="w-full h-52 relative overflow-hidden bg-(--foreground)/10 z-20">
                {
                    image ? (
                        isVideo ? (
                            <div className="w-full h-full relative group/video">
                                <video 
                                    ref={videoRef}
                                    src={image} 
                                    muted={isMuted}
                                    playsInline
                                    onEnded={() => setIsPlaying(false)}
                                    className="w-full h-full object-cover" 
                                />
                                
                                {/* Custom Video Controls Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    <button 
                                        onClick={togglePlay}
                                        className="w-12 h-12 rounded-full bg-(--primary) text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                    </button>

                                    <button 
                                        onClick={toggleMute}
                                        className="w-10 h-10 rounded-full bg-(--background) text-(--foreground) flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
                                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                                    >
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <img src={image} alt={title || "Blog cover"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-(--foreground) opacity-50 font-semibold text-sm">
                            No Media Preview
                        </div>
                    )
                }
                <div className="absolute inset-0 bg-gradient-to-t from-(--background) via-transparent to-transparent opacity-60 pointer-events-none" />
                
                {created_at && (
                    <div className="absolute top-4 left-4 bg-(--background)/80 backdrop-blur-md border border-(--border) px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-(--foreground) pointer-events-none">
                        <Calendar className="w-3.5 h-3.5 text-(--primary)" />
                        <span>{new Date(created_at).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow justify-between gap-y-4">
                <div className="flex flex-col gap-y-2.5">
                    <h2 className="text-xl font-bold tracking-tight text-(--foreground) group-hover:text-(--primary) transition-colors line-clamp-2">
                        {title}
                    </h2>
                    <p className="text-sm text-(--foreground) opacity-80 line-clamp-3 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-(--primary) group-hover:translate-x-1 transition-transform duration-300">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            {/* Absolute Link Covering Card */}
            <a href={`/blog/${link}`} className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-(--primary) rounded-3xl" aria-label={`Read more about ${title}`} />
        </article>
    );
}