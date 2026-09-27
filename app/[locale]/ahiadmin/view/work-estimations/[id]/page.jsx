'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Save, Copy, Trash2, Plus, Edit2, Search, Loader2, AlertCircle, Check
} from 'lucide-react';

export default function WorkEstimationEditorPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const estimationId = params.id;
    const router = useRouter();

    const [estimation, setEstimation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Project Info Editing
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [savingProject, setSavingProject] = useState(false);
    const [projectSaved, setProjectSaved] = useState(false);

    // Coworker Modals / States
    const [coworkerModalOpen, setCoworkerModalOpen] = useState(false);
    const [editingCoworker, setEditingCoworker] = useState(null);
    const [coworkerName, setCoworkerName] = useState('');
    const [coworkerSubmitting, setCoworkerSubmitting] = useState(false);

    // Library Task Selection Modal
    const [libraryModalOpen, setLibraryModalOpen] = useState(false);
    const [libraryTasks, setLibraryTasks] = useState([]);
    const [librarySearch, setLibrarySearch] = useState('');
    const [selectedLibraryTaskId, setSelectedLibraryTaskId] = useState(null);
    const [libraryQuantity, setLibraryQuantity] = useState(1);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [addingLibraryTask, setAddingLibraryTask] = useState(false);

    // Custom / Task Edit Modal
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // Null = Custom Task creation
    const [taskFormData, setTaskFormData] = useState({ taskName: '', unit: '', singlePrice: '', quantity: 1 });
    const [taskSubmitting, setTaskSubmitting] = useState(false);

    // Deletions
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'coworker' | 'task' | 'project', item }
    const [deleting, setDeleting] = useState(false);
    const [duplicating, setDuplicating] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchEstimation = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/work-estimations/${estimationId}`);
            if (!res.ok) throw new Error('Failed to load estimation project');
            const data = await res.json();
            const project = data.data || data;

            setEstimation(project);
            setProjectName(project.projectName || '');
            setDescription(project.description || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [estimationId]);

    useEffect(() => {
        fetchEstimation();
    }, [fetchEstimation]);

    // ---------------- PROJECT ACTIONS ----------------
    const handleSaveProject = async (e) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        setSavingProject(true);
        try {
            const res = await fetch(`/api/work-estimations/${estimationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName: projectName.trim(),
                    description: description.trim() || undefined,
                }),
            });

            if (!res.ok) throw new Error('Failed to update project info');
            const updated = await res.json();
            setEstimation((prev) => ({ ...prev, ...(updated.data || updated) }));
            setProjectSaved(true);
            setTimeout(() => setProjectSaved(false), 2000);
            showToast('Project updated');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSavingProject(false);
        }
    };

    const handleDuplicateProject = async () => {
        setDuplicating(true);
        try {
            const res = await fetch(`/api/work-estimations/${estimationId}/duplicate`, { method: 'POST' });
            if (!res.ok) throw new Error('Failed to duplicate project');
            const duplicated = await res.json();
            const newId = duplicated.id || duplicated.data?.id;
            showToast('Duplicated project successfully');
            router.push(`/ahiadmin/view/work-estimations/${newId}`);
        } catch (err) {
            showToast(err.message, 'error');
            setDuplicating(false);
        }
    };

    const handleDeleteProject = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/work-estimations/${estimationId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete project');
            showToast('Project deleted');
            router.push('/ahiadmin/view/work-estimations');
        } catch (err) {
            showToast(err.message, 'error');
            setDeleting(false);
        }
    };

    // ---------------- COWORKER ACTIONS ----------------
    const handleSaveCoworker = async (e) => {
        e.preventDefault();
        if (!coworkerName.trim()) return;

        setCoworkerSubmitting(true);
        try {
            const url = editingCoworker
                ? `/api/work-estimation-coworkers/${editingCoworker.id}`
                : `/api/work-estimations/${estimationId}/coworkers`;
            const method = editingCoworker ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: coworkerName.trim() }),
            });

            if (!res.ok) throw new Error('Failed to save coworker');

            showToast(`Coworker ${editingCoworker ? 'updated' : 'added'}`);
            setCoworkerModalOpen(false);
            fetchEstimation();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setCoworkerSubmitting(false);
        }
    };

    const handleDeleteCoworker = async () => {
        if (!deleteTarget || deleteTarget.type !== 'coworker') return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/work-estimation-coworkers/${deleteTarget.item.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to remove coworker');
            showToast('Coworker removed');
            setDeleteTarget(null);
            fetchEstimation();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(false);
        }
    };

    // ---------------- LIBRARY TASK ACTIONS ----------------
    const fetchLibraryTasks = useCallback(async () => {
        setLibraryLoading(true);
        try {
            const res = await fetch(`/api/work-tasks?limit=50&search=${encodeURIComponent(librarySearch)}`);
            if (!res.ok) throw new Error('Failed to fetch library tasks');
            const data = await res.json();
            setLibraryTasks(data.data || data.tasks || data || []);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLibraryLoading(false);
        }
    }, [librarySearch]);

    useEffect(() => {
        if (libraryModalOpen) fetchLibraryTasks();
    }, [libraryModalOpen, fetchLibraryTasks]);

    const handleAddFromLibrary = async () => {
        if (!selectedLibraryTaskId || libraryQuantity <= 0) return;

        setAddingLibraryTask(true);
        try {
            const res = await fetch(`/api/work-estimations/${estimationId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: Number(selectedLibraryTaskId),
                    quantity: Number(libraryQuantity),
                }),
            });

            if (!res.ok) throw new Error('Failed to add task from library');

            showToast('Task added from library');
            setLibraryModalOpen(false);
            fetchEstimation();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setAddingLibraryTask(false);
        }
    };

    // ---------------- ESTIMATION TASK EDIT / CUSTOM ACTIONS ----------------
    const handleOpenTaskModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setTaskFormData({
                taskName: task.taskName || task.name || '',
                unit: task.unit || '',
                singlePrice: task.singlePrice ?? '',
                quantity: task.quantity ?? 1,
            });
        } else {
            setEditingTask(null);
            setTaskFormData({ taskName: '', unit: '', singlePrice: '', quantity: 1 });
        }
        setTaskModalOpen(true);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        if (!taskFormData.taskName.trim()) return;

        setTaskSubmitting(true);
        try {
            const isEditing = Boolean(editingTask);
            const url = isEditing
                ? `/api/work-estimation-tasks/${editingTask.id}`
                : `/api/work-estimations/${estimationId}/tasks`;
            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                taskName: taskFormData.taskName.trim(),
                unit: taskFormData.unit.trim() || undefined,
                singlePrice: Number(taskFormData.singlePrice),
                quantity: Number(taskFormData.quantity),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save task');

            showToast(`Task ${isEditing ? 'updated' : 'added'}`);
            setTaskModalOpen(false);
            fetchEstimation();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setTaskSubmitting(false);
        }
    };

    const handleDeleteTask = async () => {
        if (!deleteTarget || deleteTarget.type !== 'task') return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/work-estimation-tasks/${deleteTarget.item.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete task');
            showToast('Task deleted');
            setDeleteTarget(null);
            fetchEstimation();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-muted-foreground gap-2">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading estimation project...
            </div>
        );
    }

    if (error || !estimation) {
        return (
            <div className="p-6 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <h2 className="text-xl font-bold">Failed to load estimation</h2>
                <p className="text-muted-foreground">{error}</p>
                <Link href="/ahiadmin/view/work-estimations" className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                    <ArrowLeft className="w-4 h-4" /> Return to list
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Top Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/ahiadmin/view/work-estimations"
                        className="p-2 rounded-lg border border-[var(--border)] hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] truncate max-w-md">
                            {estimation.projectName}
                        </h1>
                        <p className="text-xs text-muted-foreground">Work Estimation Project Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDuplicateProject}
                        disabled={duplicating}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    >
                        {duplicating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                        Duplicate
                    </button>
                    <button
                        onClick={() => setDeleteTarget({ type: 'project' })}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>

            {/* 1. PROJECT INFO SECTION */}
            <section className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-5 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                    Project Information
                </h2>
                <form onSubmit={handleSaveProject} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Project Name *</label>
                        <input
                            type="text"
                            required
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                        />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={savingProject}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            {savingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : projectSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {projectSaved ? 'Saved' : 'Save Info'}
                        </button>
                    </div>
                </form>
            </section>

            {/* 2. COWORKERS SECTION */}
            <section className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                    <h2 className="text-base font-semibold text-[var(--foreground)]">Coworkers</h2>
                    <button
                        onClick={() => { setEditingCoworker(null); setCoworkerName(''); setCoworkerModalOpen(true); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-muted transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Coworker
                    </button>
                </div>

                {!estimation.coworkers || estimation.coworkers.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2">No coworkers assigned to this estimation.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {estimation.coworkers.map((cw) => (
                            <div key={cw.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-muted/20">
                                <span className="text-sm font-medium text-[var(--foreground)] truncate">{cw.coworkerName}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditingCoworker(cw); setCoworkerName(cw.coworkerName); setCoworkerModalOpen(true); }}
                                        className="p-1 hover:bg-muted text-muted-foreground rounded"
                                        title="Edit Coworker"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget({ type: 'coworker', item: cw })}
                                        className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-600 rounded"
                                        title="Remove Coworker"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 3. WORK TASKS SECTION */}
            <section className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                    <h2 className="text-base font-semibold text-[var(--foreground)]">Work Tasks</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setSelectedLibraryTaskId(null); setLibraryQuantity(1); setLibraryModalOpen(true); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] rounded-lg hover:bg-muted transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add From Library
                        </button>
                        <button
                            onClick={() => handleOpenTaskModal()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Custom Task
                        </button>
                    </div>
                </div>

                {!estimation.tasks || estimation.tasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-8 text-center">No tasks added to this estimation yet.</p>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/40 border-b border-[var(--border)] text-muted-foreground font-medium text-xs">
                                    <tr>
                                        <th className="px-3 py-2.5">Task Name</th>
                                        <th className="px-3 py-2.5">Unit</th>
                                        <th className="px-3 py-2.5 text-right">Single Price</th>
                                        <th className="px-3 py-2.5 text-right">Quantity</th>
                                        <th className="px-3 py-2.5 text-right">Total Price</th>
                                        <th className="px-3 py-2.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {estimation.tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-3 py-2.5 font-medium text-[var(--foreground)]">{task.taskName || task.name}</td>
                                            <td className="px-3 py-2.5 text-muted-foreground text-xs">{task.unit || '—'}</td>
                                            <td className="px-3 py-2.5 text-right">
                                                {Number(task.singlePrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-semibold">{task.quantity}</td>
                                            <td className="px-3 py-2.5 text-right font-bold text-[var(--foreground)]">
                                                {Number(task.totalPrice || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                                            </td>
                                            <td className="px-3 py-2.5 text-right space-x-1">
                                                <button
                                                    onClick={() => handleOpenTaskModal(task)}
                                                    className="p-1 hover:bg-muted text-muted-foreground rounded"
                                                    title="Edit Task"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget({ type: 'task', item: task })}
                                                    className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-600 rounded"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Responsive Cards */}
                        <div className="md:hidden space-y-3">
                            {estimation.tasks.map((task) => (
                                <div key={task.id} className="border border-[var(--border)] rounded-lg p-3 space-y-2 bg-muted/10">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-sm text-[var(--foreground)]">{task.taskName || task.name}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleOpenTaskModal(task)} className="p-1 text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => setDeleteTarget({ type: 'task', item: task })} className="p-1 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 text-xs gap-1 text-muted-foreground">
                                        <div>Unit: <span className="text-[var(--foreground)]">{task.unit || '—'}</span></div>
                                        <div>Qty: <span className="text-[var(--foreground)] font-semibold">{task.quantity}</span></div>
                                        <div>Single: <span className="text-[var(--foreground)]">{Number(task.singlePrice || 0).toLocaleString()} ETB</span></div>
                                        <div className="font-bold text-[var(--foreground)]">
                                            Total: {Number(task.totalPrice || 0).toLocaleString()} ETB
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* GRAND TOTAL */}
                <div className="flex items-center justify-between border-t-2 border-[var(--border)] pt-4 mt-4">
                    <span className="text-base font-bold text-[var(--foreground)]">Grand Total</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[var(--primary)]">
                        {Number(estimation.grandTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ETB
                    </span>
                </div>
            </section>

            {/* COWORKER MODAL */}
            {coworkerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-sm p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">
                            {editingCoworker ? 'Edit Coworker' : 'Add Coworker'}
                        </h3>
                        <form onSubmit={handleSaveCoworker} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Coworker Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={coworkerName}
                                    onChange={(e) => setCoworkerName(e.target.value)}
                                    placeholder="e.g. Ahmed"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCoworkerModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={coworkerSubmitting}
                                    className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {coworkerSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD FROM LIBRARY MODAL */}
            {libraryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-lg p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">Add Task From Library</h3>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search library tasks..."
                                value={librarySearch}
                                onChange={(e) => setLibrarySearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto border border-[var(--border)] rounded-lg divide-y divide-[var(--border)]">
                            {libraryLoading ? (
                                <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading library...
                                </div>
                            ) : libraryTasks.length === 0 ? (
                                <div className="p-4 text-center text-xs text-muted-foreground">No matching tasks found</div>
                            ) : (
                                libraryTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => setSelectedLibraryTaskId(task.id)}
                                        className={`p-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${selectedLibraryTaskId === task.id ? 'bg-[var(--primary)]/10 border-l-4 border-[var(--primary)] font-semibold' : 'hover:bg-muted/40'
                                            }`}
                                    >
                                        <div>
                                            <div className="text-[var(--foreground)]">{task.name}</div>
                                            <div className="text-xs text-muted-foreground">{task.unit ? `Unit: ${task.unit}` : 'No unit'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{Number(task.defaultPrice).toLocaleString()} ETB</div>
                                            <div className="text-[10px] text-muted-foreground">Default Price</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">Quantity *</label>
                            <input
                                type="number"
                                min="0.01"
                                step="any"
                                required
                                value={libraryQuantity}
                                onChange={(e) => setLibraryQuantity(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setLibraryModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!selectedLibraryTaskId || addingLibraryTask}
                                onClick={handleAddFromLibrary}
                                className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {addingLibraryTask && <Loader2 className="w-4 h-4 animate-spin" />} Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT / CUSTOM TASK MODAL */}
            {taskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">
                            {editingTask ? 'Edit Task' : 'Add Custom Task'}
                        </h3>

                        <form onSubmit={handleSaveTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Task Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={taskFormData.taskName}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, taskName: e.target.value })}
                                    placeholder="e.g. Cleaning"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Unit (Optional)</label>
                                <input
                                    type="text"
                                    value={taskFormData.unit}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, unit: e.target.value })}
                                    placeholder="e.g. Time, Meter"
                                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Single Price (ETB) *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        required
                                        value={taskFormData.singlePrice}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, singlePrice: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Quantity *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0.01"
                                        required
                                        value={taskFormData.quantity}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, quantity: e.target.value })}
                                        placeholder="1"
                                        className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] text-[var(--foreground)] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setTaskModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={taskSubmitting}
                                    className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {taskSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION DIALOG */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl w-full max-w-sm p-6 shadow-xl space-y-4">
                        <h3 className="text-base font-bold text-[var(--foreground)]">Confirm Delete</h3>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete this {deleteTarget.type}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={
                                    deleteTarget.type === 'coworker' ? handleDeleteCoworker :
                                        deleteTarget.type === 'task' ? handleDeleteTask :
                                            handleDeleteProject
                                }
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