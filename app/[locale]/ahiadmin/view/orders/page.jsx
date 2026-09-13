"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import ImageViewer from "@/components/imgviewer";

export default function ViewOrders() {
    const [jobOrders, setJobOrders] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [errorJobs, setErrorJobs] = useState(false);

    // Active Dropdown Menu State
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Image viewer modal states
    const [viewingImage, setViewingImage] = useState(null);

    // Fetch Job Orders
    const fetchJobOrders = async () => {
        setLoadingJobs(true);
        setErrorJobs(false);
        try {
            const response = await fetch("/api/showallorders", {
                method: "POST"
            });
            if (!response.ok) {
                throw new Error('Failed to fetch job orders.');
            }
            const responseData = await response.json();
            setJobOrders(responseData?.orders || []);
        } catch (err) {
            console.error(err);
            setErrorJobs(true);
            toast.error('Unable to load job orders.');
        } finally {
            setLoadingJobs(false);
        }
    };

    // Close dropdown menu when clicking anywhere outside
    useEffect(() => {
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    // Open Delete Modal
    const openDeleteModal = (order) => {
        setActiveMenuId(null);
        setSelectedOrder(order);
        setDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        if (isDeleting) return;
        setSelectedOrder(null);
        setDeleteModalOpen(false);
    };

    // Confirm Delete Handler
    const confirmDelete = async () => {
        if (!selectedOrder) return;

        setIsDeleting(true);
        try {
            const response = await fetch("/api/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item: "orders",
                    id: selectedOrder.id,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "We couldn't delete the item");
            }

            toast.success(data.message || "Item Deleted successfully");
            // Remove the deleted order from local state
            setJobOrders((prevOrders) => prevOrders.filter((order) => order.id !== selectedOrder.id));
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "We couldn't delete the item");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchJobOrders();
    }, []);

    // Filtered Job Orders
    const filteredJobOrders = useMemo(() => {
        return jobOrders.filter((or) => {
            const query = searchQuery.toLowerCase();
            const name = (or.name || "").toLowerCase();
            const phone = (or.phone_number || "").toLowerCase();
            const location = (or.location || "").toLowerCase();
            const job = (or.job || "").toLowerCase();
            const jobType = (or.job_type || "").toLowerCase();
            const comment = (or.comment || "").toLowerCase();

            return (
                !searchQuery ||
                name.includes(query) ||
                phone.includes(query) ||
                location.includes(query) ||
                job.includes(query) ||
                jobType.includes(query) ||
                comment.includes(query)
            );
        });
    }, [jobOrders, searchQuery]);


    const isLoading = loadingJobs;

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
                                Orders Management
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, phone, location, product, or details..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-96 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-28">
                            <p className="text-base font-medium opacity-80 en">Loading orders...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="space-y-12">
                            {/* Job Orders Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en text-[var(--foreground)]">
                                    All Job Orders
                                </h2>

                                {errorJobs ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load job orders.</p>
                                        <button onClick={fetchJobOrders} className="px-4 py-2 rounded-lg text-xs font-medium bg-[var(--primary)] text-white">Try Again</button>
                                    </div>
                                ) : filteredJobOrders.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed border-[var(--border)]">
                                        <p className="text-sm opacity-70 en">No job orders found matching your search.</p>
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]"
                                    >
                                        <div className="overflow-x-auto min-h-[300px]">
                                            <table className="w-full text-left border-collapse text-sm en">
                                                <thead>
                                                    <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                                        <th className="py-3.5 px-4">Client Info</th>
                                                        <th className="py-3.5 px-4">Job Details</th>
                                                        <th className="py-3.5 px-4">Comment</th>
                                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border)]">
                                                    {filteredJobOrders.map((or, index) => (
                                                        <tr key={or.id || index} className="transition hover:bg-[var(--border)]/10">
                                                            <td className="py-4 px-4 align-top">
                                                                <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{or.name}</div>
                                                                <div className="text-xs opacity-70">{or.phone_number}</div>
                                                                <div className="text-xs opacity-70">{or.location}</div>
                                                                <div className="text-[10px] opacity-50 mt-1">ID: {or.id}</div>
                                                            </td>
                                                            <td className="py-4 px-4 align-top text-sm" style={{ color: 'var(--foreground)' }}>
                                                                <div className="font-semibold">{or.job}</div>
                                                                <div className="text-xs opacity-70">{or.job_type}</div>
                                                            </td>
                                                            <td className="py-4 px-4 align-top text-sm opacity-90" style={{ color: 'var(--foreground)' }}>
                                                                {or.comment ? (
                                                                    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--border)]/5 text-xs">
                                                                        {or.comment}
                                                                    </div>
                                                                ) : (
                                                                    <span className="opacity-40 italic text-xs">Skipped by the user</span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-4 align-top text-right">
                                                                <div
                                                                    className="relative inline-block text-left"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveMenuId(activeMenuId === `order-${or.id}` ? null : `order-${or.id}`)}
                                                                        className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                                                        title="Actions"
                                                                    >
                                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                            <circle cx="12" cy="5" r="2" />
                                                                            <circle cx="12" cy="12" r="2" />
                                                                            <circle cx="12" cy="19" r="2" />
                                                                        </svg>
                                                                    </button>

                                                                    {activeMenuId === `order-${or.id}` && (
                                                                        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                                                            <div>
                                                                                <button
                                                                                    onClick={() => openDeleteModal(or)}
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
                    {deleteModalOpen && selectedOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={closeDeleteModal}>
                            <div
                                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-red-500 en">
                                        Confirm Deletion
                                    </h3>
                                    <p className="text-sm opacity-80 en leading-relaxed">
                                        Are you sure you want to delete the order for <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{selectedOrder.name}</span>? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="p-3 rounded-lg border border-[var(--border)] text-xs space-y-1 bg-[var(--border)]/5">
                                    <div className="opacity-70"><span className="font-medium">Item ID:</span> {selectedOrder.id}</div>
                                    <div className="opacity-70"><span className="font-medium">Job:</span> {selectedOrder.job} ({selectedOrder.job_type})</div>
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

                    {/* Image Viewer Modal */}
                    {viewingImage && (
                        <ImageViewer
                            imageSrc={viewingImage}
                            OnClick={() => setViewingImage(null)}
                        />
                    )}
                </div>
            </main>
        </>
    );
}