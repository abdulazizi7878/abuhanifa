"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import ImageViewer from "@/components/imgviewer";

export default function ViewOrders() {
    const [jobOrders, setJobOrders] = useState([]);
    const [productOrders, setProductOrders] = useState([]);
    
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorJobs, setErrorJobs] = useState(false);
    const [errorProducts, setErrorProducts] = useState(false);

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

    // Fetch Product Orders
    const fetchProductOrders = async () => {
        setLoadingProducts(true);
        setErrorProducts(false);
        try {
            const response = await fetch("/api/showproductorders", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch product orders.');
            }
            const data = await response.json();
            setProductOrders(data?.data || []);
        } catch (err) {
            console.error(err);
            setErrorProducts(true);
            toast.error('Unable to load product orders.');
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchJobOrders();
        fetchProductOrders();
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

    // Filtered Product Orders
    const filteredProductOrders = useMemo(() => {
        return productOrders.filter((or) => {
            const query = searchQuery.toLowerCase();
            const username = (or.username || "").toLowerCase();
            const phone = (or.phone_number || "").toLowerCase();
            const location = (or.location || "").toLowerCase();
            const account = (or.account_number || "").toLowerCase();
            const productName = (or.product_name || "").toLowerCase();

            return (
                !searchQuery ||
                username.includes(query) ||
                phone.includes(query) ||
                location.includes(query) ||
                account.includes(query) ||
                productName.includes(query)
            );
        });
    }, [productOrders, searchQuery]);

    const isLoading = loadingJobs || loadingProducts;

    return (
        <>
            <main className="">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Page Title Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                Orders Management
                            </h1>
                            <p className="mt-1 text-sm opacity-80 en">
                                View and manage all job and product orders.
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
                            className="w-full sm:w-96 px-4 py-2.5 rounded-lg border text-sm en bg-background text-foreground focus:outline-none focus:ring-2"
                            style={{ borderColor: 'var(--border)' }}
                        />
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-20">
                            <p className="text-lg opacity-80 en">Loading orders...</p>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="space-y-12">
                            {/* Job Orders Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                    All Job Orders
                                </h2>

                                {errorJobs ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load job orders.</p>
                                        <button onClick={fetchJobOrders} className="px-4 py-2 rounded-lg text-xs font-medium bg-() text-()">Try Again</button>
                                    </div>
                                ) : filteredJobOrders.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-sm opacity-70 en">No job orders found matching your search.</p>
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
                                                        <th className="py-4 px-6 font-semibold text-sm en">Client Info</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Job Details</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Comment</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                                    {filteredJobOrders.map((or, index) => (
                                                        <tr key={index} className="transition hover:opacity-90">
                                                            <td className="py-4 px-6 align-top">
                                                                <div className="font-medium text-sm en" style={{ color: 'var(--foreground)' }}>{or.name}</div>
                                                                <div className="text-xs opacity-70 en">{or.phone_number}</div>
                                                                <div className="text-xs opacity-70 en">{or.location}</div>
                                                            </td>
                                                            <td className="py-4 px-6 align-top text-sm en" style={{ color: 'var(--foreground)' }}>
                                                                <div className="font-semibold">{or.job}</div>
                                                                <div className="text-xs opacity-70">{or.job_type}</div>
                                                            </td>
                                                            <td className="py-4 px-6 align-top text-sm en opacity-90" style={{ color: 'var(--foreground)' }}>
                                                                {or.comment ? (
                                                                    <div className="p-3 rounded-lg border border-() bg-background/50 text-xs">
                                                                        {or.comment}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-foreground/40 italic text-xs">Skipped by the user</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Orders Section */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                    All Product Orders
                                </h2>

                                {errorProducts ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-red-500/30 bg-red-500/10">
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-2 en">Unable to load product orders.</p>
                                        <button onClick={fetchProductOrders} className="px-4 py-2 rounded-lg text-xs font-medium bg-() text-()">Try Again</button>
                                    </div>
                                ) : filteredProductOrders.length === 0 ? (
                                    <div className="text-center py-10 p-6 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
                                        <p className="text-sm opacity-70 en">No product orders found matching your search.</p>
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
                                                        <th className="py-4 px-6 font-semibold text-sm en">Customer</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Product</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Financials</th>
                                                        <th className="py-4 px-6 font-semibold text-sm en">Images</th>
                                                        <th className="py-4 px-6 font-semibold text-sm text-right en">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                                    {filteredProductOrders.map((or, index) => (
                                                        <tr key={index} className="transition hover:opacity-90">
                                                            <td className="py-4 px-6 align-top">
                                                                <div className="font-medium text-sm en" style={{ color: 'var(--foreground)' }}>{or.username}</div>
                                                                <div className="text-xs opacity-70 en">{or.phone_number}</div>
                                                                <div className="text-xs opacity-70 en">{or.location}</div>
                                                                <div className="text-xs opacity-50 en mt-1">Acc: {or.account_number}</div>
                                                            </td>
                                                            <td className="py-4 px-6 align-top text-sm en" style={{ color: 'var(--foreground)' }}>
                                                                <div className="font-semibold">{or.product_name}</div>
                                                                <div className="text-xs opacity-70">Qty: {or.amount}</div>
                                                            </td>
                                                            <td className="py-4 px-6 align-top text-sm en" style={{ color: 'var(--foreground)' }}>
                                                                <div>Price: {or.price}</div>
                                                                <div className="font-bold text-xs opacity-90 mt-1">Total: {Number(or.price) * Number(or.amount)}</div>
                                                            </td>
                                                            <td className="py-4 px-6 align-top space-y-2 text-xs en">
                                                                {or.image && (
                                                                    <div>
                                                                        <button
                                                                            onClick={() => setViewingImage(or.image)}
                                                                            className="text-blue-500 hover:underline font-medium cursor-pointer"
                                                                        >
                                                                            View Receipt
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {or.product_image && (
                                                                    <div>
                                                                        <button
                                                                            onClick={() => setViewingImage(or.product_image)}
                                                                            className="text-blue-500 hover:underline font-medium cursor-pointer"
                                                                        >
                                                                            View Product
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6 align-top text-right text-xs opacity-70 en">
                                                                {or.created_at}
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