"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function ViewCommentsMessages() {
    const [comments, setComments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [errorComments, setErrorComments] = useState(false);
    const [errorMessages, setErrorMessages] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch comments on load
    const fetchComments = async () => {
        setLoadingComments(true);
        setErrorComments(false);
        try {
            const response = await fetch("/api/showallcomments", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch comments.');
            }
            const responseData = await response.json();
            setComments(responseData?.comments || []);
        } catch (err) {
            console.error(err);
            setErrorComments(true);
            toast.error('Unable to load comments.');
        } finally {
            setLoadingComments(false);
        }
    };

    // Fetch messages on load
    const fetchMessages = async () => {
        setLoadingMessages(true);
        setErrorMessages(false);
        try {
            const response = await fetch("/api/showallmessages", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch messages.');
            }
            const responseData = await response.json();
            setMessages(responseData?.messages || []);
        } catch (err) {
            console.error(err);
            setErrorMessages(true);
            toast.error('Unable to load messages.');
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchComments();
        fetchMessages();
    }, []);

    // Filtered comments based on search query
    const filteredComments = useMemo(() => {
        return comments.filter((cm) => {
            const query = searchQuery.toLowerCase();
            const name = (cm.name || "").toLowerCase();
            const email = (cm.email || "").toLowerCase();
            const comment = (cm.comment || "").toLowerCase();

            return (
                !searchQuery ||
                name.includes(query) ||
                email.includes(query) ||
                comment.includes(query)
            );
        });
    }, [comments, searchQuery]);

    // Filtered messages based on search query
    const filteredMessages = useMemo(() => {
        return messages.filter((ms) => {
            const query = searchQuery.toLowerCase();
            const name = (ms.name || "").toLowerCase();
            const email = (ms.email || "").toLowerCase();
            const message = (ms.message || "").toLowerCase();

            return (
                !searchQuery ||
                name.includes(query) ||
                email.includes(query) ||
                message.includes(query)
            );
        });
    }, [messages, searchQuery]);

    const isLoading = loadingComments || loadingMessages;

    return (
        <>
            <main className="">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Page Title Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                Comments & Messages
                            </h1>
                            <p className="mt-1 text-sm opacity-80 en">
                                View and manage user feedback and inquiries.
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, email, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 px-4 py-2.5 rounded-lg border text-sm en bg-background text-foreground focus:outline-none focus:ring-2"
                            style={{ borderColor: 'var(--border)' }}
                        />
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-20">
                            <p className="text-lg opacity-80 en">Loading data...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="space-y-10">
                            {/* Comments Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                    All Comments
                                </h2>
                                
                                {errorComments ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load comments.</p>
                                        <button onClick={fetchComments} className="px-4 py-2 rounded-lg text-xs font-medium bg-() text-()">Try Again</button>
                                    </div>
                                ) : filteredComments.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-sm opacity-70 en">No comments found matching your query.</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="rounded-xl shadow-lg border overflow-hidden backdrop-blur-sm"
                                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }}>
                                                        <th className="py-4 px-6 font-semibold text-sm en">User</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Comment</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                                    {filteredComments.map((cm, index) => (
                                                        <tr key={index} className="transition hover:opacity-90">
                                                            <td className="py-4 px-6 align-top">
                                                                <div className="font-medium en text-sm" style={{ color: 'var(--foreground)' }}>{cm.name}</div>
                                                                <div className="text-xs opacity-70 en">{cm.email}</div>
                                                            </td>
                                                            <td className="py-4 px-6 text-sm opacity-90 en" style={{ color: 'var(--foreground)' }}>
                                                                {cm.comment}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Messages Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                    All Messages
                                </h2>

                                {errorMessages ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load messages.</p>
                                        <button onClick={fetchMessages} className="px-4 py-2 rounded-lg text-xs font-medium bg-() text-()">Try Again</button>
                                    </div>
                                ) : filteredMessages.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-sm opacity-70 en">No messages found matching your query.</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="rounded-xl shadow-lg border overflow-hidden backdrop-blur-sm"
                                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }}>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Sender</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Message</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                                    {filteredMessages.map((ms, index) => (
                                                        <tr key={index} className="transition hover:opacity-90">
                                                            <td className="py-4 px-6 align-top">
                                                                <div className="font-medium en text-sm" style={{ color: 'var(--foreground)' }}>{ms.name}</div>
                                                                <div className="text-xs opacity-70 en">{ms.email}</div>
                                                            </td>
                                                            <td className="py-4 px-6 text-sm opacity-90 en" style={{ color: 'var(--foreground)' }}>
                                                                {ms.message}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}