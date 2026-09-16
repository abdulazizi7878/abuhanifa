"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PackagePlus, Image as ImageIcon, UploadCloud, Sparkles, Send, DollarSign, FolderPlus, Plus, X } from "lucide-react";

export default function CreateProduct() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Modal state for creating a category
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [creatingCategory, setCreatingCategory] = useState(false);

    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Fetch categories on mount
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (res.ok && data) {
                // Support both array response or response wrapped in object { categories: [...] }
                const categoriesList = Array.isArray(data) ? data : (data.categories || []);
                setCategories(categoriesList);
            } else {
                toast.error("Failed to load categories");
            }
        } catch (err) {
            toast.error("Error loading categories");
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    function imageSelect() {
        let imageFile = document.getElementById("image");
        imageFile?.click();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        setCreatingCategory(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });

            const data = await res.json();

            if (res.ok && (data.success !== false)) {
                toast.success("Category created successfully!");
                const createdCat = data.category || data;

                // Refresh categories list
                await fetchCategories();

                // Automatically select the new category if id is present
                if (createdCat && (createdCat.id || createdCat._id)) {
                    const newId = createdCat.id || createdCat._id;
                    setFormData((prev) => ({ ...prev, category_id: String(newId) }));
                    if (validationErrors.category_id) {
                        setValidationErrors((prev) => ({ ...prev, category_id: '' }));
                    }
                }

                setNewCategoryName('');
                setIsCategoryModalOpen(false);
            } else {
                toast.error(data.message || "Failed to create category");
            }
        } catch (err) {
            toast.error("An error occurred while creating category");
        } finally {
            setCreatingCategory(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Product name is required.';
        if (!formData.category_id) errors.category_id = 'Category selection is required.';
        if (!formData.description.trim()) errors.description = 'Product description is required.';
        if (!file) errors.file = 'Product image is required.';

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the validation errors before posting.');
        }
        return Object.keys(errors).length === 0;
    };

    const PostProduct = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitting(true);
        const toastId = toast.loading("Posting product...");

        // Construct FormData containing fields and the raw image File
        const bodyFormData = new FormData();
        bodyFormData.append("name", formData.name);
        bodyFormData.append("price", formData.price || 1);
        bodyFormData.append("description", formData.description);
        bodyFormData.append("category_id", formData.category_id);
        bodyFormData.append("image", file);

        try {
            const productResponse = await fetch("/api/postproduct", {
                method: "POST",
                credentials: "include",
                body: bodyFormData
            });

            const productData = await productResponse.json();

            if (!productResponse.ok || !productData.success) {
                throw new Error(
                    productData.message || "Failed to create product"
                );
            }

            toast.success("Product successfully posted!", { id: toastId });
            setFormData({ name: '', price: '', description: '', category_id: '' });
            setFile(null);
            location.reload();

        } catch (err) {
            toast.error(err.message || "We couldn't post the Product", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Create New Product
                </h1>
                <p className="mt-2 text-sm opacity-80">
                    Add new items, merchandise, or services to your catalog.
                </p>
            </div>

            <form
                onSubmit={PostProduct}
                className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
            >
                {/* Header Badge Section */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                            <PackagePlus className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                                Product Details
                            </h2>
                            <p className="text-xs opacity-60 font-medium">
                                Fill in the details below to add a new item
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)' }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
                        Admin Mode
                    </div>
                </div>

                {/* Main Form Fields */}
                <div className="flex flex-col gap-6">

                    {/* Product Name Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="name">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            title="Product Name"
                            placeholder="Enter product name..."
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Category Selection Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium" htmlFor="category_id">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="flex items-center gap-1 text-xs font-semibold transition hover:opacity-80 cursor-pointer"
                                style={{ color: 'var(--primary)' }}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create Category
                            </button>
                        </div>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            disabled={loadingCategories}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition cursor-pointer"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        >
                            <option value="">
                                {loadingCategories ? "Loading categories..." : "-- Select Category --"}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {validationErrors.category_id && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.category_id}</p>
                        )}
                    </div>

                    {/* Product Price Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="price">
                            Product Price (in Birr) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 opacity-50">
                                <DollarSign className="w-4 h-4" />
                            </span>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                title="Product Price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                className="w-full pl-10 pr-3.5 py-3 rounded-lg border text-sm outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                        </div>
                        {validationErrors.price && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.price}</p>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Product Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            title="Description"
                            placeholder="Write your product description here..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full min-h-[320px] rounded-lg px-3.5 py-3 border text-sm outline-none transition resize-y"
                            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        ></textarea>
                        {validationErrors.description && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.description}</p>
                        )}
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--foreground) 2%, transparent)' }}>
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    setFile(selectedFile || null);
                                    if (selectedFile) {
                                        toast.success(`Selected: ${selectedFile.name}`);
                                        if (validationErrors.file) setValidationErrors(prev => ({ ...prev, file: '' }));
                                    }
                                }}
                                id="image"
                            />

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    onClick={imageSelect}
                                    type="button"
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                >
                                    <UploadCloud className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                                    Upload an Image
                                </button>

                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold truncate">
                                        {file ? file.name : "No file chosen"}
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                        {file ? `${(file.size / 1000000).toFixed(2)} MB` : "No file selected"}
                                    </span>
                                </div>
                            </div>

                            {file && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Ready
                                </div>
                            )}
                        </div>
                        {validationErrors.file && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.file}</p>
                        )}
                    </div>

                    {/* Submit Button Action */}
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            title="Post the product"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Publishing..." : "POST"}
                        </button>
                    </div>

                </div>
            </form>

            {/* Modal for Creating Category */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="w-full max-w-md rounded-xl p-6 shadow-xl border relative"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="absolute top-4 right-4 text-xs opacity-60 hover:opacity-100 transition p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                                <FolderPlus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Create Category</h3>
                                <p className="text-xs opacity-60">Add a new category to assign to products</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" htmlFor="newCategoryName">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="newCategoryName"
                                    placeholder="e.g. Electronics, Clothing..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full rounded-lg px-3.5 py-2.5 border text-sm outline-none transition"
                                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer"
                                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingCategory}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                                    style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                                >
                                    {creatingCategory ? "Creating..." : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}