'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Plus, Search, ShoppingBag, Trash2, Send, X, Layers } from "lucide-react";

export default function CreateEstimatePage() {
  const router = useRouter();

  // Form & UI States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [workType, setWorkType] = useState("");
  const [workStage, setWorkStage] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerSpecificLocation, setCustomerSpecificLocation] = useState("");
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
    if (!workType.trim()) {
      toast.error("Work type is required.");
      return;
    }
    if (!workStage.trim()) {
      toast.error("Work stage is required.");
      return;
    }
    if (!customerLocation.trim()) {
      toast.error("Customer location is required.");
      return;
    }
    if (!customerSpecificLocation.trim()) {
      toast.error("Customer specific location is required.");
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
        workType: workType.trim(),
        workStage: workStage.trim(),
        customerLocation: customerLocation.trim(),
        customerSpecificLocation: customerSpecificLocation.trim(),
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
        router.push(`/ahiadmin/view/estimates`);
      } else {
        router.push("/ahiadmin/view/estimates");
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
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Page Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          Create New Estimate
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Configure homeowner project details and select required installation materials.
        </p>
      </div>

      <form onSubmit={handleSubmitEstimate} className="space-y-8">
        
        {/* Customer & Project Information Section */}
        <section
          className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                <FileText className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Customer & Project Information
                </h2>
                <p className="text-xs opacity-60 font-medium">
                  Enter client credentials, location coordinates, and project context
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="e.g. Ahmed"
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Work Type <span className="text-red-500">*</span>
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                required
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">Select Work Type</option>
                <option value="Electric">Electric</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Sanitary">Sanitary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Work Stage <span className="text-red-500">*</span>
              </label>
              <select
                value={workStage}
                onChange={(e) => setWorkStage(e.target.value)}
                required
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">Select Work Stage</option>
                <option value="First Installation">First Installation</option>
                <option value="Modification">Modification</option>
                <option value="Finishing">Finishing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Location <span className="text-red-500">*</span>
              </label>
              <select
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                required
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="">Select Customer Location</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Buta Jira">Buta Jira</option>
                <option value="Worabe">Worabe</option>
                <option value="Halaba">Halaba</option>
              </select>
            </div> 

            <div> 
              <label className="block text-sm font-medium mb-2">
                Customer Specific Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerSpecificLocation}
                onChange={(e) => setCustomerSpecificLocation(e.target.value)}
                required
                placeholder="e.g. Downtown"
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required  
                placeholder="e.g. 0912345678"
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. House Installation"
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description
              </label>
              <input
                type="text"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="e.g. Full installation"
                className="w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
        </section>

        {/* Material Selection & Catalog Section */}
        <section
          className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                <Search className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Material Catalog Selection
                </h2>
                <p className="text-xs opacity-60 font-medium">
                  Search and browse available catalog items to attach to this quote
                </p>
              </div>
            </div>
            
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 opacity-50">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search material..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-3.5 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg border text-sm outline-none transition"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
              <p className="text-sm opacity-80">Loading materials catalog...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500 text-sm">
              Unable to load materials. Please check your connection and try again.
            </div>
          )}

          {!loading && !error && filteredMaterials.length === 0 && (
            <div className="text-center py-10 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
              <p className="text-sm opacity-75">No materials match your search criteria.</p>
            </div>
          )}

          {/* Material Quick List Grid */}
          {!loading && !error && filteredMaterials.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-lg border flex flex-col justify-between transition hover:shadow-md"
                  style={{ backgroundColor: 'var(--background)', borderColor: "var(--border)" }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{mat.materialNameEnglish}</span>
                      <span className="text-xs px-2 py-0.5 rounded border capitalize opacity-80" style={{ borderColor: "var(--border)" }}>
                        {mat.category}
                      </span>
                    </div>
                    <div className="text-xs opacity-80 mb-2">{mat.materialNameAmharic}</div>
                    <div className="text-xs opacity-70 grid grid-cols-2 gap-1 mb-3">
                      <span>Type: {mat.type}</span>
                      <span>Brand: {mat.brand}</span>
                      <span>Diam: {mat.diameter}</span>
                      <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                        Price: {mat.price} ETB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddMaterial(mat)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Estimate
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Selected Estimate Items Section */}
        <section
          className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                <ShoppingBag className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  Selected Estimate Items
                </h2>
                <p className="text-xs opacity-60 font-medium">
                  Review selected inventory, adjust quantities, and verify live totals
                </p>
              </div>
            </div>
          </div>

          {selectedItems.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
              <p className="text-base font-medium mb-1">No materials added yet.</p>
              <p className="text-xs opacity-70">Select materials from the catalog above to build your estimate.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs opacity-80" style={{ borderColor: "var(--border)" }}>
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
                <tbody className="divide-y text-sm" style={{ borderColor: "var(--border)" }}>
                  {selectedItems.map((item) => {
                    const itemTotal = Number(item.price || 0) * item.quantity;
                    return (
                      <tr key={item.id} className="transition">
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.materialNameEnglish}</div>
                          <div className="text-xs opacity-80">{item.materialNameAmharic}</div>
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
                              className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs cursor-pointer transition"
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
                              className="w-12 text-center rounded border text-xs py-1 outline-none"
                              style={{ backgroundColor: 'var(--background)', borderColor: "var(--border)", color: 'var(--foreground)' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs cursor-pointer transition"
                              style={{ borderColor: "var(--border)" }}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold" style={{ color: 'var(--primary)' }}>
                          {itemTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex items-center justify-center gap-1 ml-auto px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
            <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-sm opacity-80">
                Total Items Selected: <span className="font-semibold">{selectedItems.length}</span>
              </div>
              <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Grand Total: <span style={{ color: 'var(--primary)' }}>{grandTotal.toFixed(2)} ETB</span>
              </div>
            </div>
          )}
        </section>

        {/* Submission Action Bar */}
        <div className="flex justify-end gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            onClick={() => router.push("/estimates")}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border text-sm font-medium transition cursor-pointer disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: 'var(--foreground)' }}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedItems.length === 0}
            className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-medium transition cursor-pointer shadow-md disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
          >
            <Send className="w-4 h-4" />
            {submitting ? "Creating Estimate..." : "Submit Estimate"}
          </button>
        </div>

      </form>
    </div>
  );
}
