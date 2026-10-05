"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Link as LinkIcon, DollarSign, User, Phone, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function EditPaymentReceiverPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [totalPaid, setTotalPaid] = useState(0);

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

    const fetchReceiver = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payment-receivers/${id}`);
            if (!res.ok) throw new Error("Failed to load payment receiver data");
            const resData = await res.json();
            const data = resData.data;

            setFormData({
                customerName: data.customerName || "",
                customerPhone: data.customerPhone || "",
                customerLocation: data.customerLocation || "",
                jobType: data.jobType || "",
                contractLink: data.contractLink || "",
                sitePhotoLink: data.sitePhotoLink || "",
                sitePlanLink: data.sitePlanLink || "",
                totalPrice: data.totalPrice || "",
            });
            setTotalPaid(Number(data.totalPaid || 0));
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error fetching details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchReceiver();
    }, [id, fetchReceiver]);

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

        if (!formData.customerName.trim()) {
            toast.error("Customer name is required");
            return;
        }
        if (!formData.jobType.trim()) {
            toast.error("Job type is required");
            return;
        }

        const newTotalPrice = Number(formData.totalPrice);
        if (!formData.totalPrice || newTotalPrice <= 0) {
            toast.error("Please enter a valid total job price greater than 0");
            return;
        }

        // Validate business rule: Total price cannot be lower than amount already paid
        if (newTotalPrice < totalPaid) {
            toast.error(`Total price cannot be lower than total amount already paid (${totalPaid.toLocaleString()} ETB)`);
            return;
        }

        // Validate URLs if entered
        if (!isValidUrl(formData.contractLink)) {
            toast.error("Contract link must be a valid URL");
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
        const toastId = toast.loading("Updating payment receiver...");

        try {
            const payload = {
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                customerLocation: formData.customerLocation.trim(),
                jobType: formData.jobType.trim(),
                contractLink: formData.contractLink.trim(),
                sitePhotoLink: formData.sitePhotoLink.trim(),
                sitePlanLink: formData.sitePlanLink.trim(),
                totalPrice: newTotalPrice,
            };

            const res = await fetch(`/api/payment-receivers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update payment receiver");

            toast.success("Payment receiver updated successfully!", { id: toastId });
            router.push(`/ahiadmin/view/payment-receivers/${id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error updating payment receiver", { id: toastId });
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <p className="text-sm font-medium opacity-80">Loading editor...</p>
            </div>
        );
    }

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/ahiadmin/view/payment-receivers/${id}`}
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Edit Payment Receiver</h1>
                        <p className="text-xs text-[var(--muted-foreground)]">
                            Update customer information and total project pricing.
                        </p>
                    </div>
                </div>
            </div>

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
                            <input
                                type="text"
                                name="customerName"
                                required
                                value={formData.customerName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Customer Phone</label>
                            <input
                                type="text"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold">Customer Location</label>
                            <input
                                type="text"
                                name="customerLocation"
                                value={formData.customerLocation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Job & Pricing */}
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Job Details & Total Price
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">
                                Job Type <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="jobType"
                                required
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">
                                Total Job Price (ETB) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="totalPrice"
                                required
                                min={totalPaid || 1}
                                step="any"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-mono font-bold bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                            {totalPaid > 0 && (
                                <p className="text-[11px] text-amber-500 font-medium">
                                    Minimum allowed price is {totalPaid.toLocaleString()} ETB (Total amount already paid).
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Links */}
                <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Document & Asset Links (URL)
                    </h2>

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold">Contract Link URL</label>
                            <input
                                type="url"
                                name="contractLink"
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
                                value={formData.sitePlanLink}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href={`/ahiadmin/view/payment-receivers/${id}`}
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
                                <Save className="w-4 h-4" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    );
}