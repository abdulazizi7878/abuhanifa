"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ViewProducts() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    // Active Dropdown Menu State
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Delete modal states
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                const catList = Array.isArray(data) ? data : (data.categories || []);
                setCategories(catList);
            }
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
    };

    // Fetch products on load
    const fetchProducts = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch("/api/showproducts", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products.');
            }
            const data = await response.json();
            setProducts(data?.data || []);
        } catch (err) {
            console.error(err);
            setError(true);
            toast.error('Unable to load products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Create a map of category ID to name for fast lookup
    const categoryMap = useMemo(() => {
        const map = {};
        categories.forEach((cat) => {
            const id = String(cat.id || cat._id);
            map[id] = cat.name;
        });
        return map;
    }, [categories]);

    // Close dropdown menu when clicking anywhere outside
    useEffect(() => {
        const handleOutsideClick = () => setActiveMenuId(null);
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, []);

    const handleEdit = (link) => {
        setActiveMenuId(null);
        router.push(`/ahiadmin/edit/product/${link}`);
    };

    const openDeleteModal = (product) => {
        setActiveMenuId(null);
        setProductToDelete(product);
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setProductToDelete(null);
        }
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        const toastId = toast.loading('Deleting product...');

        try {
            const response = await fetch("/api/delete", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    item: "product",
                    id: productToDelete.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete product.');
            }

            setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id));
            toast.success('Product deleted successfully', { id: toastId });
            setProductToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete product. Please try again.', { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    // Filtered products based on search query and selected category
    const filteredProducts = useMemo(() => {
        return products.filter((pr) => {
            const query = searchQuery.toLowerCase();
            const name = (pr.name || "").toLowerCase();
            const price = String(pr.price || "").toLowerCase();

            const matchesSearch = !searchQuery || name.includes(query) || price.includes(query);

            const prCategoryId = pr.category_id || pr.categoryId || (pr.category && (pr.category.id || pr.category._id));
            const matchesCategory =
                selectedCategory === "ALL" ||
                String(prCategoryId) === String(selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Helper to resolve product category name
    const getCategoryName = (pr) => {
        if (pr.category_name) return pr.category_name;
        if (pr.category?.name) return pr.category.name;

        const catId = pr.category_id || pr.categoryId;
        if (catId && categoryMap[String(catId)]) {
            return categoryMap[String(catId)];
        }

        return "Uncategorized";
    };

    return (
        <>
            <main className="bg-[var(--background)] text-[var(--foreground)]">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Page Title Header & Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight en text-[var(--secondary)]">
                                Abuhanifa Installation
                            </h1>
                            <p className="text-2xl sm:text-3xl font-extrabold en mt-1">
                                All Products
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/ahiadmin/create/product')}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium transition en cursor-pointer shadow-md flex items-center gap-2 hover:opacity-90 bg-[var(--primary)] text-white"
                        >
                            + Add Product
                        </button>
                    </div>

                    {/* Controls: Search Bar & Category Filter */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search by product name or price..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)]"
                        />

                        {/* Category Filter Dropdown */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-60 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm en bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:border-[var(--primary)] cursor-pointer"
                        >
                            <option value="ALL">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-28">
                            <p className="text-base font-medium opacity-80 en">Loading products...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="text-center py-20 p-8 rounded-xl border border-red-500/30 bg-red-500/10 max-w-lg mx-auto">
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2 en">
                                Unable to Load Products
                            </h2>
                            <p className="text-sm opacity-80 mb-6 en">Unable to load products.</p>
                            <button
                                onClick={fetchProducts}
                                className="px-5 py-2 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md bg-[var(--primary)] text-white"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredProducts.length === 0 && (
                        <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-lg mx-auto space-y-4 bg-[var(--background)]">
                            <h3 className="text-lg font-bold en">No products found.</h3>
                            <p className="text-sm opacity-75 en">
                                {products.length === 0
                                    ? "Add your first product to get started."
                                    : "No products match your search or category filter."}
                            </p>
                            {products.length === 0 && (
                                <button
                                    onClick={() => router.push('/ahiadmin/create/product')}
                                    className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md inline-block bg-[var(--primary)] text-white"
                                >
                                    Add Product
                                </button>
                            )}
                        </div>
                    )}

                    {/* Products Table */}
                    {!loading && !error && filteredProducts.length > 0 && (
                        <div className="rounded-xl border border-[var(--border)] shadow-md bg-[var(--background)]">
                            <div className="overflow-x-auto min-h-[300px]">
                                <table className="w-full text-left border-collapse text-sm en">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--border)]/10 text-xs font-semibold uppercase tracking-wider opacity-80">
                                            <th className="py-3.5 px-4">Name</th>
                                            <th className="py-3.5 px-4">Category</th>
                                            <th className="py-3.5 px-4">Price</th>
                                            <th className="py-3.5 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {filteredProducts.map((pr) => (
                                            <tr key={pr.id} className="transition hover:bg-[var(--border)]/10">
                                                {/* Product Name */}
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                                        {pr.name}
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-4 opacity-80 font-medium">
                                                    {getCategoryName(pr)}
                                                </td>

                                                {/* Price */}
                                                <td className="py-4 px-4 font-bold text-[var(--secondary)]">
                                                    {pr.price} Birr
                                                </td>

                                                {/* Actions Dropdown */}
                                                <td className="py-4 px-4 text-right">
                                                    <div
                                                        className="relative inline-block text-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveMenuId(activeMenuId === pr.id ? null : pr.id)}
                                                            className="p-2 rounded-lg border border-[var(--border)] cursor-pointer bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
                                                            title="Actions"
                                                        >
                                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="5" r="2" />
                                                                <circle cx="12" cy="12" r="2" />
                                                                <circle cx="12" cy="19" r="2" />
                                                            </svg>
                                                        </button>

                                                        {activeMenuId === pr.id && (
                                                            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl border border-[var(--border)] z-50 overflow-hidden bg-[var(--background)] text-[var(--foreground)] py-1.5">
                                                                <div>
                                                                    <button
                                                                        onClick={() => handleEdit(pr.link)}
                                                                        className="w-full text-left px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[var(--border)]/20 transition-colors"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <div className="border-t border-[var(--border)] my-1"></div>

                                                                    <button
                                                                        onClick={() => openDeleteModal(pr)}
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
                    {productToDelete && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={closeDeleteModal}
                        >
                            <div
                                className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-red-500 en">Delete Product?</h3>
                                <p className="text-sm opacity-80 en leading-relaxed">
                                    Are you sure you want to delete <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{productToDelete.name}</span>? This action cannot be undone.
                                </p>

                                {/* Selected Product Preview Card */}
                                <div
                                    className="p-4 rounded-lg border border-[var(--border)] bg-[var(--border)]/5 space-y-1"
                                >
                                    <div className="font-semibold en text-sm">{productToDelete.name}</div>
                                    <div className="text-xs opacity-70 en">{productToDelete.price} Birr</div>
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
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}