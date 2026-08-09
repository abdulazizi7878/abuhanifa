"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function EstimateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEstimate = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/estimates/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Estimate not found.");
          }
          throw new Error("Failed to fetch estimate details.");
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error(result.message || "Estimate not found.");
        }
        setEstimate(result.data);
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting estimate...");

    try {
      const response = await fetch(`/api/estimates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete estimate.");
      }

      toast.success("Estimate deleted successfully", { id: toastId });
      router.push("/estimates");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete estimate.", { id: toastId });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
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

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20 bg-background text-foreground">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Top Actions & Navigation Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => router.push("/estimates")}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition en cursor-pointer flex items-center gap-2 hover:opacity-80"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              ← Back to Estimates
            </button>

            {!loading && !error && estimate && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/estimates/${id}/edit`)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition en cursor-pointer shadow-xs"
                  style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                  Edit Estimate
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition en cursor-pointer shadow-xs"
                >
                  Delete Estimate
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-24">
              <p className="text-base font-medium opacity-80 en">Loading estimate details...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-20 p-8 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 en">
                {errorMessage === "Estimate not found." ? "Estimate not found." : "Unable to load estimate"}
              </h2>
              <p className="text-sm opacity-80 mb-6 en">{errorMessage}</p>
              <button
                onClick={() => router.push("/estimates")}
                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                Go Back to Estimates
              </button>
            </div>
          )}

          {/* Main Estimate Content */}
          {!loading && !error && estimate && (
            <div
              className="p-6 sm:p-8 rounded-2xl shadow-lg border bg-background space-y-8"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Header Info: Title & Status */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b gap-4" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold en">
                      Estimate #{estimate.id}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize en ${getStatusBadgeStyle(
                        estimate.status
                      )}`}
                    >
                      {estimate.status || "draft"}
                    </span>
                  </div>
                  <p className="text-xs opacity-70 en">
                    Created on: {estimate.createdAt ? new Date(estimate.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-xs opacity-70 en">Grand Total</div>
                  <div className="text-2xl sm:text-3xl font-bold en" style={{ color: "var(--secondary)" }}>
                    {formatCurrency(estimate.grandTotal)} ETB
                  </div>
                </div>
              </div>

              {/* Customer & Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Section */}
                <div
                  className="p-5 rounded-xl border bg-background space-y-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h2 className="text-base font-semibold opacity-90 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                    Customer Information
                  </h2>
                  <div className="space-y-2 text-sm en">
                    <div>
                      <span className="opacity-70 text-xs block">Customer Name</span>
                      <span className="font-medium text-base">{estimate.customerName}</span>
                    </div>
                    {estimate.customerPhone && (
                      <div>
                        <span className="opacity-70 text-xs block">Customer Phone</span>
                        <span className="font-medium">{estimate.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Section */}
                <div
                  className="p-5 rounded-xl border bg-background space-y-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h2 className="text-base font-semibold opacity-90 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                    Project Information
                  </h2>
                  <div className="space-y-2 text-sm en">
                    <div>
                      <span className="opacity-70 text-xs block">Project Title</span>
                      <span className="font-medium text-base">
                        {estimate.projectTitle || "No project title specified."}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-70 text-xs block">Project Description</span>
                      <span className="opacity-90">
                        {estimate.projectDescription || "No project description provided."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Material Table Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold en">Estimate Materials</h2>

                {!estimate.items || estimate.items.length === 0 ? (
                  <div
                    className="text-center py-12 border border-dashed rounded-xl"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p className="text-sm opacity-80 en">No materials have been added to this estimate.</p>
                  </div>
                ) : (
                  <div
                    className="rounded-xl border overflow-hidden shadow-xs"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm en">
                        <thead>
                          <tr
                            className="border-b text-xs opacity-80"
                            style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
                          >
                            <th className="py-3 px-4 font-semibold">#</th>
                            <th className="py-3 px-4 font-semibold">Material</th>
                            <th className="py-3 px-4 font-semibold">Type</th>
                            <th className="py-3 px-4 font-semibold">Brand</th>
                            <th className="py-3 px-4 font-semibold">Diameter</th>
                            <th className="py-3 px-4 font-semibold">Specification</th>
                            <th className="py-3 px-4 font-semibold">Qty</th>
                            <th className="py-3 px-4 font-semibold">Price (ETB)</th>
                            <th className="py-3 px-4 font-semibold text-right">Total (ETB)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {estimate.items.map((item, index) => (
                            <tr key={item.id || index} className="transition hover:opacity-90">
                              <td className="py-3 px-4 opacity-70">{index + 1}</td>
                              <td className="py-3 px-4">
                                <div className="font-medium en">{item.materialNameEnglish}</div>
                                {item.materialNameAmharic && (
                                  <div className="text-xs am opacity-85">{item.materialNameAmharic}</div>
                                )}
                              </td>
                              <td className="py-3 px-4 opacity-90">{item.type || "-"}</td>
                              <td className="py-3 px-4 opacity-90">{item.brand || "-"}</td>
                              <td className="py-3 px-4 opacity-90">{item.diameter || "-"}</td>
                              <td className="py-3 px-4 opacity-75 text-xs">{item.specification || "-"}</td>
                              <td className="py-3 px-4 font-semibold">{item.quantity}</td>
                              <td className="py-3 px-4 opacity-90">{formatCurrency(item.price)}</td>
                              <td className="py-3 px-4 text-right font-semibold" style={{ color: "var(--secondary)" }}>
                                {formatCurrency(item.total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Grand Total Footer Summary */}
              <div
                className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-xs opacity-70 en">
                  Total Items: <span className="font-semibold">{estimate.items?.length || 0}</span>
                </div>
                <div className="text-xl font-bold en flex items-center gap-3">
                  <span className="opacity-90 text-lg">Grand Total:</span>
                  <span style={{ color: "var(--secondary)" }}>
                    {formatCurrency(estimate.grandTotal)} ETB
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
            >
              <div
                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border space-y-4 bg-background text-foreground"
                style={{ borderColor: "var(--border)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-red-500 en">Delete Estimate?</h3>
                <p className="text-sm opacity-80 en">
                  Are you sure you want to delete this estimate? This action will also remove all its associated estimate items and cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
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
      </main>
      <Footer />
    </>
  );
}