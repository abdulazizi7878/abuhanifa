"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookPlus, Image as ImageIcon, UploadCloud, Sparkles, Send, Link as LinkIcon } from "lucide-react";

export default function CreateBook() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [telegramUrl, setTelegramUrl] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            setFile(null);
            setPreviewUrl("");
            return;
        }

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.");
            return;
        }

        if (selectedFile.size > 4 * 1024 * 1024) {
            toast.error("File size exceeds 4 MB limit.");
            return;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        if (validationErrors.file) {
            setValidationErrors((prev) => ({ ...prev, file: "" }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!telegramUrl.trim()) {
            errors.telegramUrl = "Telegram PDF link is required.";
        } else if (!telegramUrl.trim().startsWith("https://t.me/")) {
            errors.telegramUrl = "Please enter a valid Telegram URL (e.g. https://t.me/...)";
        }

        if (!file) {
            errors.file = "Book cover image is required.";
        }

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the validation errors before submitting.");
        }
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        const toastId = toast.loading("Creating book...");

        const bodyFormData = new FormData();
        if (title.trim()) bodyFormData.append("title", title.trim());
        if (description.trim()) bodyFormData.append("description", description.trim());
        bodyFormData.append("telegram_url", telegramUrl.trim());
        bodyFormData.append("cover", file);

        try {
            const res = await fetch("/api/books", {
                method: "POST",
                credentials: "include",
                body: bodyFormData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Failed to create book");
            }

            toast.success("Book created successfully!", { id: toastId });
            router.push("/ahiadmin/view/books");
        } catch (err) {
            toast.error(err.message || "Server error while creating book", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                    Create New Book
                </h1>
                <p className="mt-2 text-sm opacity-80">
                    Add a new book entry with a Telegram PDF link and cover image.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
            >
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }}
                        >
                            <BookPlus className="w-6 h-6" style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                                Book Details
                            </h2>
                            <p className="text-xs opacity-60 font-medium">
                                Fill in details to publish a new book resource
                            </p>
                        </div>
                    </div>
                    <div
                        className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider opacity-80"
                        style={{ backgroundColor: "color-mix(in srgb, var(--foreground) 5%, transparent)" }}
                    >
                        <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
                        Admin Mode
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="title">
                            Title <span className="text-xs opacity-60">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter book title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                        />
                    </div>

                    {/* Telegram PDF Link */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="telegramUrl">
                            Telegram PDF Link <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 opacity-50">
                                <LinkIcon className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                id="telegramUrl"
                                placeholder="https://t.me/..."
                                value={telegramUrl}
                                onChange={(e) => {
                                    setTelegramUrl(e.target.value);
                                    if (validationErrors.telegramUrl) setValidationErrors((prev) => ({ ...prev, telegramUrl: "" }));
                                }}
                                className="w-full pl-10 pr-3.5 py-3 rounded-lg border text-sm outline-none transition"
                                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                            />
                        </div>
                        {validationErrors.telegramUrl && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.telegramUrl}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="description">
                            Description <span className="text-xs opacity-60">(Optional)</span>
                        </label>
                        <textarea
                            id="description"
                            placeholder="Write book description or summary..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[160px] rounded-lg px-3.5 py-3 border text-sm outline-none transition resize-y"
                            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                        ></textarea>
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Cover Image <span className="text-red-500">*</span> <span className="text-xs opacity-60">(Max 4MB, JPG/PNG/WEBP)</span>
                        </label>
                        <div
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border"
                            style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--foreground) 2%, transparent)" }}
                        >
                            <input
                                type="file"
                                hidden
                                id="cover"
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handleFileChange}
                            />

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("cover")?.click()}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                                >
                                    <UploadCloud className="w-4 h-4" style={{ color: "var(--primary)" }} />
                                    Upload Cover
                                </button>

                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold truncate">
                                        {file ? file.name : "No file chosen"}
                                    </span>
                                    <span className="text-[10px] opacity-60">
                                        {file ? `${(file.size / 1000000).toFixed(2)} MB` : "Select an image"}
                                    </span>
                                </div>
                            </div>

                            {previewUrl && (
                                <div className="relative w-16 h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                                    <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        {validationErrors.file && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.file}</p>
                        )}
                    </div>

                    {/* Submit Button Action */}
                    <div className="flex justify-end pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Creating..." : "Create Book"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}