"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Edit2, Copy, Send, Trash2, Link as LinkIcon,
    ExternalLink, Loader2, ArrowLeft, X
} from "lucide-react";
import { toast } from "sonner";

const SECTION_KEYS = [
    { sub: "subtitle1", con: "content1", num: "1" },
    { sub: "subtitle2", con: "content2", num: "2" },
    { sub: "subtitle3", con: "content3", num: "3" },
    { sub: "subtitle4", con: "content4", num: "4" },
    { sub: "subtitle5", con: "content5", num: "5" },
    { sub: "subtitle6", con: "content6", num: "6" },
    { sub: "subtitle7", con: "content7", num: "7" },
    { sub: "subtitle71", con: "content71", num: "7.1" },
    { sub: "subtitle72", con: "content72", num: "7.2" },
];

export default function ContractDetailPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const contractId = params.id;
    const router = useRouter();

    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchContract = async () => {
        try {
            const res = await fetch(`/api/contracts/${contractId}`);
            if (!res.ok) throw new Error("Failed to load contract");
            const resData = await res.json();
            setContract(resData.data);
        } catch (err) {
            console.error(err);
            toast.error("Unable to load contract details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const handlePublishToggle = async () => {
        if (!contract) return;
        setActionLoading(true);
        const isPublished = contract.status === "published";
        const action = isPublished ? "unpublish" : "publish";
        const toastId = toast.loading(`${isPublished ? "Unpublishing" : "Publishing"} contract...`);

        try {
            const res = await fetch(`/api/contracts/${contract.id}/${action}`, { method: "POST" });
            if (!res.ok) throw new Error(`Failed to ${action} contract`);

            toast.success(`Contract ${isPublished ? "unpublished" : "published"} successfully!`, { id: toastId });
            fetchContract();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} contract`, { id: toastId });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDuplicate = async () => {
        if (!contract) return;
        setActionLoading(true);
        const toastId = toast.loading("Duplicating contract...");

        try {
            const res = await fetch(`/api/contracts/${contract.id}/duplicate`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to duplicate contract");

            const resData = await res.json();
            const newContract = resData.data;

            toast.success("Contract duplicated successfully!", { id: toastId });
            router.push(`/ahiadmin/edit/contract/${newContract.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to duplicate contract", { id: toastId });
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!contract) return;
        setActionLoading(true);
        const toastId = toast.loading("Deleting contract...");

        try {
            const res = await fetch(`/api/contracts/${contract.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete contract");

            toast.success("Contract deleted successfully", { id: toastId });
            router.push("/ahiadmin/view/contracts");
        } catch (err) {
            console.error(err);
            toast.error("Unable to delete contract", { id: toastId });
            setActionLoading(false);
        }
    };

    const copyPublicLink = () => {
        if (!contract?.publicToken) return;
        const publicUrl = `${window.location.origin}/contracts/${contract.publicToken}`;
        navigator.clipboard.writeText(publicUrl);
        toast.success("Public contract link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <p className="text-sm font-medium opacity-80">Loading contract preview...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto">
                <h3 className="text-base font-bold text-rose-500">Contract Not Found</h3>
                <p className="text-xs opacity-75 mt-2">The requested contract could not be loaded.</p>
            </div>
        );
    }

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Top Navigation & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/ahiadmin/view/contracts"
                        className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                            Abu Hanifa Installation ET
                        </h1>
                        <p className="text-2xl font-extrabold mt-0.5">Contract Preview #{contract.id}</p>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={`/ahiadmin/edit/contract/${contract.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border)] hover:bg-[var(--muted)] transition"
                    >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={handleDuplicate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                    >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={handlePublishToggle}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${contract.status === "published"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                            }`}
                    >
                        {contract.status === "published" ? (
                            <>
                                <X className="w-3.5 h-3.5" /> Unpublish
                            </>
                        ) : (
                            <>
                                <Send className="w-3.5 h-3.5" /> Publish
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            </div>

            {/* Published Token Banner */}
            {contract.status === "published" && contract.publicToken && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <LinkIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate max-w-lg">
                            Public Contract Link: /contracts/{contract.publicToken}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={copyPublicLink}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold shadow-xs hover:bg-emerald-600 transition cursor-pointer"
                        >
                            Copy Link
                        </button>
                        <a
                            href={`/contracts/${contract.publicToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/20 transition"
                            title="Open Public Contract"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            )}

            {/* Legal Document Style Paper View */}
            <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl border border-[var(--border)] shadow-xl bg-white text-slate-900 font-sans leading-relaxed space-y-8 print:shadow-none print:p-0">
                {/* 1. HEADER / BRANDING (Estimation PDF style) */}
                <header className="border-b-2 border-slate-900 pb-4">
                    <div className="flex justify-between items-center gap-4">
                        {/* Logo - Top Left */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                            <img
                                src="/images/logo.jpg"
                                alt="Abuhanifa Installation Ethiopia Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Company Title & Subtitle - Centered */}
                        <div className="text-center flex-1">
                            <h1 className="text-lg sm:text-md font-extrabold text-slate-900 uppercase tracking-wide">
                                Abuhanifa Installation Ethiopia
                            </h1>
                            <h2 className="text-base sm:text-xl font-bold text-slate-800 mt-0.5">
                                አቡሐኒፋ ኢንስታሌሽን ኢትዮጲያ
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 font-semibold italic mt-1">
                                አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ – ለላቀ ጥራትና ታማኝነት ሁሌም ከፊት
                            </p>
                        </div>

                        <div className="w-20 sm:w-24 shrink-0 hidden sm:block"></div>
                    </div>

                    {/* Contact Info Header Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
                        <div><span className="font-bold">ስልክ:</span> +251936489696 / +251705489696</div>
                        <div><span className="font-bold">ቴሌግራም:</span> t.me/abuhanifainstallation</div>
                        <div><span className="font-bold">ኢሜይል:</span> abohanifainstallation@gmail.com</div>
                        <div><span className="font-bold">ዌብሳይት:</span> www.abuhanifainstallation.com</div>
                    </div>
                </header>

                {/* Document Main Title - Centered */}
                {contract.mainTitle && (
                    <div className="text-center pt-2 pb-1">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 underline decoration-1 underline-offset-4">
                            {contract.mainTitle}
                        </h2>
                    </div>
                )}

                {/* Customer & Contract Meta Block */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1">
                        <p className="text-slate-500 uppercase tracking-wider font-semibold">Client Information</p>
                        <p className="font-bold text-sm text-slate-900">{contract.customerName || "—"}</p>
                        <p className="text-slate-700">Phone: {contract.customerPhone || "—"}</p>
                        <p className="text-slate-700">Address: {contract.customerAddress || "—"}</p>
                    </div>
                    <div className="space-y-1 sm:text-right">
                        <p className="text-slate-500 uppercase tracking-wider font-semibold">Document Metadata</p>
                        <p className="text-slate-700">
                            Contract Date:{" "}
                            <span className="font-semibold text-slate-900">
                                {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "—"}
                            </span>
                        </p>
                        <p className="text-slate-700">
                            Status:{" "}
                            <span className="font-semibold uppercase text-slate-900">{contract.status || "Draft"}</span>
                        </p>
                    </div>
                </div>

                {/* Contract Sections - Titles Centered */}
                <div className="space-y-6 text-sm text-slate-800">
                    {SECTION_KEYS.map(({ sub, con, num }) => {
                        const subtitle = contract[sub];
                        const content = contract[con];

                        if (!subtitle && !content) return null;

                        return (
                            <div key={num} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
                                {subtitle && (
                                    <h3 className="text-base font-bold text-slate-900 text-center border-b border-slate-200 pb-1">
                                        {num}. {subtitle}
                                    </h3>
                                )}
                                {content && <p className="whitespace-pre-wrap leading-relaxed opacity-90 text-justify">{content}</p>}
                            </div>
                        );
                    })}
                </div>

                {/* Signatures & Admin Stamp */}
                <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                    <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <p className="font-bold uppercase text-slate-700 text-center border-b pb-1">Client Signature</p>
                        <p className="text-slate-800">Name: <span className="font-semibold">{contract.customerName || "—"}</span></p>
                        <p className="text-slate-800">Signature: ___________________________</p>
                        <p className="text-slate-800">Date: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "________________"}</p>
                    </div>

                    <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <p className="font-bold uppercase text-slate-700 text-center border-b pb-1">Company Representative</p>
                        <p className="text-slate-800">Name: <span className="font-semibold">Jemal Nurye Yimam</span></p>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-800">Signature:</span>
                            <div className="relative w-28 h-10">
                                <img
                                    src="/images/signature.jpg"
                                    alt="Admin Signature"
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                        </div>
                        <p className="text-slate-800">Date: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "________________"}</p>
                    </div>
                </div>

                {/* FOOTER / BIO (Estimation PDF style) */}
                <footer className="pt-6 border-t border-slate-300 text-center space-y-1 text-xs text-slate-700">
                    <p className="font-bold text-sm text-slate-900">
                        Estimated / Approved By: Jemal Nurye Yimam
                    </p>
                    <p className="font-semibold text-slate-700">
                        Project Manager | Certified Electrician & Plumber
                    </p>
                    <p className="font-extrabold text-slate-900 pt-1">
                        አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ – ለላቀ ጥራትና ታማኝነት ሁሌም ከፊት
                    </p>
                </footer>
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-rose-500">Delete Contract?</h3>
                        <p className="text-xs opacity-80 leading-relaxed">
                            Are you sure you want to delete this contract for{" "}
                            <span className="font-bold">{contract.customerName}</span>?
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition cursor-pointer shadow-xs"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}