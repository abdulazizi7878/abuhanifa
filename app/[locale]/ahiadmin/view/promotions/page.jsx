"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ViewPromotions() {
    const router = useRouter();

    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Active Dropdown Menu State
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Delete modal states
    const [promotionToDelete, setPromotionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch promotions on load
    const fetchPromotions = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch("/api/showpromotions", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch promotions.');
            }
            const responseData = await response.json();
            setPromotions(responseData?.promotions || []);
        } catch (err) {
            console.error(err);
            setError(true);
            toast.error('Unable to load promotions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    // Close dropdown menu when clicking anywhere outside
    useEffect(() => {
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const handleEdit = (link) => {
        setActiveMenuId(null);
        router.push(`/ahiadmin/edit/promotion/${link}`);
    };

    const openDeleteModal = (promotion) => {
        setActiveMenuId(null);
        setPromotionToDelete(promotion);
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setPromotionToDelete(null);
        }
    };

    const confirmDelete = async () => {
        if (!promotionToDelete) return;

        setIsDeleting(true);
        const toastId = toast.loading('Deleting promotion...');

        try {
            const response = await fetch("/api/delete", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    item: "promotion",
                    id: promotionToDelete.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete promotion.');
            }

            setPromotions((prev) => prev.filter((item) => item.id !== promotionToDelete.id));
            toast.success('Promotion deleted successfully', { id: toastId });
            setPromotionToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete promotion. Please try again.', { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    // Filtered promotions based on search query
    const filteredPromotions = useMemo(() => {
        return promotions.filter((pr) => {
            const query = searchQuery.toLowerCase();
            const title = (pr.title || "").toLowerCase();
            const description = (pr.description || "").toLowerCase();
            const name = (pr.name || "").toLowerCase();
            const email = (pr.email || "").toLowerCase();

            return (
                !searchQuery ||
                title.includes(query) ||
                description.includes(query) ||
                name.includes(query) ||
                email.includes(query)
            );
        });
    }, [promotions, searchQuery]);

    return (
        <>
            <main className="bg-[var(--background)] text-[var(--foreground)]">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Title Header & Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight en text-[var(--secondary)]">
                                Abuhanifa Installation
                            </h1>
                            <p className="text-2xl sm:text-3xl font-extrabold en mt-1">
                                All promotions
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search by title, description, name, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-28">
                            <p className="text-base font-medium opacity-80 en">Loading promotions...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-20 p-8 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 en">
                                Unable to Load Promotions
                            </h2>
                            <p className="text-sm opacity-80 mb-6 en">Unable to load promotions.</p>
                            <button
                                onClick={fetchPromotions}
                                className="px-5 py-2 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md bg-[var(--primary)] text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredPromotions.length === 0 && (
                        <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-lg mx-auto space-y-4 bg-[var(--background)]">
                            <h3 className="text-lg font-bold en">No promotions found.</h3>
                            <p className="text-sm opacity-75 en">
                                {promotions.length === 0
                                    ? "No promotions available at the moment."
                                    : "No promotions match your search query."}
                            </p>
                        </div>
                    )}

                    {/* Promotions Table */}
                    {!loading && !error && filteredPromotions.length > 0 && (
                        <div className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]">
                            <div className="overflow-x-auto min-h-[300px]">
                                <table className="w-full text-left border-collapse text-sm en">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                            <th className="py-3.5 px-4">Title</th>
                                            <th className="py-3.5 px-4">Description</th>
                                            <th className="py-3.5 px-4">Contact Info</th>
                                            <th className="py-3.5 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {filteredPromotions.map((pr) => (
                                            <tr key={pr.id} className="transition hover:bg-[var(--border)]/10">
                                                {/* Title */}
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                                        {pr.title}
                                                    </div>
                                                </td>

                                                {/* Description */}
                                                <td className="py-4 px-4 max-w-xs truncate opacity-80" style={{ color: 'var(--foreground)' }}>
                                                    {pr.description}
                                                </td>

                                                {/* Contact Info */}
                                                <td className="py-4 px-4 text-sm opacity-80" style={{ color: 'var(--foreground)' }}>
                                                    <div className="font-medium">{pr.name}</div>
                                                    <div className="text-xs opacity-70">{pr.email}</div>
                                                </td>

                                                {/* Actions Dropdown */}
                                                <td className="py-4 px-4 text-right">
                                                    <div
                                                        className="relative inline-block text-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveMenuId(activeMenuId === pr.id ? null : pr.id)}
                                                            className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                                            title="Actions"
                                                        >
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="5" r="2" />
                                                                <circle cx="12" cy="12" r="2" />
                                                                <circle cx="12" cy="19" r="2" />
                                                            </svg>
                                                        </button>

                                                        {activeMenuId === pr.id && (
                                                            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                                                <div>
                                                                    <button
                                                                        onClick={() => handleEdit(pr.link)}
                                                                        className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <div className="border-t border-[var(--border)] my-1"></div>

                                                                    <button
                                                                        onClick={() => openDeleteModal(pr)}
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

                    {/* Delete Confirmation Modal */}
                    {promotionToDelete && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={closeDeleteModal}
                        >
                            <div
                                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-red-500 en">Delete Promotion?</h3>
                                <p className="text-sm opacity-80 en leading-relaxed">
                                    Are you sure you want to delete <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{promotionToDelete.title}</span>? This action cannot be undone.
                                </p>

                                {/* Selected Promotion Preview Card */}
                                <div
                                    className="p-4 rounded-lg border border-[var(--border)] bg-[var(--border)]/5 space-y-1"
                                >
                                    <div className="font-semibold en text-sm">{promotionToDelete.title}</div>
                                    <div className="text-xs opacity-70 en line-clamp-2">{promotionToDelete.description}</div>
                                </div>

                                {/* Modal Buttons */}
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
                                        {isDeleting ? 'Deleting...' : 'Delete'}
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