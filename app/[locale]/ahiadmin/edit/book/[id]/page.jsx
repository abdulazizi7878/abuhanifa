"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Edit3, UploadCloud, Send, Link as LinkIcon, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditBook() {
    const router = useRouter();
    const params = useParams();
    const bookId = params?.id;

    const [loadingBook, setLoadingBook] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [telegramUrl, setTelegramUrl] = useState("");
    const [currentCoverUrl, setCurrentCoverUrl] = useState("");

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            setLoadingBook(true);
            try {
                const res = await fetch(`/api/books?id=${bookId}`);
                const data = await res.json();

                if (res.ok && data) {
                    const book = data.book || data;
                    setTitle(book.title || "");
                    setDescription(book.description || "");
                    setTelegramUrl(book.telegram_url || "");
                    setCurrentCoverUrl(book.cover_url || "");
                } else {
                    toast.error("Book not found");
                    router.push("/ahiadmin/view/books");
                }
            } catch (err) {
                toast.error("Failed to load book data");
            } finally {
                setLoadingBook(false);
            }
        };

        fetchBook();
    }, [bookId, router]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            setFile(null);
            setPreviewUrl("");
            return;
        }

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Unsupported cover format. Use JPG, JPEG, PNG, or WEBP.");
            return;
        }

        if (selectedFile.size > 4 * 1024 * 1024) {
            toast.error("Cover image size exceeds 4 MB.");
            return;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const validateForm = () => {
        const errors = {};
        if (!telegramUrl.trim()) {
            errors.telegramUrl = "Telegram PDF link is required.";
        } else if (!telegramUrl.trim().startsWith("https://t.me/")) {
            errors.telegramUrl = "Please enter a valid Telegram URL (e.g. https://t.me/...)";
        }

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the validation errors.");
        }
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        const toastId = toast.loading("Updating book...");

        const bodyFormData = new FormData();
        bodyFormData.append("id", bookId);
        bodyFormData.append("title", title.trim());
        bodyFormData.append("description", description.trim());
        bodyFormData.append("telegram_url", telegramUrl.trim());

        if (file) {
            bodyFormData.append("cover", file);
        }

        try {
            const res = await fetch("/api/books", {
                method: "PUT",
                credentials: "include",
                body: bodyFormData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data.success === false) {
                throw new Error(data.message || "Failed to update book");
            }

            toast.success("Book updated successfully!", { id: toastId });
            router.push("/ahiadmin/view/books");
        } catch (err) {
            toast.error(err.message || "Server error while updating book", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingBook) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
                <p className="text-sm font-medium opacity-70">Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                        Edit Book
                    </h1>
                    <p className="mt-1 text-sm opacity-80">Modify existing book details</p>
                </div>
                <Link
                    href="/ahiadmin/view/books"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition hover:opacity-80"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Books
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-xl shadow-lg border backdrop-blur-sm"
                style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
            >
                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg px-3.5 py-3 border text-sm outline-none transition"
                            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                        />
                    </div>

                    {/* Telegram Link */}
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
                                value={telegramUrl}
                                onChange={(e) => setTelegramUrl(e.target.value)}
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
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[160px] rounded-lg px-3.5 py-3 border text-sm outline-none transition resize-y"
                            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                        ></textarea>
                    </div>

                    {/* Cover Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Cover Image <span className="text-xs opacity-60">(Leave unchanged or upload new cover)</span>
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
                                    Change Cover
                                </button>

                                <span className="text-xs font-medium opacity-80">
                                    {file ? file.name : "Keeping existing cover"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-50 block">
                                        {previewUrl ? "New Preview" : "Current Cover"}
                                    </span>
                                </div>
                                <div className="w-16 h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                                    <img
                                        src={previewUrl || currentCoverUrl}
                                        alt="Book Cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                        <Link
                            href="/ahiadmin/view/books"
                            className="px-5 py-2.5 rounded-lg text-sm font-medium border transition hover:opacity-80"
                            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
                            style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}