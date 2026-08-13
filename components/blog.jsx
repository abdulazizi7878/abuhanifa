"use client";

import { useEffect, useState, useRef } from "react";
import CommentSection from "./over";
import Loading from "./loading";
import { Play, Pause, Volume2, VolumeX, MessageSquare, Share2 } from "lucide-react";

export default function Blog({ link }) {
    const [blog, setBlog] = useState(null);
    const [isLoading, setLoading] = useState(true);

    async function GetBlog() {
        try {
            const response = await fetch("/api/showblog", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link
                })
            });
            const data = await response.json();
            setBlog(data?.data?.blog?.result);
            setLoading(false);
        } catch (err) {
            console.log("ERROR, WHILE FETCHING");
            setLoading(false);
        }
    }

    useEffect(() => {
        GetBlog();
    }, []);

    return (
        <div className="w-full flex justify-center py-10">
            <div className="w-[92%] max-w-5xl">
                {isLoading ? (
                    <Loading loadingItem={"Blog"} />
                ) : (
                    blog && blog.length > 0 ? (
                        blog.map((bl, index) => (
                            <OneBlog 
                                key={index} 
                                title={bl.title} 
                                description={bl.description} 
                                link={bl.link}
                                image={bl.image}
                                resourceType={bl.media_resource_type}
                                created_at={bl.created_at} 
                                blog_id={bl.id}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-[var(--foreground)] opacity-60 font-medium">
                            Blog post not found.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

function OneBlog({ title, description, image, resourceType, created_at, link, blog_id }) {
    const [isCommentSectionShown, setCommentSectionShown] = useState(false);

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

    async function shareBlog() {
        const blogData = {
            title: title,
            text: description,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(blogData);
            }
        } catch (err) {
            await navigator.clipboard.writeText(window.location.href);            
        }
    }

    useEffect(() => {
        if (!title) return;
        document.title = title;

        document.querySelector('meta[name="description"]')
            ?.setAttribute("content", description || "");

        document.querySelector('meta[property="og:title"]')
            ?.setAttribute("content", title || "");

        document.querySelector('meta[property="og:description"]')
            ?.setAttribute("content", description || "");

        document.querySelector('meta[property="og:image"]')
            ?.setAttribute("content", image || "");

        document.querySelector('meta[property="og:url"]')
            ?.setAttribute("content", window.location.href);

    }, [title, description, image]);

    const isVideo = resourceType === "video";

    return (
        <div className="w-full border-b border-[var(--border)] pb-12 mb-10 flex flex-wrap gap-10 justify-center">

            <div className={`flex duration-500 flex-col gap-y-6 transition-all ${isCommentSectionShown ? "w-full md:w-[55%]" : "w-full max-w-3xl"}`}>
                
                {/* Title & Date Area */}
                <div className="flex flex-col gap-y-2.5 px-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--foreground)] leading-tight">
                        {title}
                    </h1>
                    <div className="text-sm font-semibold text-[var(--primary)] opacity-95 flex items-center gap-2">
                        {created_at ? (
                            <>
                                <span>{new Date(created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span>•</span>
                                <span>{new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                        ) : ""}
                    </div>
                </div>

                {/* Media Container */}
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
                                
                                {/* Custom Video Controls Overlay */}
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
                            <img src={image} alt={title || "Blog Image"} className="w-full h-full object-cover" />
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
                        onClick={() => setCommentSectionShown(!isCommentSectionShown)} 
                        className="flex items-center gap-2 duration-300 cursor-pointer bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--border)] px-5 py-2.5 rounded-full text-sm font-medium text-[var(--foreground)] transition-all shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
                        <span>Comments</span>
                    </button>

                    <button 
                        onClick={shareBlog} 
                        className="flex items-center gap-2 duration-300 cursor-pointer bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--border)] px-5 py-2.5 rounded-full text-sm font-medium text-[var(--foreground)] transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4 text-[var(--primary)]" />
                        <span>Share</span>
                    </button>
                </div>
            </div>         

            {/* Comment Section Panel */}
            {isCommentSectionShown && (
                <div className="w-full md:w-[40%] animate-fadeIn">
                    <CommentSection OnClick={() => setCommentSectionShown(!isCommentSectionShown)} blog_id={blog_id} />
                </div>
            )}
        </div>
    );
}