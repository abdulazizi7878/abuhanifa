'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';

export default function WorkTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState({ name: '', unit: '', defaultPrice: '' });
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Delete State
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Notification / Toast
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/work-tasks?page=${page}&limit=10&search=${encodeURIComponent(search)}`);
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();

            setTasks(data.data || data.tasks || data || []);
            setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
        } catch (err) {
            setError(err.message || 'Error loading work task library');
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleOpenModal = (task = null) => {
        setFormError('');
        if (task) {
            setSelectedTask(task);
            setFormData({
                name: task.name || '',
                unit: task.unit || '',
                defaultPrice: task.defaultPrice ?? '',
            });
        } else {
            setSelectedTask(null);
            setFormData({ name: '', unit: '', defaultPrice: '' });
        }
        setIsModalOpen(true);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setFormError('Task name is required');
            return;
        }
        if (formData.defaultPrice === '' || Number(formData.defaultPrice) < 0) {
            setFormError('Default price must be a valid non-negative number');
            return;
        }

        setFormSubmitting(true);
        setFormError('');

        const payload = {
            name: formData.name.trim(),
            unit: formData.unit.trim() || undefined,
            defaultPrice: Number(formData.defaultPrice),
        };

        try {
            const url = selectedTask ? `/api/work-tasks/${selectedTask.id}` : '/api/work-tasks';
            const method = selectedTask ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to save task');
            }

            showToast(`Task ${selectedTask ? 'updated' : 'created'} successfully`);
            setIsModalOpen(false);
            fetchTasks();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/work-tasks/${deleteTarget.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to delete task');
            }

            showToast('Task deleted successfully');
            setDeleteTarget(null);
            fetchTasks();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Work Task Library</h1>
                    <p className="text-sm text-muted-foreground">Manage reusable work and installation task templates.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Task
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
                <button
                    onClick={fetchTasks}
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
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading library tasks...
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12 text-red-500 gap-2">
                        <AlertCircle className="w-5 h-5" /> {error}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                        No work tasks found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-[var(--border)] text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3">Task Name</th>
                                    <th className="px-4 py-3">Unit</th>
                                    <th className="px-4 py-3 text-right">Default Price</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">{task.name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{task.unit || '—'}</td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {Number(task.defaultPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(task)}
                                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-[var(--foreground)] transition-colors"
                                                title="Edit Task"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(task)}
                                                className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
                                                title="Delete Task"
                                            >
                                                <Trash2 className="w-4 h-4" />
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

            {/* Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <h2 className="text-lg font-bold text-[var(--foreground)]">
                            {selectedTask ? 'Edit Task Template' : 'Add Task Template'}
                        </h2>

                        {formError && (
                            <div className="p-3 text-xs rounded bg-red-500/10 text-red-600 border border-red-500/20">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSaveTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Task Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Wall chiseling"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Unit (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    placeholder="e.g. Meter, Hour, Item"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Default Price (ETB) *</label>
                                <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    required
                                    value={formData.defaultPrice}
                                    onChange={(e) => setFormData({ ...formData, defaultPrice: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formSubmitting}
                                    className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {formSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {selectedTask ? 'Update Task' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-sm p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">Confirm Delete</h3>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete <strong className="text-[var(--foreground)]">{deleteTarget.name}</strong> from the library?
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTask}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}