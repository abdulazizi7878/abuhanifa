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

    // Active Dropdown Menu State
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // { type: 'comments' | 'messages', id, name }
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Close dropdown menu when clicking anywhere outside
    useEffect(() => {
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    // Open Delete Modal
    const openDeleteModal = (type, item) => {
        setActiveMenuId(null);
        setSelectedItem({
            type,
            id: item.id,
            name: item.name || (type === 'comments' ? 'this comment' : 'this message')
        });
        setDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        if (isDeleting) return;
        setSelectedItem(null);
        setDeleteModalOpen(false);
    };

    // Confirm Delete Handler
    const confirmDelete = async () => {
        if (!selectedItem) return;

        setIsDeleting(true);
        try {
            const response = await fetch("/api/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item: selectedItem.type,
                    id: selectedItem.id,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "We couldn't delete the item");
            }

            toast.success(data.message || "Item Deleted successfully");

            // Remove from local state depending on type
            if (selectedItem.type === "comments") {
                setComments((prev) => prev.filter((c) => c.id !== selectedItem.id));
            } else if (selectedItem.type === "messages") {
                setMessages((prev) => prev.filter((m) => m.id !== selectedItem.id));
            }

            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "We couldn't delete the item");
        } finally {
            setIsDeleting(false);
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
            <main className="bg-[var(--background)] text-[var(--foreground)]">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Title Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight en text-[var(--secondary)]">
                                Abuhanifa Installation
                            </h1>
                            <p className="text-2xl sm:text-3xl font-extrabold en mt-1">
                                Comments & Messages
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
                            className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-28">
                            <p className="text-base font-medium opacity-80 en">Loading data...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="space-y-10">
                            {/* Comments Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en text-[var(--foreground)]">
                                    All Comments
                                </h2>

                                {errorComments ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load comments.</p>
                                        <button onClick={fetchComments} className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--primary)] text-white">Try Again</button>
                                    </div>
                                ) : filteredComments.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed border-[var(--border)]">
                                        <p className="text-sm opacity-70 en">No comments found matching your query.</p>
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]"
                                    >
                                        <div className="overflow-x-auto min-h-[200px]">
                                            <table className="w-full text-left border-collapse text-sm en">
                                                <thead>
                                                    <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                                        <th className="py-3.5 px-4">User</th>
                                                        <th className="py-3.5 px-4">Comment</th>
                                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border)]">
                                                    {filteredComments.map((cm, index) => (
                                                        <tr key={cm.id || index} className="transition hover:bg-[var(--border)]/10">
                                                            <td className="py-4 px-4 align-top">
                                                                <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{cm.name}</div>
                                                                <div className="text-xs opacity-70">{cm.email}</div>
                                                                <div className="text-[10px] opacity-50 mt-1">ID: {cm.id}</div>
                                                            </td>
                                                            <td className="py-4 px-4 text-sm opacity-90 align-top" style={{ color: 'var(--foreground)' }}>
                                                                {cm.comment}
                                                            </td>
                                                            <td className="py-4 px-4 align-top text-right">
                                                                <div
                                                                    className="relative inline-block text-left"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveMenuId(activeMenuId === `comment-${cm.id}` ? null : `comment-${cm.id}`)}
                                                                        className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                                                        title="Actions"
                                                                    >
                                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                            <circle cx="12" cy="5" r="2" />
                                                                            <circle cx="12" cy="12" r="2" />
                                                                            <circle cx="12" cy="19" r="2" />
                                                                        </svg>
                                                                    </button>

                                                                    {activeMenuId === `comment-${cm.id}` && (
                                                                        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                                                            <div>
                                                                                <button
                                                                                    onClick={() => openDeleteModal("comments", cm)}
                                                                                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 cursor-pointer hover:bg-red-500/10 transition-colors"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
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
                                <h2 className="text-2xl font-bold en text-[var(--foreground)]">
                                    All Messages
                                </h2>

                                {errorMessages ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load messages.</p>
                                        <button onClick={fetchMessages} className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--primary)] text-white">Try Again</button>
                                    </div>
                                ) : filteredMessages.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed border-[var(--border)]">
                                        <p className="text-sm opacity-70 en">No messages found matching your query.</p>
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]"
                                    >
                                        <div className="overflow-x-auto min-h-[200px]">
                                            <table className="w-full text-left border-collapse text-sm en">
                                                <thead>
                                                    <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                                        <th className="py-3.5 px-4">Sender</th>
                                                        <th className="py-3.5 px-4">Message</th>
                                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border)]">
                                                    {filteredMessages.map((ms, index) => (
                                                        <tr key={ms.id || index} className="transition hover:bg-[var(--border)]/10">
                                                            <td className="py-4 px-4 align-top">
                                                                <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{ms.name}</div>
                                                                <div className="text-xs opacity-70">{ms.email}</div>
                                                                <div className="text-[10px] opacity-50 mt-1">ID: {ms.id}</div>
                                                            </td>
                                                            <td className="py-4 px-4 text-sm opacity-90 align-top" style={{ color: 'var(--foreground)' }}>
                                                                {ms.message}
                                                            </td>
                                                            <td className="py-4 px-4 align-top text-right">
                                                                <div
                                                                    className="relative inline-block text-left"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveMenuId(activeMenuId === `message-${ms.id}` ? null : `message-${ms.id}`)}
                                                                        className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                                                        title="Actions"
                                                                    >
                                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                            <circle cx="12" cy="5" r="2" />
                                                                            <circle cx="12" cy="12" r="2" />
                                                                            <circle cx="12" cy="19" r="2" />
                                                                        </svg>
                                                                    </button>

                                                                    {activeMenuId === `message-${ms.id}` && (
                                                                        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                                                            <div>
                                                                                <button
                                                                                    onClick={() => openDeleteModal("messages", ms)}
                                                                                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 cursor-pointer hover:bg-red-500/10 transition-colors"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
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

                    {/* Delete Confirmation Modal */}
                    {deleteModalOpen && selectedItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={closeDeleteModal}>
                            <div
                                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-red-500 en capitalize">
                                        Delete {selectedItem.type.slice(0, -1)}
                                    </h3>
                                    <p className="text-sm opacity-80 en leading-relaxed">
                                        Are you sure you want to delete this {selectedItem.type.slice(0, -1)} from <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{selectedItem.name}</span>? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg border border-[var(--border)] text-xs space-y-1 bg-[var(--border)]/5">
                                    <div className="opacity-70"><span className="font-medium">Item Type:</span> {selectedItem.type}</div>
                                    <div className="opacity-70"><span className="font-medium">Item ID:</span> {selectedItem.id}</div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] transition en cursor-pointer disabled:opacity-50 bg-transparent text-[var(--foreground)] hover:bg-[var(--border)]/20"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition en cursor-pointer disabled:opacity-50 shadow-md"
                                    >
                                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}