"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Loader2, ImagePlus, AlertCircle } from "lucide-react";

export default function ShowcaseAdminPage() {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch showcase images from the admin endpoint
    const fetchShowcase = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/installation-showcase");
            const json = await res.json();
            if (json.success) {
                setImages(json.data || json.showcases || []);
            } else {
                setErrorMessage(json.message || "Failed to load showcase images.");
            }
        } catch (err) {
            setErrorMessage("Network error fetching showcase.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShowcase();
    }, []);

    // Handle image selection and client-side preview
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setErrorMessage("");
        }
    };

    // Upload selected image
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            // Content-Type header is omitted intentionally so the browser generates the multipart boundary
            const res = await fetch("/api/installation-showcase", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (json.success) {
                setSelectedFile(null);
                setPreviewUrl(null);
                await fetchShowcase();
            } else {
                setErrorMessage(json.message || "Upload failed.");
            }
        } catch (err) {
            setErrorMessage("Network error uploading photo.");
        } finally {
            setIsUploading(false);
        }
    };

    // Delete showcase image
    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this showcase photo?");
        if (!confirmed) return;

        setDeletingId(id);
        setErrorMessage("");

        try {
            const res = await fetch("/api/installation-showcase", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const json = await res.json();

            if (json.success) {
                setImages((prev) => prev.filter((img) => img.id !== id));
            } else {
                setErrorMessage(json.message || "Deletion failed.");
            }
        } catch (err) {
            setErrorMessage("Network error deleting photo.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
            {/* Upload Section */}
            <div className="bg-(--foreground)/5 border border-(--border) rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-(--foreground) mb-4 flex items-center gap-2">
                    <ImagePlus className="w-5 h-5 text-(--primary)" />
                    <span>Add New Showcase Image</span>
                </h2>

                {errorMessage && (
                    <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-(--border) bg-(--background) hover:bg-(--foreground)/5 text-sm font-semibold text-(--foreground) transition">
                            <Upload className="w-4 h-4" />
                            <span>Select Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={!selectedFile || isUploading}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-(--foreground) text-(--background) font-bold text-sm hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <span>Upload Photo</span>
                            )}
                        </button>
                    </div>

                    {/* Preview image before uploading */}
                    {previewUrl && (
                        <div className="mt-4 relative w-40 h-40 rounded-2xl overflow-hidden border border-(--border)">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </form>
            </div>

            {/* Existing Photos Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-(--foreground)">
                    Current Showcase Images ({images.length})
                </h3>

                {isLoading ? (
                    <div className="py-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-(--primary)" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="py-12 text-center text-sm font-medium opacity-60 text-(--foreground)">
                        No showcase images added yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((item) => (
                            <div
                                key={item.id}
                                className="relative group rounded-2xl overflow-hidden border border-(--border) bg-(--foreground)/5 h-56 shadow-sm"
                            >
                                <img
                                    src={item.image}
                                    alt="Showcase item"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {/* Delete overlay button */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={deletingId === item.id}
                                        className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 shadow-lg cursor-pointer"
                                        aria-label="Delete image"
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}