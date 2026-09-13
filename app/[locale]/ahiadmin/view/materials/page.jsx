"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function MaterialsListPage() {
  const router = useRouter();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Category filter state ('all' or specific category)
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Active Dropdown Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Delete modal states
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch materials on load
  const fetchMaterials = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/materials");
      if (!response.ok) {
        throw new Error("Failed to fetch materials.");
      }
      const result = await response.json();
      setMaterials(result.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Unable to load materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Close dropdown menu when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleEdit = (id) => {
    setActiveMenuId(null);
    router.push(`/ahiadmin/edit/material/${id}`);
  };

  const openDeleteModal = (material) => {
    setActiveMenuId(null);
    setMaterialToDelete(material);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setMaterialToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting material...");

    try {
      const response = await fetch(`/api/materials/${materialToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material.");
      }

      setMaterials((prev) => prev.filter((item) => item.id !== materialToDelete.id));
      toast.success("Material deleted successfully", { id: toastId });
      setMaterialToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete material. Please try again.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dayjs(dateString).fromNow();
    } catch {
      return dateString;
    }
  };

  // Filtered materials based on selected category and search query
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase();
      const englishName = (item.materialNameEnglish || "").toLowerCase();
      const amharicName = (item.materialNameAmharic || "").toLowerCase();
      const diameter = (item.diameter || "").toLowerCase();
      const category = (item.category || "").toLowerCase();

      const matchesSearch =
        !searchQuery ||
        englishName.includes(query) ||
        amharicName.includes(query) ||
        diameter.includes(query) ||
        category.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [materials, selectedCategory, searchQuery]);

  return (
    <>
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title Header & Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <h1 className="text-xl font-bold tracking-tight en text-[var(--secondary)]">
                Abuhanifa Installation
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold en mt-1">Materials</p>
            </div>
            <button
              onClick={() => router.push("/ahiadmin/create/material")}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-md flex items-center gap-2 hover:opacity-90 bg-[var(--primary)] text-white"
            >
              + Add Material
            </button>
          </div>

          {/* Search Bar & Category Filter Container */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search by name, diameter, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
            />

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All", value: "all" },
                { label: "Plumbing", value: "plumbing" },
                { label: "Sanitary", value: "sanitary" },
                { label: "Electrical", value: "electrical" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition en cursor-pointer border ${selectedCategory === cat.value
                      ? "shadow-sm bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] opacity-70 hover:opacity-100"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-28">
              <p className="text-base font-medium opacity-80 en">Loading materials...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-20 p-8 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 en">
                Unable to Load Materials
              </h2>
              <p className="text-sm opacity-80 mb-6 en">Unable to load materials.</p>
              <button
                onClick={fetchMaterials}
                className="px-5 py-2 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md bg-[var(--primary)] text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredMaterials.length === 0 && (
            <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-lg mx-auto space-y-4 bg-[var(--background)]">
              <h3 className="text-lg font-bold en">No materials found.</h3>
              <p className="text-sm opacity-75 en">
                {materials.length === 0
                  ? "Add your first material to get started."
                  : "No materials match your search or filter criteria."}
              </p>
              {materials.length === 0 && (
                <button
                  onClick={() => router.push("/ahiadmin/create/material")}
                  className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md inline-block bg-[var(--primary)] text-white"
                >
                  Add Material
                </button>
              )}
            </div>
          )}

          {/* Materials Table */}
          {!loading && !error && filteredMaterials.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse text-sm en">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                      <th className="py-3.5 px-4">Material Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Diameter</th>
                      <th className="py-3.5 px-4">Unit</th>
                      <th className="py-3.5 px-4">Updated</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredMaterials.map((item) => (
                      <tr key={item.id} className="transition hover:bg-[var(--border)]/10">
                        {/* Material Name (English & Amharic stacked) */}
                        <td className="py-4 px-4">
                          <div className="font-semibold" style={{ color: "var(--foreground)" }}>
                            {item.materialNameEnglish}
                          </div>
                          <div className="text-xs am opacity-80" style={{ color: "var(--foreground)" }}>
                            {item.materialNameAmharic}
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-4 px-4 capitalize">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border)] inline-block">
                            {item.category}
                          </span>
                        </td>

                        {/* Price formatted */}
                        <td className="py-4 px-4 font-bold text-[var(--secondary)]">
                          {Number(item.price).toFixed(2)} ETB
                        </td>

                        {/* Diameter */}
                        <td className="py-4 px-4 opacity-90">
                          {item.diameter || "N/A"}
                        </td>

                        {/* Unit */}
                        <td className="py-4 px-4 opacity-90">
                          {item.unit || "Not Defined"}
                        </td>

                        {/* Updated Relative Time */}
                        <td className="py-4 px-4 text-xs opacity-75" title={item.updatedAt || item.createdAt}>
                          {formatDate(item.updatedAt || item.createdAt)}
                        </td>

                        {/* Actions Dropdown */}
                        <td className="py-4 px-4 text-right">
                          <div
                            className="relative inline-block text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                              className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                              title="Actions"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>

                            {activeMenuId === item.id && (
                              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                <div>
                                  <button
                                    onClick={() => handleEdit(item.id)}
                                    className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                  >
                                    Edit
                                  </button>

                                  <div className="border-t border-[var(--border)] my-1"></div>

                                  <button
                                    onClick={() => openDeleteModal(item)}
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
          {materialToDelete && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={closeDeleteModal}
            >
              <div
                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-red-500 en">Delete Material?</h3>
                <p className="text-sm opacity-80 en leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold">{materialToDelete.materialNameEnglish}</span>? This action cannot be undone.
                </p>

                {/* Selected Material Preview Card */}
                <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--border)]/5 space-y-1">
                  <div className="font-semibold en text-sm">{materialToDelete.materialNameEnglish}</div>
                  <div className="text-xs am opacity-80 mb-2">{materialToDelete.materialNameAmharic}</div>
                  <div className="flex justify-between text-xs opacity-70 en">
                    <span>Diameter: {materialToDelete.diameter || "N/A"}</span>
                    <span>Price: {Number(materialToDelete.price).toFixed(2)} ETB</span>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] transition en cursor-pointer disabled:opacity-50 bg-transparent text-[var(--foreground)] hover:bg-[var(--border)]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
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