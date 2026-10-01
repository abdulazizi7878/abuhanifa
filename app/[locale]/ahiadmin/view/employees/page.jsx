"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Phone, Calendar, DollarSign, Loader2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

export default function EmployeeManagementPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Form & Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Confirmation States
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");

    // Form Input States
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        weeklyPayment: "",
        defaultRestDay: "Friday"
    });

    const fetchEmployees = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/employees");
            if (!res.ok) throw new Error("Failed to fetch employees");
            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : data?.data || data?.employees || []);
        } catch (err) {
            console.error(err);
            setError(true);
            toast.error("Unable to load employees list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const openCreateModal = () => {
        setEditingEmployee(null);
        setFormData({
            name: "",
            phone: "",
            weeklyPayment: "",
            defaultRestDay: "Friday"
        });
        setIsModalOpen(true);
    };

    const openEditModal = (emp) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.name || "",
            phone: emp.phone || "",
            weeklyPayment: emp.weeklyPayment || emp.weekly_payment || "",
            defaultRestDay: emp.defaultRestDay || emp.default_rest_day || "Friday"
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setEditingEmployee(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Employee name is required.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading(editingEmployee ? "Updating employee..." : "Adding employee...");

        try {
            const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : "/api/employees";
            const method = editingEmployee ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    weeklyPayment: parseFloat(formData.weeklyPayment) || 0,
                    defaultRestDay: formData.defaultRestDay
                })
            });

            if (!res.ok) throw new Error("Failed to save employee.");

            toast.success(editingEmployee ? "Employee updated successfully!" : "Employee added successfully!", { id: toastId });
            setIsModalOpen(false);
            fetchEmployees();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save employee details.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        setIsDeleting(true);
        const toastId = toast.loading("Deleting employee...");

        try {
            const res = await fetch(`/api/employees/${employeeToDelete.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete employee.");

            setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
            toast.success("Employee removed successfully", { id: toastId });
            setEmployeeToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error("Unable to delete employee.", { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const q = searchQuery.toLowerCase();
            return (
                emp.name?.toLowerCase().includes(q) ||
                emp.phone?.toLowerCase().includes(q)
            );
        });
    }, [employees, searchQuery]);

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            {/* Title Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)]">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                        Abu Hanifa Installation ET
                    </h1>
                    <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                        Employee Management
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Search employee by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-28 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    <p className="text-sm font-medium opacity-80">Loading employees list...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="text-center py-16 p-8 rounded-2xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                    <h2 className="text-lg font-bold text-red-500 mb-2">Unable to Load Employees</h2>
                    <p className="text-xs opacity-80 mb-6">There was a network issue retrieving employees.</p>
                    <button
                        onClick={fetchEmployees}
                        className="px-5 py-2 rounded-lg font-medium text-xs shadow-md bg-[var(--primary)] text-white hover:opacity-90 transition cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredEmployees.length === 0 && (
                <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto space-y-4">
                    <UserCheck className="w-12 h-12 mx-auto text-[var(--muted-foreground)] opacity-50" />
                    <h3 className="text-base font-bold">No employees found</h3>
                    <p className="text-xs opacity-75">
                        {employees.length === 0
                            ? "Start by adding your first employee to track attendance."
                            : "No employees match your search criteria."}
                    </p>
                    {employees.length === 0 && (
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add Employee
                        </button>
                    )}
                </div>
            )}

            {/* Employees Table (Desktop) & Cards (Mobile) */}
            {!loading && !error && filteredEmployees.length > 0 && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)] overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                    <th className="py-3.5 px-4">Employee</th>
                                    <th className="py-3.5 px-4">Phone</th>
                                    <th className="py-3.5 px-4">Weekly Payment</th>
                                    <th className="py-3.5 px-4">Rest Day</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="transition hover:bg-[var(--border)]/10">
                                        <td className="py-4 px-4 font-semibold">{emp.name}</td>
                                        <td className="py-4 px-4 opacity-80">{emp.phone || "—"}</td>
                                        <td className="py-4 px-4 font-mono font-medium">
                                            {(emp.weeklyPayment || emp.weekly_payment || 0).toLocaleString()} ETB
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--muted)] border border-[var(--border)]">
                                                <Calendar className="w-3 h-3 text-[var(--primary)]" />
                                                {emp.defaultRestDay || emp.default_rest_day || "Friday"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(emp)}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition cursor-pointer"
                                                    title="Edit Employee"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEmployeeToDelete(emp)}
                                                    className="p-2 rounded-lg border border-[var(--border)] hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                                                    title="Delete Employee"
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
                        {filteredEmployees.map((emp) => (
                            <div
                                key={emp.id}
                                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-base">{emp.name}</h4>
                                        <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                                            <Phone className="w-3 h-3" /> {emp.phone || "No phone provided"}
                                        </p>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)]">
                                        {emp.defaultRestDay || emp.default_rest_day || "Friday"}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-[var(--border)] text-xs">
                                    <div>
                                        <span className="text-[var(--muted-foreground)]">Weekly: </span>
                                        <span className="font-bold text-sm font-mono">
                                            {(emp.weeklyPayment || emp.weekly_payment || 0).toLocaleString()} ETB
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(emp)}
                                            className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--muted)] transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setEmployeeToDelete(emp)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Add/Edit Employee Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-5 bg-[var(--background)] text-[var(--foreground)] animate-in fade-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                            <h3 className="text-lg font-bold">
                                {editingEmployee ? "Edit Employee" : "Add New Employee"}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ahmed Ali"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 0911223344"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                                    Weekly Payment (ETB)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="e.g. 2500"
                                    value={formData.weeklyPayment}
                                    onChange={(e) => setFormData({ ...formData, weeklyPayment: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                                    Default Rest Day *
                                </label>
                                <select
                                    value={formData.defaultRestDay}
                                    onChange={(e) => setFormData({ ...formData, defaultRestDay: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none cursor-pointer"
                                >
                                    {DAYS_OF_WEEK.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border)]">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{editingEmployee ? "Update Employee" : "Save Employee"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {employeeToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
                    onClick={() => !isDeleting && setEmployeeToDelete(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-rose-500">Delete Employee?</h3>
                        <p className="text-xs opacity-80 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold">{employeeToDelete.name}</span>? Attendance records tied to this employee will no longer be visible.
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEmployeeToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] hover:bg-[var(--muted)] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}