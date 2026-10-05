"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Link as LinkIcon, DollarSign, User, Phone, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function CreatePaymentReceiverPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        customerLocation: "",
        jobType: "",
        contractLink: "",
        sitePhotoLink: "",
        sitePlanLink: "",
        totalPrice: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isValidUrl = (string) => {
        if (!string.trim()) return true;
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.customerName.trim()) {
            toast.error("Customer name is required");
            return;
        }
        if (!formData.jobType.trim()) {
            toast.error("Job type is required");
            return;
        }
        if (!formData.totalPrice || Number(formData.totalPrice) <= 0) {
            toast.error("Please enter a valid total job price greater than 0");
            return;
        }

        // Validate URLs if provided
        if (!isValidUrl(formData.contractLink)) {
            toast.error("Contract link must be a valid URL (e.g. https://...)");
            return;
        }
        if (!isValidUrl(formData.sitePhotoLink)) {
            toast.error("Site photo link must be a valid URL");
            return;
        }
        if (!isValidUrl(formData.sitePlanLink)) {
            toast.error("Site plan link must be a valid URL");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Creating payment receiver...");

        try {
            const payload = {
                ...formData,
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                customerLocation: formData.customerLocation.trim(),
                jobType: formData.jobType.trim(),
                contractLink: formData.contractLink.trim(),
                sitePhotoLink: formData.sitePhotoLink.trim(),
                sitePlanLink: formData.sitePlanLink.trim(),
                totalPrice: Number(formData.totalPrice),
            };

            const res = await fetch("/api/payment-receivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to create payment receiver");

            toast.success("Payment receiver created successfully!", { id: toastId });
            router.push(`/ahiadmin/view/payment-receivers/${resData.data.id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error creating payment receiver", { id: toastId });
            setSubmitting(false);
        }
    };

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6 max-w-4xl mx-auto">
            {/* Navigation Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/ahiadmin/view/payment-receivers"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Create Payment Receiver</h1>
                        <p className="text-xs text-[var(--muted-foreground)]">
                            Record customer job details and set up installation project payment tracking.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Customer Details */}
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                        <User className="w-4 h-4" /> Customer Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">
                                Customer Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="text"
                                    name="customerName"
                                    required
                                    placeholder="e.g. Ahmed Ali"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Customer Phone</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="text"
                                    name="customerPhone"
                                    placeholder="e.g. 0912345678"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold">Customer Location / Site Address</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="text"
                                    name="customerLocation"
                                    placeholder="e.g. Addis Ababa, Bole Subcity"
                                    value={formData.customerLocation}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Job & Pricing */}
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Job Details & Financials
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">
                                Job Type <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="text"
                                    name="jobType"
                                    required
                                    placeholder="e.g. Electrical Installation, Plumbing"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">
                                Total Job Price (ETB) <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                <input
                                    type="number"
                                    name="totalPrice"
                                    required
                                    min="1"
                                    step="any"
                                    placeholder="e.g. 80000"
                                    value={formData.totalPrice}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] text-sm font-mono font-bold bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Document Links */}
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" /> Document & Asset Links (URL)
                        </h2>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            Provide web link URLs to contracts, photos, or site plans if available.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Contract Link URL</label>
                            <input
                                type="url"
                                name="contractLink"
                                placeholder="https://example.com/contract/abc"
                                value={formData.contractLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Site Photo Link URL</label>
                            <input
                                type="url"
                                name="sitePhotoLink"
                                placeholder="https://example.com/photo/xyz"
                                value={formData.sitePhotoLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Site Plan Link URL</label>
                            <input
                                type="url"
                                name="sitePlanLink"
                                placeholder="https://example.com/plan/123"
                                value={formData.sitePlanLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/ahiadmin/payment-receivers"
                        className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)] transition cursor-pointer"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save & Continue
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    );
}