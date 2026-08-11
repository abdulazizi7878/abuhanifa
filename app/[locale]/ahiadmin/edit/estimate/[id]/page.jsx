// app/[locale]/ahiadmin/edit/estimate/[id]/page.jsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditEstimateCompletePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [customerSpecificLocation, setCustomerSpecificLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [workStage, setWorkStage] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [status, setStatus] = useState("draft");

  // Items & Catalog States
  const [items, setItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Estimate Details and Materials Catalog on Load
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setMaterialsLoading(true);
      setError(false);

      try {
        // Fetch Estimate
        const estimateRes = await fetch(`/api/estimates/${id}`);
        if (!estimateRes.ok) {
          if (estimateRes.status === 404) {
            throw new Error("Estimate not found.");
          }
          throw new Error("Failed to fetch estimate details.");
        }
        const estimateData = await estimateRes.json();
        if (!estimateData.success || !estimateData.data) {
          throw new Error(estimateData.message || "Estimate not found.");
        }

        const est = estimateData.data;
        setCustomerName(est.customerName || "");
        setCustomerPhone(est.customerPhone || "");
        setCustomerLocation(est.customerLocation || "");
        setCustomerSpecificLocation(est.customerSpecificLocation || "");
        setWorkType(est.workType || "");
        setWorkStage(est.workStage || "");
        setProjectTitle(est.projectTitle || "");
        setProjectDescription(est.projectDescription || "");
        setStatus(est.status || "draft");

        // Map existing items to local state structure (using materialId and quantity primarily, with catalog info)
        const mappedItems = (est.items || []).map((item) => ({
            id: item.id, // IMPORTANT: estimate_items.id
            materialId: item.materialId,
            materialNameEnglish: item.materialNameEnglish || "Material",
            materialNameAmharic: item.materialNameAmharic || "",
            type: item.type || "",
            brand: item.brand || "",
            diameter: item.diameter || "",
            specification: item.specification || "",
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
          }));

        setItems(mappedItems);

        // Fetch Materials Catalog
        const materialsRes = await fetch("/api/materials");
        if (materialsRes.ok) {
          const matData = await materialsRes.json();
          setMaterials(matData.data || []);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
        setMaterialsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter materials for catalog search
  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const matchesCategory =
        selectedCategory === "all" ||
        mat.category?.toLowerCase() === selectedCategory.toLowerCase();

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        mat.materialNameEnglish?.toLowerCase().includes(searchLower) ||
        mat.materialNameAmharic?.toLowerCase().includes(searchLower) ||
        mat.type?.toLowerCase().includes(searchLower) ||
        mat.brand?.toLowerCase().includes(searchLower) ||
        mat.diameter?.toLowerCase().includes(searchLower) ||
        mat.category?.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [materials, selectedCategory, searchTerm]);

  // Add material from catalog or increase quantity if already present
  const handleAddMaterial = (material) => {
    const materialId = material.id;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.materialId === materialId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: null,
            materialId: material.id,
            materialNameEnglish: material.materialNameEnglish,
            materialNameAmharic: material.materialNameAmharic,
            type: material.type,
            brand: material.brand,
            diameter: material.diameter,
            specification: material.specification || "",
            price: Number(material.price || 0),
            quantity: 1,
          },
        ];
      }
    });
    toast.success(`Added ${material.materialNameEnglish}`);
  };

  // Change quantity via buttons
  const handleQuantityChange = (materialId, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.materialId === materialId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Direct quantity input setter
  const handleQuantityInput = (materialId, val) => {
    const qty = parseInt(val, 10);
    setItems((prev) =>
      prev.map((item) => {
        if (item.materialId === materialId) {
          return { ...item, quantity: isNaN(qty) || qty < 1 ? 1 : qty };
        }
        return item;
      })
    );
  };

  // Remove item from state
  const handleRemoveItem = (materialId) => {
    setItems((prev) => prev.filter((item) => item.materialId !== materialId));
    toast.info("Item removed");
  };

  // Grand total live calculation
  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
  }, [items]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  // Submit PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (items.length === 0) {
      toast.error("Please include at least one material item.");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        projectTitle: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        customerLocation: customerLocation.trim(),
        customerSpecificLocation: customerSpecificLocation.trim(),
        workType: workType.trim(),
        workStage: workStage.trim(),
        status: status,
        items: items.map((item) => ({
              id: item.id,
              materialId: item.materialId,
              quantity: item.quantity,
              price: Number(item.price || 0),
              total: Number(item.price || 0) * Number(item.quantity || 0),
        })),
      };

      const response = await fetch(`/api/estimates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update estimate.");
      }

      toast.success("Estimate updated successfully", { id: toastId });
      router.push(`/ahiadmin/view/estimates`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update estimate. Please try again.", {
        id: toastId,
      });
      setSaving(false);
    }
  };

  return (
    <main className="w-full bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Bar Navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push(`/ahiadmin/view/estimates`)}
            className="px-4 py-2 rounded-lg border text-sm font-medium transition en cursor-pointer flex items-center gap-2 hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            ← Back to Estimate
          </button>
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
              type="button"
              onClick={() => router.push("/ahiadmin/view/estimates")}
              className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
              style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
            >
              Go to Estimates List
            </button>
          </div>
        )}

        {/* Edit Form */}
        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Header Info */}
            <div className="pb-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h1 className="text-2xl sm:text-3xl font-bold en">Edit Estimate</h1>
              <p className="text-xs opacity-70 mt-1 en">Estimate #{id}</p>
            </div>

            {/* Customer Information Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-semibold en pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                Customer Information
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
                    Customer Location
                  </label>
                  <select
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en capitalize bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Buta Jira">Buta Jira</option>
                    <option value="Worabe">Worabe</option>
                    <option value="Halaba">Halaba</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Specific Location
                  </label>
                  <input
                    type="text"
                    value={customerSpecificLocation}
                    onChange={(e) => setCustomerSpecificLocation(e.target.value)}
                    placeholder="e.g. Near the main road"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Work Type
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en capitalize bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >                      
                                   
                  <option value="Electric">Electric</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Sanitary">Sanitary</option>
                  <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 en">
                    Work Stage
                  </label>
                  <select
                    value={workStage}
                    onChange={(e) => setWorkStage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en capitalize bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                     <option value="First Installation">First Installation</option>
                     <option value="Modification">Modification</option>
                     <option value="Finishing">Finishing</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Project Information & Status Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-semibold en pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                Project Information & Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm en capitalize bg-background text-foreground focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="draft">Draft</option>
                    <option value="final">Final</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 en">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. Full plumbing installation details..."
                  className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </section>

            {/* Material Search & Add Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-lg font-semibold en">Add Materials Catalog</h2>
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

              {materialsLoading ? (
                <div className="text-center py-6">
                  <p className="text-xs opacity-75 en">Loading catalog...</p>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs opacity-75 en">No materials match your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-lg border flex flex-col justify-between transition hover:shadow-xs bg-background"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-xs en">{mat.materialNameEnglish}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded border capitalize opacity-80" style={{ borderColor: "var(--border)" }}>
                            {mat.category}
                          </span>
                        </div>
                        {mat.materialNameAmharic && (
                          <div className="text-[10px] am opacity-80 mb-1">{mat.materialNameAmharic}</div>
                        )}
                        <div className="text-[10px] opacity-70 grid grid-cols-2 gap-1 mb-2 en">
                          <span>Type: {mat.type || "-"}</span>
                          <span>Brand: {mat.brand || "-"}</span>
                          <span>Diam: {mat.diameter || "-"}</span>
                          <span className="font-semibold" style={{ color: "var(--secondary)" }}>
                            Price: {mat.price} ETB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMaterial(mat)}
                        className="w-full py-1 px-2 rounded text-[11px] font-medium transition en cursor-pointer text-center shadow-xs"
                        style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Current Estimate Items Section */}
            <section
              className="p-6 rounded-xl shadow-md border bg-background space-y-4"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-semibold en pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                Current Estimate Items ({items.length})
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm font-medium en mb-1">No materials in this estimate.</p>
                  <p className="text-xs opacity-70 en">Use the catalog search above to add materials.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
                  <table className="w-full text-left border-collapse text-sm en">
                    <thead>
                      <tr
                        className="border-b text-xs opacity-80"
                        style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
                      >
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
                    <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {items.map((item) => {
                        const itemTotal = Number(item.price || 0) * item.quantity;
                        return (
                          <tr key={item.materialId} className="transition">
                            <td className="py-3 px-4">
                              <div className="font-medium">{item.materialNameEnglish}</div>
                              {item.materialNameAmharic && (
                                <div className="text-xs am opacity-80">{item.materialNameAmharic}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 opacity-90">{item.type || "-"}</td>
                            <td className="py-3 px-4 opacity-90">{item.brand || "-"}</td>
                            <td className="py-3 px-4 opacity-90">{item.diameter || "-"}</td>
                            <td className="py-3 px-4 opacity-90">{formatCurrency(item.price)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.materialId, -1)}
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
                                  onChange={(e) => handleQuantityInput(item.materialId, e.target.value)}
                                  onWheel={(e) => e.target.blur()}
                                  className="w-12 text-center rounded border text-xs py-1 bg-background text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  style={{ borderColor: "var(--border)" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.materialId, 1)}
                                  className="w-7 h-7 rounded border flex items-center justify-center font-bold text-xs cursor-pointer"
                                  style={{ borderColor: "var(--border)" }}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold" style={{ color: "var(--secondary)" }}>
                              {formatCurrency(itemTotal)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.materialId)}
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

              {/* Grand Total Summary */}
              {items.length > 0 && (
                <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="text-xl font-bold en">
                    Grand Total: <span style={{ color: "var(--secondary)" }}>{formatCurrency(grandTotal)} ETB</span>
                  </div>
                </div>
              )}
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/estimates/${id}`)}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer en disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || items.length === 0}
                className="px-8 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-md en disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        )}

      </div>
    </main>
  );
}
