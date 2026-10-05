"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus, Search, Eye, Edit2, Trash2, Loader2, DollarSign, UserCheck, AlertCircle, Phone, MapPin, Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentReceiversListPage() {
    const router = useRouter();
    const [receivers, setReceivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [receiverToDelete, setReceiverToDelete] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchReceivers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payment-receivers");
            if (!res.ok) throw new Error("Failed to load payment receivers");
            const resData = await res.json();
            setReceivers(resData.data || []);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error fetching payment records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReceivers();
    }, [fetchReceivers]);

    const confirmDelete = async () => {
        if (!receiverToDelete) return;
        setActionLoadingId(receiverToDelete.id);
        const toastId = toast.loading("Deleting payment record...");

        try {
            const res = await fetch(`/api/payment-receivers/${receiverToDelete.id}`, {
                method: "DELETE",
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete payment record");

            toast.success("Payment record deleted successfully", { id: toastId });
            setReceiverToDelete(null);
            fetchReceivers();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Unable to delete record", { id: toastId });
        } finally {
            setActionLoadingId(null);
        }
    };

    // Extract unique job types for filter dropdown
    const jobTypes = Array.from(new Set(receivers.map((r) => r.jobType).filter(Boolean)));

    const filteredReceivers = receivers.filter((r) => {
        const matchesSearch =
            (r.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
            (r.customerPhone || "").includes(search) ||
            (r.customerLocation || "").toLowerCase().includes(search.toLowerCase());
        const matchesJob = jobTypeFilter ? r.jobType === jobTypeFilter : true;
        return matchesSearch && matchesJob;
    });

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)]">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                        Abu Hanifa Installation ET
                    </h1>
                    <p className="text-2xl sm:text-3xl font-extrabold mt-1">Payment Receivers</p>
                </div>

                <Link
                    href="/ahiadmin/create/payment-receivers"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>New Payment Receiver</span>
                </Link>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Search name, phone, location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>

                {jobTypes.length > 0 && (
                    <select
                        value={jobTypeFilter}
                        onChange={(e) => setJobTypeFilter(e.target.value)}
                        className="w-full sm:w-52 px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    >
                        <option value="">All Job Types</option>
                        {jobTypes.map((job) => (
                            <option key={job} value={job}>
                                {job}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    <p className="text-sm font-medium opacity-80">Loading payment records...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredReceivers.length === 0 && (
                <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto space-y-4">
                    <DollarSign className="w-12 h-12 mx-auto text-[var(--muted-foreground)] opacity-50" />
                    <h3 className="text-base font-bold">No payment records found</h3>
                    <p className="text-xs opacity-75">
                        {search || jobTypeFilter
                            ? "No payment receivers match your search criteria."
                            : "Get started by recording a new installation payment receiver."}
                    </p>
                    {!search && !jobTypeFilter && (
                        <Link
                            href="/ahiadmin/create/payment-receivers"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)]"
                        >
                            <Plus className="w-4 h-4" /> Create Payment Receiver
                        </Link>
                    )}
                </div>
            )}

            {/* Content Table / Cards */}
            {!loading && filteredReceivers.length > 0 && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)] overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Job Type</th>
                                    <th className="py-3.5 px-4 text-right">Total Price</th>
                                    <th className="py-3.5 px-4 text-right">Total Paid</th>
                                    <th className="py-3.5 px-4 text-right">Remaining</th>
                                    <th className="py-3.5 px-4">Created</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredReceivers.map((rec) => {
                                    const isFullyPaid = Number(rec.remaining) <= 0;
                                    return (
                                        <tr key={rec.id} className="transition hover:bg-[var(--border)]/10">
                                            <td className="py-4 px-4 font-semibold">
                                                <div>{rec.customerName}</div>
                                                <div className="text-xs font-normal opacity-70 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3 inline shrink-0" />
                                                    {rec.customerPhone || "—"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 max-w-[180px] truncate" title={rec.jobType}>
                                                <div className="font-medium">{rec.jobType}</div>
                                                {rec.customerLocation && (
                                                    <div className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3 inline shrink-0" />
                                                        {rec.customerLocation}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-right font-mono font-bold">
                                                {Number(rec.totalPrice || 0).toLocaleString()} ETB
                                            </td>
                                            <td className="py-4 px-4 text-right font-mono text-emerald-500 font-semibold">
                                                {Number(rec.totalPaid || 0).toLocaleString()} ETB
                                            </td>
                                            <td className="py-4 px-4 text-right font-mono">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${isFullyPaid
                                                            ? "bg-emerald-500/10 text-emerald-500"
                                                            : "bg-rose-500/10 text-rose-500"
                                                        }`}
                                                >
                                                    {Number(rec.remaining || 0).toLocaleString()} ETB
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-xs opacity-75 font-mono">
                                                {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/ahiadmin/view/payment-receivers/${rec.id}`}
                                                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer"
                                                        title="Manage Payments"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/ahiadmin/payment-receivers/${rec.id}/edit`}
                                                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer"
                                                        title="Edit Info"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={actionLoadingId === rec.id}
                                                        onClick={() => setReceiverToDelete(rec)}
                                                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-rose-500/10 text-rose-500 transition cursor-pointer disabled:opacity-50"
                                                        title="Delete Receiver"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Responsive Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredReceivers.map((rec) => {
                            const isFullyPaid = Number(rec.remaining) <= 0;
                            return (
                                <div
                                    key={rec.id}
                                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-3"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-bold text-base">{rec.customerName}</h4>
                                            <p className="text-xs opacity-70">{rec.customerPhone || "No phone"}</p>
                                        </div>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFullyPaid
                                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                                    : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                                                }`}
                                        >
                                            {isFullyPaid ? "Fully Paid" : "Unpaid Balance"}
                                        </span>
                                    </div>

                                    <div className="text-xs space-y-1 pt-1 border-t border-[var(--border)]/50">
                                        <p className="font-semibold flex items-center gap-1">
                                            <Briefcase className="w-3.5 h-3.5 opacity-70" />
                                            {rec.jobType}
                                        </p>
                                        {rec.customerLocation && (
                                            <p className="opacity-75 flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 opacity-70" />
                                                {rec.customerLocation}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[var(--border)]/10 text-xs font-mono">
                                        <div>
                                            <div className="text-[10px] opacity-60 uppercase font-sans">Total</div>
                                            <div className="font-bold">{Number(rec.totalPrice || 0).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-emerald-500 uppercase font-sans font-semibold">Paid</div>
                                            <div className="font-bold text-emerald-500">{Number(rec.totalPaid || 0).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-rose-500 uppercase font-sans font-semibold">Remain</div>
                                            <div className="font-bold text-rose-500">{Number(rec.remaining || 0).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                                        <Link
                                            href={`/ahiadmin/view/payment-receivers/${rec.id}`}
                                            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center gap-1"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Manage
                                        </Link>
                                        <Link
                                            href={`/ahiadmin/edit/payment-receivers/${rec.id}`}
                                            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setReceiverToDelete(rec)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Delete Modal Confirmation */}
            {receiverToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setReceiverToDelete(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 text-rose-500">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <h3 className="text-lg font-bold">Delete Payment Record?</h3>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">
                            Are you sure you want to delete the payment receiver record for{" "}
                            <span className="font-bold">{receiverToDelete.customerName}</span>?
                            <br />
                            <strong className="text-rose-500">
                                WARNING: All attached payment stage records will be permanently removed!
                            </strong>
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setReceiverToDelete(null)}
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