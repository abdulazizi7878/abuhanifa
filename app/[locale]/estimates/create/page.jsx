"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function CreateEstimatePage() {
  const router = useRouter();

  // Form & UI States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [materials, setMaterials] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  // Fetch materials on load from existing materials API
  const fetchMaterials = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/materials");
      if (!response.ok) {
        throw new Error("Failed to fetch materials catalog.");
      }
      const result = await response.json();
      setMaterials(result.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Unable to load materials catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filter materials based on search term and category
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.materialNameEnglish?.toLowerCase().includes(searchLower) ||
        item.materialNameAmharic?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.diameter?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [materials, selectedCategory, searchTerm]);

  // Add material to estimate or increase quantity if already present
  const handleAddMaterial = (material) => {
    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === material.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prev, { ...material, quantity: 1 }];
      }
    });
    toast.success(`Added ${material.materialNameEnglish} to estimate`);
  };

  // Update item quantity
  const handleQuantityChange = (id, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Direct quantity input setter
  const handleQuantityInput = (id, val) => {
    const qty = parseInt(val, 10);
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: isNaN(qty) || qty < 1 ? 1 : qty };
        }
        return item;
      })
    );
  };

  // Remove item completely
  const handleRemoveItem = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from estimate");
  };

  // Live Grand Total Calculation
  const grandTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    );
  }, [selectedItems]);

  // Form submission handler
  const handleSubmitEstimate = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Please add at least one material to the estimate.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating Estimate...");

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        projectTitle: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        items: selectedItems.map((item) => ({
          materialId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/estimates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create estimate.");
      }

      const result = await response.json();
      const newEstimateId = result?.data?.id;

      toast.success("Estimate created successfully", { id: toastId });

      if (newEstimateId) {
        router.push(`/estimates/${newEstimateId}`);
      } else {
        router.push("/estimates");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create estimate. Please try again.", {
        id: toastId,
      });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-background mt-20 text-foreground">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold en">Create New Estimate</h1>
              <p className="mt-1 text-sm opacity-80 en">
                Configure homeowner project details and select required installation materials.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitEstimate} className="space-y-8">
            
            {/* Customer & Project Information Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                Customer & Project Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="e.g. Ahmed"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0912345678"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. House Installation"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Project Description
                  </label>
                  <input
                    type="text"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="e.g. Full installation"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </section>

            {/* Material Selection & Catalog Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold en">Material Catalog Selection</h2>
                
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-sm en bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-sm en bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="all">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="sanitary">Sanitary</option>
                    <option value="electrical">Electrical</option>
                  </select>
                </div>
              </div>

              {/* Loading & Error States for Catalog */}
              {loading && (
                <div className="text-center py-10">
                  <p className="text-sm opacity-80 en">Loading materials catalog...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-10 text-red-500 text-sm en">
                  Unable to load materials. Please check your connection and try again.
                </div>
              )}

              {!loading && !error && filteredMaterials.length === 0 && (
                <div className="text-center py-10 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm opacity-75 en">No materials match your search criteria.</p>
                </div>
              )}

              {/* Material Quick List Grid */}
              {!loading && !error && filteredMaterials.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 rounded-lg border flex flex-col justify-between transition hover:shadow-md bg-background"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-sm en">{mat.materialNameEnglish}</span>
                          <span className="text-xs px-2 py-0.5 rounded border capitalize opacity-80" style={{ borderColor: "var(--border)" }}>
                            {mat.category}
                          </span>
                        </div>
                        <div className="text-xs am opacity-80 mb-2">{mat.materialNameAmharic}</div>
                        <div className="text-xs opacity-70 grid grid-cols-2 gap-1 mb-3 en">
                          <span>Type: {mat.type}</span>
                          <span>Brand: {mat.brand}</span>
                          <span>Diam: {mat.diameter}</span>
                          <span className="font-semibold" style={{ color: "var(--secondary)" }}>
                            Price: {mat.price} ETB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMaterial(mat)}
                        className="w-full py-1.5 px-3 rounded-md text-xs font-medium transition en cursor-pointer shadow-xs text-center"
                        style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                      >
                        + Add to Estimate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Selected Estimate Items Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b en" style={{ borderColor: "var(--border)" }}>
                Selected Estimate Items
              </h2>

              {selectedItems.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
                  <p className="text-base font-medium mb-1 en">No materials added yet.</p>
                  <p className="text-xs opacity-70 en">Select materials from the catalog above to build your estimate.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-xs opacity-80 en" style={{ borderColor: "var(--border)" }}>
                        <th className="py-3 px-4 font-semibold">Material</th>
                        <th className="py-3 px-4 font-semibold">Type</th>
                        <th className="py-3 px-4 font-semibold">Brand</th>
                        <th className="py-3 px-4 font-semibold">Diameter</th>
                        <th className="py-3 px-4 font-semibold">Price (ETB)</th>
                        <th className="py-3 px-4 font-semibold">Quantity</th>
                        <th className="py-3 px-4 font-semibold">Total (ETB)</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm en" style={{ borderColor: "var(--border)" }}>
                      {selectedItems.map((item) => {
                        const itemTotal = Number(item.price || 0) * item.quantity;
                        return (
                          <tr key={item.id} className="transition">
                            <td className="py-3 px-4">
                              <div className="font-medium">{item.materialNameEnglish}</div>
                              <div className="text-xs am opacity-80">{item.materialNameAmharic}</div>
                            </td>
                            <td className="py-3 px-4 opacity-90">{item.type}</td>
                            <td className="py-3 px-4 opacity-90">{item.brand}</td>
                            <td className="py-3 px-4 opacity-90">{item.diameter}</td>
                            <td className="py-3 px-4 opacity-90">{Number(item.price).toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs cursor-pointer"
                                  style={{ borderColor: "var(--border)" }}
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                                  className="w-12 text-center rounded border text-xs py-1 bg-background text-foreground"
                                  style={{ borderColor: "var(--border)" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs cursor-pointer"
                                  style={{ borderColor: "var(--border)" }}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold" style={{ color: "var(--secondary)" }}>
                              {itemTotal.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Grand Total Display */}
              {selectedItems.length > 0 && (
                <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: "var(--border)" }}>
                  <div className="text-sm opacity-80 en">
                    Total Items Selected: <span className="font-semibold">{selectedItems.length}</span>
                  </div>
                  <div className="text-xl font-bold en" style={{ color: "var(--foreground)" }}>
                    Grand Total: <span style={{ color: "var(--secondary)" }}>{grandTotal.toFixed(2)} ETB</span>
                  </div>
                </div>
              )}
            </section>

            {/* Submission Action Bar */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/estimates")}
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer en disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || selectedItems.length === 0}
                className="px-8 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-md en disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                {submitting ? "Creating Estimate..." : "Submit Estimate"}
              </button>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}