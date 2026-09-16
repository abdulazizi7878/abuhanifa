"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus, Plus, X } from "lucide-react";

export default function EditProducts({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const link = resolvedParams?.link;

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Form fields state
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");

    // Modal state for creating a category
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Fetch categories on mount
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (res.ok && data) {
                const categoriesList = Array.isArray(data) ? data : (data.categories || []);
                setCategories(categoriesList);
            } else {
                toast.error("Failed to load categories");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            toast.error("Error loading categories");
        } finally {
            setLoadingCategories(false);
        }
    };

    async function GetProduct() {
        if (!link) {
            setLoading(false);
            setError(true);
            setErrorMessage("Product link does not exist.");
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMessage("");

        try {
            const response = await fetch("/api/showproduct", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                    amount: 1
                })
            });
            const resData = await response.json();

            if (resData.success && resData?.data?.result?.length > 0) {
                const productData = resData.data.result[0];
                setProduct(productData);
                setName(productData?.name || "");
                setPrice(productData?.price || "");

                const catId = productData?.category_id || productData?.categoryId || (productData?.category && (productData?.category.id || productData?.category._id));
                setCategoryId(catId ? String(catId) : "");

                setDescription(productData?.description || "");
            } else {
                setError(true);
                setErrorMessage("We couldn't get the product");
                toast.error("We couldn't get the product");
            }
        } catch (err) {
            console.error("error while fetching", err);
            setError(true);
            setErrorMessage("Unable to load product details.");
            toast.error("Unable to load product details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
        GetProduct();
    }, [link]);

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

                await fetchCategories();

                if (createdCat && (createdCat.id || createdCat._id)) {
                    const newId = createdCat.id || createdCat._id;
                    setCategoryId(String(newId));
                }

                setNewCategoryName("");
                setIsCategoryModalOpen(false);
            } else {
                toast.error(data.message || "Failed to create category");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating category");
        } finally {
            setCreatingCategory(false);
        }
    };

    async function UpdateProduct(e) {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Product name is required.");
            return;
        }

        if (!categoryId) {
            toast.error("Category selection is required.");
            return;
        }

        setUpdating(true);
        const toastId = toast.loading("Updating product...");

        try {
            const response = await fetch("/api/updateproduct", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                    name: name.trim(),
                    price: price || 1,
                    category_id: categoryId,
                    description: description.trim()
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Product updated successfully", { id: toastId });
                router.push("/ahiadmin/view/products");
            } else {
                throw new Error(data.message || "Failed to update product.");
            }
        } catch (err) {
            console.error(err);
            toast.error("We couldn't update the product", { id: toastId });
        } finally {
            setUpdating(false);
        }
    }

    return (
        <main className="w-full flex flex-col justify-center items-center">
            <div className="w-full max-w-4xl space-y-6">

                {/* Top Bar Navigation */}
                <div className="flex justify-between items-center mb-2">
                    <button
                        type="button"
                        onClick={() => router.push("/ahiadmin/view/products")}
                        className="px-4 py-2 rounded-lg border text-sm font-medium transition en cursor-pointer flex items-center gap-2 hover:opacity-80"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                        ← Back to Products
                    </button>
                    <a
                        href="/ahiadmin/create/product"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-md"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                    >
                        Create a new Product
                    </a>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-sm font-medium opacity-80 en">loading</p>
                    </div>
                )}

                {/* Error State / Not Found Message */}
                {!loading && error && (
                    <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10 space-y-4">
                        <p className="text-lg text-red-600 dark:text-red-400 font-medium en">
                            {errorMessage || "Product does not exist."}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={GetProduct}
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md border"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Try Again
                            </button>
                            <a
                                href="/ahiadmin/create/product"
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                Create a new Product
                            </a>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {!loading && !error && (
                    <form
                        onSubmit={UpdateProduct}
                        className="rounded-xl shadow-lg border p-6 sm:p-8 space-y-6 backdrop-blur-sm"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    >
                        <div className="pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                            <h1 className="text-2xl sm:text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                Edit Product
                            </h1>
                            <p className="text-xs opacity-70 mt-1 en">Product link: {link}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    title="Product Name"
                                    placeholder="Product Name"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            {/* Category Selection Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium en" style={{ color: 'var(--foreground)' }}>
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
                                    id="categoryId"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    disabled={loadingCategories}
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm cursor-pointer"
                                    style={{ borderColor: 'var(--border)' }}
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Product Price (in birr) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    title="Product Price"
                                    placeholder="Product Price in birr..."
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Product Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    title="Description"
                                    placeholder="Product Description"
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm resize-y"
                                    style={{ borderColor: 'var(--border)' }}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <button
                                type="button"
                                onClick={() => router.push("/ahiadmin/view/products")}
                                disabled={updating}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer en disabled:opacity-50"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-md en disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                {updating ? "Updating..." : "Update Product"}
                            </button>
                        </div>
                    </form>
                )}

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
        </main>
    );
}