"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Edit2, Trash2, Plus, ExternalLink, Loader2, DollarSign,
    CheckCircle2, Clock, AlertTriangle, FileText, Image as ImageIcon, Map, Phone, MapPin, Briefcase, Calendar
} from "lucide-react";
import { toast } from "sonner";

const PAYMENT_STAGES = [
    { value: "kabd", label: "Kabd / Upfront Payment" },
    { value: "first", label: "1st Payment" },
    { value: "second", label: "2nd Payment" },
    { value: "third", label: "3rd Payment" },
    { value: "fourth", label: "4th Payment" },
    { value: "fifth", label: "5th Payment" },
];

export default function PaymentReceiverDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [receiver, setReceiver] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStageToAdd, setSelectedStageToAdd] = useState("");
    const [addPaymentForm, setAddPaymentForm] = useState({
        amount: "",
        paymentDate: new Date().toISOString().substring(0, 10),
        receiptLink: "",
    });

    const [editingPayment, setEditingPayment] = useState(null);
    const [editPaymentForm, setEditPaymentForm] = useState({
        amount: "",
        paymentDate: "",
        receiptLink: "",
    });

    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchReceiverDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payment-receivers/${id}`);
            if (!res.ok) throw new Error("Failed to load payment receiver details");
            const resData = await res.json();
            setReceiver(resData.data);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error fetching details");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchReceiverDetail();
    }, [id, fetchReceiverDetail]);

    // Open Add Payment Modal
    const openAddModal = (stageValue) => {
        setSelectedStageToAdd(stageValue);
        setAddPaymentForm({
            amount: "",
            paymentDate: new Date().toISOString().substring(0, 10),
            receiptLink: "",
        });
        setIsAddModalOpen(true);
    };

    // Submit Add Payment
    const handleAddPaymentSubmit = async (e) => {
        e.preventDefault();
        const amt = Number(addPaymentForm.amount);
        if (!amt || amt <= 0) {
            toast.error("Payment amount must be greater than zero");
            return;
        }

        const potentialTotal = Number(receiver.totalPaid || 0) + amt;
        if (potentialTotal > Number(receiver.totalPrice || 0)) {
            toast.error(`Payment amount exceeds remaining balance (${Number(receiver.remaining || 0).toLocaleString()} ETB)`);
            return;
        }

        setActionLoading(true);
        const toastId = toast.loading("Adding payment record...");

        try {
            const payload = {
                paymentStage: selectedStageToAdd,
                amount: amt,
                paymentDate: addPaymentForm.paymentDate ? new Date(addPaymentForm.paymentDate).toISOString() : new Date().toISOString(),
                receiptLink: addPaymentForm.receiptLink.trim(),
            };

            const res = await fetch(`/api/payment-receivers/${id}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to add payment");

            // Direct state replacement as API returns updated complete receiver object
            setReceiver(resData.data);
            toast.success("Payment added successfully!", { id: toastId });
            setIsAddModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Unable to add payment", { id: toastId });
        } finally {
            setActionLoading(false);
        }
    };

    // Open Edit Payment Modal
    const openEditModal = (payment) => {
        setEditingPayment(payment);
        setEditPaymentForm({
            amount: payment.amount || "",
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().substring(0, 10) : "",
            receiptLink: payment.receiptLink || "",
        });
    };

    // Submit Edit Payment
    const handleEditPaymentSubmit = async (e) => {
        e.preventDefault();
        const amt = Number(editPaymentForm.amount);
        if (!amt || amt <= 0) {
            toast.error("Payment amount must be greater than zero");
            return;
        }

        // Validate calculated total difference
        const existingAmt = Number(editingPayment.amount || 0);
        const diff = amt - existingAmt;
        if (Number(receiver.totalPaid || 0) + diff > Number(receiver.totalPrice || 0)) {
            toast.error("Updated amount exceeds total job price limit");
            return;
        }

        setActionLoading(true);
        const toastId = toast.loading("Updating payment stage...");

        try {
            const payload = {
                amount: amt,
                paymentDate: editPaymentForm.paymentDate ? new Date(editPaymentForm.paymentDate).toISOString() : new Date().toISOString(),
                receiptLink: editPaymentForm.receiptLink.trim(),
            };

            const res = await fetch(`/api/payment-receiver-payments/${editingPayment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update payment");

            toast.success("Payment stage updated successfully!", { id: toastId });
            setEditingPayment(null);
            fetchReceiverDetail(); // Refresh totalPaid and remaining
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Unable to update payment stage", { id: toastId });
        } finally {
            setActionLoading(false);
        }
    };

    // Confirm Delete Payment
    const confirmDeletePayment = async () => {
        if (!paymentToDelete) return;
        setActionLoading(true);
        const toastId = toast.loading("Deleting payment stage record...");

        try {
            const res = await fetch(`/api/payment-receiver-payments/${paymentToDelete.id}`, {
                method: "DELETE",
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete payment");

            toast.success("Payment record deleted successfully", { id: toastId });
            setPaymentToDelete(null);
            fetchReceiverDetail();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Unable to delete payment stage", { id: toastId });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <p className="text-sm font-medium opacity-80">Loading payment receiver details...</p>
            </div>
        );
    }

    if (!receiver) {
        return (
            <div className="text-center py-20 space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h2 className="text-lg font-bold">Payment Receiver Not Found</h2>
                <Link
                    href="/ahiadmin/view/payment-receivers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Receivers List
                </Link>
            </div>
        );
    }

    const isFullyPaid = Number(receiver.remaining || 0) <= 0;
    const existingPayments = receiver.payments || [];

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/ahiadmin/view/payment-receivers"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight">{receiver.customerName}</h1>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFullyPaid
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                        : "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                                    }`}
                            >
                                {isFullyPaid ? "Fully Paid" : "Unpaid Balance"}
                            </span>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 flex items-center gap-3">
                            <span>Phone: {receiver.customerPhone || "—"}</span>
                            <span>•</span>
                            <span>Location: {receiver.customerLocation || "—"}</span>
                        </p>
                    </div>
                </div>

                <Link
                    href={`/ahiadmin/edit/payment-receivers/${receiver.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Receiver Info
                </Link>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-1">
                    <span className="text-xs font-semibold opacity-70 uppercase tracking-wider">Total Job Price</span>
                    <div className="text-2xl font-black font-mono tracking-tight text-[var(--foreground)]">
                        {Number(receiver.totalPrice || 0).toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </div>
                    <p className="text-[11px] opacity-60">Agreed project contract total</p>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs space-y-1">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Amount Paid</span>
                    <div className="text-2xl font-black font-mono tracking-tight text-emerald-500">
                        {Number(receiver.totalPaid || 0).toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </div>
                    <p className="text-[11px] text-emerald-600/80">Sum of all completed stages</p>
                </div>

                <div
                    className={`p-5 rounded-2xl border shadow-xs space-y-1 ${isFullyPaid
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-rose-500/30 bg-rose-500/5"
                        }`}
                >
                    <span
                        className={`text-xs font-semibold uppercase tracking-wider ${isFullyPaid ? "text-emerald-600" : "text-rose-600"
                            }`}
                    >
                        Remaining Balance
                    </span>
                    <div
                        className={`text-2xl font-black font-mono tracking-tight ${isFullyPaid ? "text-emerald-500" : "text-rose-500"
                            }`}
                    >
                        {Number(receiver.remaining || 0).toLocaleString()} <span className="text-xs font-normal">ETB</span>
                    </div>
                    <p className={`text-[11px] ${isFullyPaid ? "text-emerald-600/80" : "text-rose-600/80"}`}>
                        {isFullyPaid ? "All payments cleared!" : "Outstanding unpaid balance"}
                    </p>
                </div>
            </div>

            {/* Customer & Asset Links Bar */}
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                    Project Meta & Asset Links
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--border)]/10 space-y-0.5">
                        <span className="opacity-60 text-[10px] uppercase font-bold">Job Type</span>
                        <div className="font-semibold flex items-center gap-1.5 truncate">
                            <Briefcase className="w-3.5 h-3.5 opacity-70 shrink-0" />
                            {receiver.jobType || "—"}
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--border)]/10 space-y-0.5">
                        <span className="opacity-60 text-[10px] uppercase font-bold">Contract Document</span>
                        <div>
                            {receiver.contractLink ? (
                                <a
                                    href={receiver.contractLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 font-semibold hover:underline flex items-center gap-1 truncate"
                                >
                                    <FileText className="w-3.5 h-3.5 shrink-0" /> Open Link <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <span className="opacity-50">No link provided</span>
                            )}
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--border)]/10 space-y-0.5">
                        <span className="opacity-60 text-[10px] uppercase font-bold">Site Photo</span>
                        <div>
                            {receiver.sitePhotoLink ? (
                                <a
                                    href={receiver.sitePhotoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 font-semibold hover:underline flex items-center gap-1 truncate"
                                >
                                    <ImageIcon className="w-3.5 h-3.5 shrink-0" /> View Photo <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <span className="opacity-50">No link provided</span>
                            )}
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--border)]/10 space-y-0.5">
                        <span className="opacity-60 text-[10px] uppercase font-bold">Site Plan</span>
                        <div>
                            {receiver.sitePlanLink ? (
                                <a
                                    href={receiver.sitePlanLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 font-semibold hover:underline flex items-center gap-1 truncate"
                                >

                                    <Map className="w-3.5 h-3.5 shrink-0" />
                                    View Plan <ExternalLink className="w-3 h-3" />
                                </a>
                            ) : (
                                <span className="opacity-50">No link provided</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Stages Management Table */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold">Six Payment Stages</h2>
                    <span className="text-xs text-[var(--muted-foreground)]">
                        Each stage can be recorded exactly once.
                    </span>
                </div>

                <div className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                    <th className="py-3.5 px-4">Stage Name</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Amount (ETB)</th>
                                    <th className="py-3.5 px-4">Date Paid</th>
                                    <th className="py-3.5 px-4">Receipt</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {PAYMENT_STAGES.map((stage) => {
                                    const matchingPayment = existingPayments.find(
                                        (p) => p.paymentStage === stage.value
                                    );

                                    return (
                                        <tr key={stage.value} className="transition hover:bg-[var(--border)]/10">
                                            <td className="py-4 px-4 font-bold text-xs uppercase tracking-wide">
                                                {stage.label}
                                            </td>

                                            <td className="py-4 px-4">
                                                {matchingPayment ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500">
                                                        <CheckCircle2 className="w-3 h-3" /> Paid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--border)]/40 opacity-70">
                                                        <Clock className="w-3 h-3" /> Not Paid
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 text-right font-mono font-bold">
                                                {matchingPayment
                                                    ? `${Number(matchingPayment.amount).toLocaleString()} ETB`
                                                    : "—"}
                                            </td>

                                            <td className="py-4 px-4 text-xs font-mono opacity-80">
                                                {matchingPayment?.paymentDate
                                                    ? new Date(matchingPayment.paymentDate).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                            <td className="py-4 px-4 text-xs">
                                                {matchingPayment?.receiptLink ? (
                                                    <a
                                                        href={matchingPayment.receiptLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 font-semibold hover:underline inline-flex items-center gap-1"
                                                    >
                                                        Receipt <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="opacity-40">—</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-4 text-right">
                                                {matchingPayment ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(matchingPayment)}
                                                            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition cursor-pointer"
                                                            title="Edit Payment"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setPaymentToDelete(matchingPayment)}
                                                            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                                                            title="Delete Payment"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isFullyPaid}
                                                        onClick={() => openAddModal(stage.value)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition cursor-pointer disabled:opacity-40"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Add Payment
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ADD PAYMENT MODAL */}
            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setIsAddModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold">
                            Add Payment Stage:{" "}
                            <span className="text-[var(--primary)] uppercase">
                                {PAYMENT_STAGES.find((s) => s.value === selectedStageToAdd)?.label}
                            </span>
                        </h3>

                        <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Payment Stage (Read-only)</label>
                                <input
                                    type="text"
                                    disabled
                                    value={
                                        PAYMENT_STAGES.find((s) => s.value === selectedStageToAdd)?.label ||
                                        selectedStageToAdd
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-bold bg-[var(--border)]/20 opacity-80"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">
                                    Amount (ETB) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    placeholder={`Max: ${Number(receiver.remaining || 0).toLocaleString()} ETB`}
                                    value={addPaymentForm.amount}
                                    onChange={(e) =>
                                        setAddPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-mono font-bold bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Payment Date</label>
                                <input
                                    type="date"
                                    value={addPaymentForm.paymentDate}
                                    onChange={(e) =>
                                        setAddPaymentForm((prev) => ({ ...prev, paymentDate: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Receipt Link URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/receipt/123"
                                    value={addPaymentForm.receiptLink}
                                    onChange={(e) =>
                                        setAddPaymentForm((prev) => ({ ...prev, receiptLink: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PAYMENT MODAL */}
            {editingPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setEditingPayment(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold">
                            Edit Stage:{" "}
                            <span className="text-[var(--primary)] uppercase">
                                {PAYMENT_STAGES.find((s) => s.value === editingPayment.paymentStage)?.label}
                            </span>
                        </h3>

                        <form onSubmit={handleEditPaymentSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Payment Stage (Immutable)</label>
                                <input
                                    type="text"
                                    disabled
                                    value={
                                        PAYMENT_STAGES.find((s) => s.value === editingPayment.paymentStage)?.label ||
                                        editingPayment.paymentStage
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-bold bg-[var(--border)]/20 opacity-80"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">
                                    Amount (ETB) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    value={editPaymentForm.amount}
                                    onChange={(e) =>
                                        setEditPaymentForm((prev) => ({ ...prev, amount: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-mono font-bold bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Payment Date</label>
                                <input
                                    type="date"
                                    value={editPaymentForm.paymentDate}
                                    onChange={(e) =>
                                        setEditPaymentForm((prev) => ({ ...prev, paymentDate: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold">Receipt Link URL (Optional)</label>
                                <input
                                    type="url"
                                    value={editPaymentForm.receiptLink}
                                    onChange={(e) =>
                                        setEditPaymentForm((prev) => ({ ...prev, receiptLink: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingPayment(null)}
                                    className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Update Stage
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE PAYMENT MODAL */}
            {paymentToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => setPaymentToDelete(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-rose-500">Delete Payment Stage?</h3>
                        <p className="text-xs opacity-80 leading-relaxed">
                            Are you sure you want to delete the payment record for stage{" "}
                            <span className="font-bold uppercase">
                                {PAYMENT_STAGES.find((s) => s.value === paymentToDelete.paymentStage)?.label}
                            </span>{" "}
                            ({Number(paymentToDelete.amount).toLocaleString()} ETB)?
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setPaymentToDelete(null)}
                                className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeletePayment}
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