"use client";

import React from "react";
import { Play, Video, Send, FileText, ExternalLink } from "lucide-react";

/**
 * Custom SVG icons for brand platforms where Lucide brand icons are unavailable
 */
function InstagramIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
        </svg>
    );
}

/**
 * Gets icon, label, and style config for a given URL string.
 */
function getLinkConfig(urlStr) {
    let urlObj = null;
    try {
        urlObj = new URL(urlStr);
    } catch (e) {
        return null;
    }

    // Only allow http or https
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        return null;
    }

    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // Check YouTube
    if (
        hostname.includes("youtube.com") ||
        hostname.includes("youtu.be")
    ) {
        return {
            label: "Watch on YouTube",
            icon: YoutubeIcon,
            color: "hover:border-red-500/40 hover:bg-red-500/10 text-red-500"
        };
    }

    // Check TikTok
    if (hostname.includes("tiktok.com")) {
        return {
            label: "Watch on TikTok",
            icon: Video,
            color: "hover:border-pink-500/40 hover:bg-pink-500/10 text-pink-500"
        };
    }

    // Check Instagram
    if (hostname.includes("instagram.com")) {
        return {
            label: "View on Instagram",
            icon: InstagramIcon,
            color: "hover:border-purple-500/40 hover:bg-purple-500/10 text-purple-500"
        };
    }

    // Check Telegram
    if (hostname === "t.me" || hostname.includes("telegram.me") || hostname.includes("telegram.org")) {
        if (pathname.endsWith(".pdf")) {
            return {
                label: "Open PDF",
                icon: FileText,
                color: "hover:border-sky-500/40 hover:bg-sky-500/10 text-sky-500"
            };
        }
        return {
            label: "Open on Telegram",
            icon: Send,
            color: "hover:border-sky-500/40 hover:bg-sky-500/10 text-sky-500"
        };
    }

    // Check PDF direct link
    if (pathname.endsWith(".pdf")) {
        return {
            label: "Open PDF",
            icon: FileText,
            color: "hover:border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-500"
        };
    }

    // Fallback External Link
    return {
        label: "Open Link",
        icon: ExternalLink,
        color: "hover:border-(--primary) hover:bg-(--primary)/10 text-(--primary)"
    };
}

/**
 * Parses raw text content, extracts http/https URLs, removes them from text,
 * and converts them into action buttons at their exact positions.
 */
export default function ParsedContent({ content, className = "" }) {
    if (!content) return null;

    // Regex to match http/https URLs safely
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split content by paragraphs or lines
    const paragraphs = content.split("\n");

    return (
        <div className={`space-y-3 ${className}`}>
            {paragraphs.map((paragraph, pIdx) => {
                if (!paragraph.trim()) {
                    return <div key={pIdx} className="h-2" />;
                }

                const elements = [];
                let lastIndex = 0;
                let match;

                // Reset regex state for each paragraph
                urlRegex.lastIndex = 0;

                while ((match = urlRegex.exec(paragraph)) !== null) {
                    const rawUrl = match[0];
                    const matchIndex = match.index;

                    // Push preceding text if available
                    if (matchIndex > lastIndex) {
                        elements.push(paragraph.substring(lastIndex, matchIndex));
                    }

                    const config = getLinkConfig(rawUrl);

                    if (config) {
                        const Icon = config.icon;
                        elements.push(
                            <span key={`link-${pIdx}-${matchIndex}`} className="my-2 inline-block w-full sm:w-auto">
                                <a
                                    href={rawUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl border border-(--border) bg-(--foreground)/5 transition-all duration-300 font-semibold text-sm cursor-pointer shadow-sm ${config.color}`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span>{config.label}</span>
                                </a>
                            </span>
                        );
                    } else {
                        // Fallback to text if invalid URL scheme
                        elements.push(rawUrl);
                    }

                    lastIndex = matchIndex + rawUrl.length;
                }

                // Push trailing text
                if (lastIndex < paragraph.length) {
                    elements.push(paragraph.substring(lastIndex));
                }

                return (
                    <div key={pIdx} className="leading-relaxed">
                        {elements.map((el, eIdx) =>
                            typeof el === "string" ? <span key={eIdx}>{el}</span> : el
                        )}
                    </div>
                );
            })}
        </div>
    );
}