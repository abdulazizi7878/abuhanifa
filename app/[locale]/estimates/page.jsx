"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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

  const openDeleteModal = (est) => {
    setEstimateToDelete(est);
    setDeleteModalOpen(true);
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
    <Header />
      <div className="min-h-screen py-8 mt-26 px-4 sm:px-6 lg:px-8 bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Top Header & Branding */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
            <div>
              <h1 className="text-xl font-bold tracking-tight en" style={{ color: "var(--secondary)" }}>
                Abu Hanifa Installation
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold en mt-1">Estimates</p>
            </div>
            <button
              onClick={() => router.push("/estimates/create")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-md flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
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
              className="w-full sm:w-80 px-4 py-2.5 rounded-lg border text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--border)" }}
            />

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["all", "draft", "final", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition en cursor-pointer border ${
                    statusFilter === status
                      ? "shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      statusFilter === status ? "var(--primary)" : "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
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
                className="px-5 py-2 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredEstimates.length === 0 && (
            <div
              className="text-center py-20 p-10 rounded-2xl border border-dashed max-w-lg mx-auto space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="text-lg font-bold en">No estimates yet.</h3>
              <p className="text-sm opacity-75 en">
                {estimates.length === 0
                  ? "Get started by creating your first professional estimate."
                  : "No estimates match your current search or filter criteria."}
              </p>
              {estimates.length === 0 && (
                <button
                  onClick={() => router.push("/estimates/create")}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md inline-block"
                  style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                  Create Estimate
                </button>
              )}
            </div>
          )}

          {/* Estimates Table */}
          {!loading && !error && filteredEstimates.length > 0 && (
            <div
              className="rounded-xl border overflow-hidden shadow-md bg-[var(--background)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm en">
                  <thead>
                    <tr
                      className="border-b text-xs font-semibold uppercase tracking-wider opacity-80"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
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
                  <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {filteredEstimates.map((est, index) => (
                      <tr key={est.id} className="transition hover:opacity-95">
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
                        <td className="py-4 px-4 font-bold" style={{ color: "var(--secondary)" }}>
                          {formatCurrency(est.grandTotal)} ETB
                        </td>
                        <td className="py-4 px-4 text-xs opacity-75">{formatDate(est.createdAt)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button
                              onClick={() => router.push(`/estimates/${est.id}`)}
                              className="px-3 py-1 rounded border text-xs font-medium transition cursor-pointer hover:opacity-80"
                              style={{ borderColor: "var(--border)" }}
                            >
                              View
                            </button>
                            <button
                              onClick={() => router.push(`/estimates/${est.id}/edit`)}
                              className="px-3 py-1 rounded border text-xs font-medium transition cursor-pointer hover:opacity-80"
                              style={{ borderColor: "var(--border)" }}
                            >
                              Edit
                            </button>
                            {est.publicToken && (
                              <>
                                <div className="relative inline-block">
                                  <button
                                    onClick={() => handleCopyPublicLink(est.publicToken)}
                                    className="px-3 py-1 rounded border text-xs font-medium transition cursor-pointer hover:opacity-80"
                                    style={{ borderColor: "var(--border)" }}
                                  >
                                    {copiedToken === est.publicToken ? "Link copied" : "Copy Link"}
                                  </button>
                                </div>
                                <button
                                  onClick={() => router.push(`/estimate/${est.publicToken}`)}
                                  className="px-3 py-1 rounded border text-xs font-medium transition cursor-pointer hover:opacity-80"
                                  style={{ borderColor: "var(--border)" }}
                                >
                                  Public Link
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openDeleteModal(est)}
                              className="px-3 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition cursor-pointer shadow-xs"
                            >
                              Delete
                            </button>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
              onClick={() => !isDeleting && setDeleteModalOpen(false)}
            >
              <div
                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                style={{ borderColor: "var(--border)" }}
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
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition en cursor-pointer disabled:opacity-50"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
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
      <Footer />
    </>

  );
}