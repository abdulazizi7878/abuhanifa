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

    const handleEdit = (link) => {
        router.push(`/ahiadmin/edit/promotion/${link}`);
    };

    const openDeleteModal = (promotion) => {
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
            <main className="">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Page Title Header & Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                All promotions
                            </h1>
                            <p className="mt-1 text-sm opacity-80 en">
                                View and manage existing promotion records.
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
                            className="w-full sm:w-80 px-4 py-2.5 rounded-lg border text-sm en bg-background text-foreground focus:outline-none focus:ring-2"
                            style={{ borderColor: 'var(--border)' }}
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-20">
                            <p className="text-lg opacity-80 en">Loading promotions...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
                            <p className="text-lg text-red-600 dark:text-red-400 mb-4 en">
                                Unable to load promotions.
                            </p>
                            <button
                                onClick={fetchPromotions}
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredPromotions.length === 0 && (
                        <div className="text-center py-20 p-8 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                            <h3 className="text-xl font-semibold mb-2 en">No promotions found.</h3>
                            <p className="text-sm opacity-70 en mb-6">
                                {promotions.length === 0
                                    ? "No promotions available at the moment."
                                    : "No promotions match your search query."}
                            </p>
                        </div>
                    )}

                    {/* Promotions Table & Responsive Cards */}
                    {!loading && !error && filteredPromotions.length > 0 && (
                        <div 
                            className="rounded-xl shadow-lg border overflow-hidden backdrop-blur-sm"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }}>
                                            <th className="py-4 px-6 font-semibold text-sm en">Title</th>
                                            <th className="py-4 px-6 font-semibold text-sm en">Description</th>
                                            <th className="py-4 px-6 font-semibold text-sm en">Contact Info</th>
                                            <th className="py-4 px-6 font-semibold text-sm text-right en">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                        {filteredPromotions.map((pr) => (
                                            <tr key={pr.id} className="transition hover:opacity-90">
                                                {/* Title */}
                                                <td className="py-4 px-6">
                                                    <div className="font-medium en" style={{ color: 'var(--foreground)' }}>
                                                        {pr.title}
                                                    </div>
                                                </td>

                                                {/* Description */}
                                                <td className="py-4 px-6 max-w-xs truncate opacity-80 en" style={{ color: 'var(--foreground)' }}>
                                                    {pr.description}
                                                </td>

                                                {/* Contact Info */}
                                                <td className="py-4 px-6 text-sm opacity-80 en" style={{ color: 'var(--foreground)' }}>
                                                    <div>{pr.name}</div>
                                                    <div className="text-xs opacity-70">{pr.email}</div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(pr.link)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer en"
                                                        style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(pr)}
                                                        className="px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer bg-red-500 text-white hover:bg-red-600 en"
                                                    >
                                                        Delete
                                                    </button>
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
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
                            onClick={closeDeleteModal}
                        >
                            <div 
                                className="w-full max-w-md p-6 rounded-xl shadow-2xl border"
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold mb-2 en text-red-500">Delete Promotion?</h3>
                                <p className="text-sm mb-4 opacity-80 en">
                                    Are you sure you want to delete this promotion? This action cannot be undone.
                                </p>

                                {/* Selected Promotion Preview Card */}
                                <div 
                                    className="p-4 rounded-lg mb-6 border"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                                >
                                    <div className="font-semibold en text-base mb-1">{promotionToDelete.title}</div>
                                    <div className="text-xs opacity-70 en line-clamp-2">{promotionToDelete.description}</div>
                                </div>

                                {/* Modal Buttons */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium border transition en cursor-pointer disabled:opacity-50"
                                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition en cursor-pointer disabled:opacity-50"
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