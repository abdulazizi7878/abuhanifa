"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function EstimatesManagementPage() {
  const router = useRouter();

  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Copy link feedback state
  const [copiedToken, setCopiedToken] = useState(null);

  // Active Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEstimates = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch("/api/estimates");
        if (!response.ok) {
          throw new Error("Failed to fetch estimates.");
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.message || "Failed to retrieve estimates.");
        }
        setEstimates(result.data);
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, []);

  // Close dropdown menu when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const filteredEstimates = useMemo(() => {
    return estimates.filter((est) => {
      const matchesStatus =
        statusFilter === "all" ||
        est.status?.toLowerCase() === statusFilter.toLowerCase();

      const query = searchQuery.toLowerCase();
      const customerName = (est.customerName || "").toLowerCase();
      const projectTitle = (est.projectTitle || "").toLowerCase();
      const matchesSearch =
        !searchQuery || customerName.includes(query) || projectTitle.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [estimates, statusFilter, searchQuery]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dayjs(dateString).fromNow();
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "final":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
      default:
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
    }
  };

  const handleCopyPublicLink = (publicToken) => {
    if (!publicToken) return;
    const publicUrl = `${window.location.origin}/estimate/${publicToken}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedToken(publicToken);
    setTimeout(() => {
      setCopiedToken(null);
    }, 2500);
  };

  const handleDuplicate = async (id) => {
    setDuplicatingId(id);
    setActiveMenuId(null);
    try {
      const response = await fetch(`/api/estimates/${id}/duplicate`, {
        method: "POST",
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to duplicate estimate.");
      }

      if (result.data) {
        setEstimates((prev) => [result.data, ...prev]);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to duplicate estimate.");
    } finally {
      setDuplicatingId(null);
    }
  };

  const openDeleteModal = (est) => {
    setEstimateToDelete(est);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!estimateToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/estimates/${estimateToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete estimate.");
      }

      setEstimates((prev) => prev.filter((item) => item.id !== estimateToDelete.id));
      setDeleteModalOpen(false);
      setEstimateToDelete(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete estimate.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Top Header & Branding */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <h1 className="text-xl font-bold tracking-tight en text-[var(--secondary)]">
                Abuhanifa Installation
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold en mt-1">Estimates</p>
            </div>
            <button
              onClick={() => router.push("/ahiadmin/create/estimate")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-md flex items-center gap-2 hover:opacity-90 bg-[var(--primary)] text-white"
            >
              + Create Estimate
            </button>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search by customer name or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["all", "draft", "final", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition en cursor-pointer border ${statusFilter === status
                      ? "shadow-sm bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] opacity-70 hover:opacity-100"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-28">
              <p className="text-base font-medium opacity-80 en">Loading estimates...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-20 p-8 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 en">
                Unable to Load Estimates
              </h2>
              <p className="text-sm opacity-80 mb-6 en">{errorMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md bg-[var(--primary)] text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredEstimates.length === 0 && (
            <div
              className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-lg mx-auto space-y-4 bg-[var(--background)]"
            >
              <h3 className="text-lg font-bold en">No estimates yet.</h3>
              <p className="text-sm opacity-75 en">
                {estimates.length === 0
                  ? "Get started by creating your first professional estimate."
                  : "No estimates match your current search or filter criteria."}
              </p>
              {estimates.length === 0 && (
                <button
                  onClick={() => router.push("/ahiadmin/create/estimate")}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md inline-block bg-[var(--primary)] text-white"
                >
                  Create Estimate
                </button>
              )}
            </div>
          )}

          {/* Estimates Table */}
          {!loading && !error && filteredEstimates.length > 0 && (
            <div
              className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]"
            >
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse text-sm en">
                  <thead>
                    <tr
                      className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80"
                    >
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Grand Total</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredEstimates.map((est, index) => (
                      <tr key={est.id} className="transition hover:bg-[var(--border)]/10">
                        <td className="py-4 px-4 opacity-70 font-medium">{index + 1}</td>
                        <td className="py-4 px-4 font-semibold">{est.customerName || "N/A"}</td>
                        <td className="py-4 px-4 opacity-90">{est.projectTitle || "No project title"}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize inline-block ${getStatusBadgeStyle(
                              est.status
                            )}`}
                          >
                            {est.status || "draft"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-[var(--secondary)]">
                          {formatCurrency(est.grandTotal)} ETB
                        </td>
                        <td className="py-4 px-4 text-xs opacity-75" title={est.createdAt}>
                          {formatDate(est.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className="relative inline-block text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === est.id ? null : est.id)}
                              className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                              title="Actions"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>

                            {activeMenuId === est.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5"
                              >
                                <div>
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      router.push(`/ahiadmin/edit/estimate/${est.id}`);
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => handleDuplicate(est.id)}
                                    disabled={duplicatingId === est.id}
                                    className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer disabled:opacity-50 hover:bg-[var(--border)]/20 transition-colors"
                                  >
                                    {duplicatingId === est.id ? "Duplicating..." : "Duplicate"}
                                  </button>

                                  {est.publicToken && (
                                    <>
                                      <button
                                        onClick={() => {
                                          handleCopyPublicLink(est.publicToken);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                      >
                                        {copiedToken === est.publicToken ? "Link Copied!" : "Copy Link"}
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveMenuId(null);
                                          router.push(`/estimate/${est.publicToken}`);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                      >
                                        Public Link
                                      </button>
                                    </>
                                  )}

                                  <div className="border-t border-[var(--border)] my-1"></div>

                                  <button
                                    onClick={() => openDeleteModal(est)}
                                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 cursor-pointer hover:bg-red-500/10 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteModalOpen && estimateToDelete && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModalOpen(false)}
            >
              <div
                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-red-500 en">Delete Estimate?</h3>
                <p className="text-sm opacity-80 en leading-relaxed">
                  Are you sure you want to delete the estimate for <span className="font-semibold">{estimateToDelete.customerName}</span>? Deleting this estimate will also remove all its estimate items and cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] transition en cursor-pointer disabled:opacity-50 bg-transparent text-[var(--foreground)] hover:bg-[var(--border)]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition en cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}