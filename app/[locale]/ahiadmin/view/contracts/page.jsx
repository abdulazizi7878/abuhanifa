"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus, Search, Eye, Edit2, Copy, Send, SendHorizontal, Trash2,
    ChevronLeft, ChevronRight, FileText, Loader2, Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";

export default function ContractsListPage() {
    const router = useRouter();

    const [contracts, setContracts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [contractToDelete, setContractToDelete] = useState(null);

    const fetchContracts = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search.trim()) params.append("search", search.trim());
            if (status) params.append("status", status);

            const res = await fetch(`/api/contracts?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch contracts");

            const responseData = await res.json();
            setContracts(responseData.data || []);
            if (responseData.pagination) {
                setPagination(responseData.pagination);
            }
        } catch (err) {
            console.error(err);
            toast.error("Unable to load contracts");
        } finally {
            setLoading(false);
        }
    }, [search, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchContracts(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, status, fetchContracts]);

    const handlePublishToggle = async (contract) => {
        setActionLoadingId(contract.id);
        const isPublished = contract.status === "published";
        const action = isPublished ? "unpublish" : "publish";
        const toastId = toast.loading(`${isPublished ? "Unpublishing" : "Publishing"} contract...`);

        try {
            const res = await fetch(`/api/contracts/${contract.id}/${action}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(`Failed to ${action} contract`);

            toast.success(`Contract ${isPublished ? "unpublished" : "published"} successfully!`, { id: toastId });
            fetchContracts(pagination.page);
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} contract`, { id: toastId });
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDuplicate = async (contractId) => {
        setActionLoadingId(contractId);
        const toastId = toast.loading("Duplicating contract...");

        try {
            const res = await fetch(`/api/contracts/${contractId}/duplicate`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Failed to duplicate contract");

            const resData = await res.json();
            const newContract = resData.data;

            toast.success("Contract duplicated successfully!", { id: toastId });
            router.push(`/ahiadmin/edit/contract/${newContract.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to duplicate contract", { id: toastId });
            setActionLoadingId(null);
        }
    };

    const confirmDelete = async () => {
        if (!contractToDelete) return;
        setActionLoadingId(contractToDelete.id);
        const toastId = toast.loading("Deleting contract...");

        try {
            const res = await fetch(`/api/contracts/${contractToDelete.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete contract");

            toast.success("Contract deleted successfully", { id: toastId });
            setContractToDelete(null);
            fetchContracts(pagination.page);
        } catch (err) {
            console.error(err);
            toast.error("Unable to delete contract", { id: toastId });
        } finally {
            setActionLoadingId(null);
        }
    };

    const copyPublicLink = (publicToken) => {
        if (!publicToken) return;
        const publicUrl = `${window.location.origin}/contracts/${publicToken}`;
        navigator.clipboard.writeText(publicUrl);
        toast.success("Public contract link copied to clipboard!");
    };

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Title Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)]">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                        Abu Hanifa Installation ET
                    </h1>
                    <p className="text-2xl sm:text-3xl font-extrabold mt-1">Contracts</p>
                </div>

                <Link
                    href="/ahiadmin/create/contract"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Create Contract</span>
                </Link>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Search by customer or title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full sm:w-44 px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    <p className="text-sm font-medium opacity-80">Loading contracts list...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && contracts.length === 0 && (
                <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto space-y-4">
                    <FileText className="w-12 h-12 mx-auto text-[var(--muted-foreground)] opacity-50" />
                    <h3 className="text-base font-bold">No contracts found</h3>
                    <p className="text-xs opacity-75">
                        {search || status
                            ? "No contracts match your search and filter criteria."
                            : "Get started by creating your first installation contract."}
                    </p>
                    {!search && !status && (
                        <Link
                            href="/ahiadmin/create/contract"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)]"
                        >
                            <Plus className="w-4 h-4" /> Create Contract
                        </Link>
                    )}
                </div>
            )}

            {/* Contracts Table & Responsive List */}
            {!loading && contracts.length > 0 && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)] overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Main Title</th>
                                    <th className="py-3.5 px-4">Contract Date</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4">Created Date</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {contracts.map((contract) => (
                                    <tr key={contract.id} className="transition hover:bg-[var(--border)]/10">
                                        <td className="py-4 px-4 font-semibold">
                                            <div>{contract.customerName}</div>
                                            <div className="text-xs font-normal opacity-70">{contract.customerPhone || "—"}</div>
                                        </td>
                                        <td className="py-4 px-4 max-w-[200px] truncate" title={contract.mainTitle}>
                                            {contract.mainTitle}
                                        </td>
                                        <td className="py-4 px-4 font-mono text-xs">
                                            {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${contract.status === "published"
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                                    }`}
                                            >
                                                {contract.status || "draft"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs opacity-75 font-mono">
                                            {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/ahiadmin/view/contracts/${contract.id}`}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer"
                                                    title="View Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/ahiadmin/edit/contract/${contract.id}`}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer"
                                                    title="Edit Contract"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    disabled={actionLoadingId === contract.id}
                                                    onClick={() => handleDuplicate(contract.id)}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer disabled:opacity-50"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={actionLoadingId === contract.id}
                                                    onClick={() => handlePublishToggle(contract)}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer disabled:opacity-50"
                                                    title={contract.status === "published" ? "Unpublish" : "Publish"}
                                                >
                                                    {contract.status === "published" ? (
                                                        <SendHorizontal className="w-4 h-4 text-amber-500" />
                                                    ) : (
                                                        <Send className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                </button>
                                                {contract.status === "published" && contract.publicToken && (
                                                    <button
                                                        type="button"
                                                        onClick={() => copyPublicLink(contract.publicToken)}
                                                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--primary)] transition cursor-pointer"
                                                        title="Copy Public Link"
                                                    >
                                                        <LinkIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    disabled={actionLoadingId === contract.id}
                                                    onClick={() => setContractToDelete(contract)}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-rose-500/10 text-rose-500 transition cursor-pointer disabled:opacity-50"
                                                    title="Delete Contract"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {contracts.map((contract) => (
                            <div
                                key={contract.id}
                                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h4 className="font-bold text-base">{contract.customerName}</h4>
                                        <p className="text-xs text-[var(--muted-foreground)]">{contract.customerPhone || "No phone"}</p>
                                    </div>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${contract.status === "published"
                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                            }`}
                                    >
                                        {contract.status || "draft"}
                                    </span>
                                </div>

                                <div className="text-xs space-y-1">
                                    <p className="font-semibold">{contract.mainTitle}</p>
                                    <p className="text-[var(--muted-foreground)] font-mono">
                                        Date: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "—"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                                    <Link
                                        href={`/ahiadmin/view/contracts/${contract.id}`}
                                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/ahiadmin/edit/contract/${contract.id}`}
                                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDuplicate(contract.id)}
                                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium"
                                    >
                                        Duplicate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handlePublishToggle(contract)}
                                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium"
                                    >
                                        {contract.status === "published" ? "Unpublish" : "Publish"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContractToDelete(contract)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                            <p className="text-xs text-[var(--muted-foreground)]">
                                Showing page <span className="font-semibold text-[var(--foreground)]">{pagination.page}</span> of{" "}
                                <span className="font-semibold text-[var(--foreground)]">{pagination.totalPages}</span> ({pagination.total} total)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={!pagination.hasPreviousPage}
                                    onClick={() => fetchContracts(pagination.page - 1)}
                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-40 transition cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => fetchContracts(pagination.page + 1)}
                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-40 transition cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            {contractToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setContractToDelete(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-rose-500">Delete Contract?</h3>
                        <p className="text-xs opacity-80 leading-relaxed">
                            Are you sure you want to delete the contract for{" "}
                            <span className="font-bold">{contractToDelete.customerName}</span>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setContractToDelete(null)}
                                className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
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