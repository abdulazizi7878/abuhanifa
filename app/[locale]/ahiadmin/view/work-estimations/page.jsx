'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import {
    Search, Plus, Copy, Trash2, ExternalLink, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';

export default function WorkEstimationsPage() {
    const router = useRouter();
    const [estimations, setEstimations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Create Modal
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Delete/Duplicate State
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [duplicatingId, setDuplicatingId] = useState(null);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchEstimations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/work-estimations?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error('Failed to fetch estimations');
            const data = await res.json();

            setEstimations(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (err) {
            setError(err.message || 'Error loading work estimations');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchEstimations();
    }, [fetchEstimations]);

    const handleCreateEstimation = async (e) => {
        e.preventDefault();
        if (!projectName.trim()) {
            setCreateError('Project name is required');
            return;
        }

        setCreating(true);
        setCreateError('');

        try {
            const res = await fetch('/api/work-estimations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: projectName.trim(),
                    description: description.trim() || undefined,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to create estimation');
            }

            const result = await res.json();
            const id = result.data?.id;
            showToast('Estimation created successfully');
            router.push(`/ahiadmin/view/work-estimations/${id}`);
        } catch (err) {
            setCreateError(err.message);
            setCreating(false);
        }
    };

    const handleDuplicate = async (id) => {
        setDuplicatingId(id);
        try {
            const res = await fetch(`/api/work-estimations/${id}/duplicate`, { method: 'POST' });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to duplicate project');
            }

            const result = await res.json();
            const newId = result.data?.id;
            showToast('Project duplicated successfully');
            router.push(`/ahiadmin/view/work-estimations/${newId}`);
        } catch (err) {
            showToast(err.message, 'error');
            setDuplicatingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/work-estimations/${deleteTarget.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to delete estimation');
            }

            showToast('Estimation deleted successfully');
            setDeleteTarget(null);
            fetchEstimations();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Work Estimations</h1>
                    <p className="text-sm text-muted-foreground">Manage work and installation project estimates.</p>
                </div>
                <button
                    onClick={() => { setCreateError(''); setProjectName(''); setDescription(''); setIsCreateOpen(true); }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Create Estimation
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
                <button
                    onClick={fetchEstimations}
                    className="p-2 text-muted-foreground hover:text-[var(--foreground)] rounded-lg border border-[var(--border)]"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Table */}
            <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)] shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading estimations...
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12 text-red-500 gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                ) : estimations.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        No work estimations found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-[var(--border)] text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3">Project</th>
                                    <th className="px-4 py-3">Tasks</th>
                                    <th className="px-4 py-3">Coworkers</th>
                                    <th className="px-4 py-3 text-right">Grand Total</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {estimations.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-[var(--foreground)]">{item.projectName}</div>
                                            {item.description && <div className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.tasks?.length ?? item.taskCount ?? 0} tasks</td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.coworkers?.length ?? item.coworkerCount ?? 0} coworkers</td>
                                        <td className="px-4 py-3 text-right font-bold text-[var(--foreground)]">
                                            {Number(item.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                                            <Link
                                                href={`/ahiadmin/view/work-estimations/${item.id}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-[var(--border)] rounded hover:bg-muted transition-colors"
                                            >
                                                Open <ExternalLink className="w-3 h-3" />
                                            </Link>
                                            <button
                                                onClick={() => handleDuplicate(item.id)}
                                                disabled={duplicatingId === item.id}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-[var(--border)] rounded hover:bg-muted transition-colors disabled:opacity-50"
                                                title="Duplicate Project"
                                            >
                                                {duplicatingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
                                                Duplicate
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-500/10 rounded transition-colors"
                                                title="Delete Estimation"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-muted/20 text-xs">
                        <span className="text-muted-foreground">Page {page} of {totalPages}</span>
                        <div className="flex gap-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-1.5 border border-[var(--border)] rounded disabled:opacity-40"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="p-1.5 border border-[var(--border)] rounded disabled:opacity-40"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <h2 className="text-lg font-bold text-[var(--foreground)]">New Work Estimation</h2>

                        {createError && (
                            <div className="p-3 text-xs rounded bg-red-500/10 text-red-600 border border-red-500/20">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={handleCreateEstimation} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Project Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="e.g. Abdulaziz House"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Description (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Electrical installation and layout description..."
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />} Create & Open
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-sm p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">Confirm Delete</h3>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteTarget.projectName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}