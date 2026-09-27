"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BookOpen, ExternalLink, Edit, Trash2, Plus, Eye, X, Loader2, Calendar } from "lucide-react";

export default function ViewBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/books?page=1&limit=50");
            const data = await res.json();

            if (res.ok) {
                const list = Array.isArray(data) ? data : data.books || [];
                setBooks(list);
            } else {
                toast.error("Failed to load books");
            }
        } catch (err) {
            toast.error("Error loading books list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this book?")) return;

        setDeletingId(id);
        try {
            const res = await fetch("/api/books", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && data.success !== false) {
                toast.success("Book deleted successfully!");
                setBooks((prev) => prev.filter((b) => b.id !== id));
                if (selectedBook?.id === id) setSelectedBook(null);
            } else {
                toast.error(data.message || "Failed to delete book");
            }
        } catch (err) {
            toast.error("An error occurred while deleting the book");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--foreground)" }}>
                        Book Library
                    </h1>
                    <p className="text-xs sm:text-sm opacity-70 mt-1">
                        Manage your published Telegram books catalog.
                    </p>
                </div>

                <Link
                    href="/ahiadmin/create/book"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                    <Plus className="w-4 h-4" />
                    Create Book
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
                    <p className="text-sm opacity-70">Loading books...</p>
                </div>
            ) : books.length === 0 ? (
                <div
                    className="p-12 text-center rounded-xl border"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}
                >
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold">No books found</p>
                    <p className="text-xs opacity-60 mt-1">Get started by creating a new book.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="rounded-xl border shadow-md flex flex-col overflow-hidden transition hover:shadow-lg"
                            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                        >
                            <div className="relative h-48 w-full bg-black/10 overflow-hidden">
                                <img
                                    src={book.cover_url}
                                    alt={book.title || "Book Cover"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-base line-clamp-1" style={{ color: "var(--foreground)" }}>
                                        {book.title || "Untitled Book"}
                                    </h3>
                                    <p className="text-xs opacity-70 mt-1 line-clamp-2">
                                        {book.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                                    <a
                                        href={book.telegram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Open PDF on Telegram
                                    </a>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedBook(book)}
                                            className="p-2 rounded-lg border hover:opacity-80 transition cursor-pointer"
                                            style={{ borderColor: "var(--border)" }}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/ahiadmin/edit/book/${book.id}`}
                                                className="p-2 rounded-lg border hover:opacity-80 transition cursor-pointer"
                                                style={{ borderColor: "var(--border)" }}
                                                title="Edit Book"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(book.id)}
                                                disabled={deletingId === book.id}
                                                className="p-2 rounded-lg border text-red-500 hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
                                                style={{ borderColor: "var(--border)" }}
                                                title="Delete Book"
                                            >
                                                {deletingId === book.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Read-Only View Modal */}
            {selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div
                        className="w-full max-w-xl rounded-xl p-6 shadow-2xl border relative max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedBook(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg opacity-60 hover:opacity-100 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-40 h-56 rounded-lg overflow-hidden border shrink-0" style={{ borderColor: "var(--border)" }}>
                                <img
                                    src={selectedBook.cover_url}
                                    alt={selectedBook.title || "Book Cover"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {selectedBook.title || "Untitled Book"}
                                    </h2>

                                    <a
                                        href={selectedBook.telegram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-2 hover:underline"
                                        style={{ color: "var(--primary)" }}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Telegram Link
                                    </a>

                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold uppercase opacity-50 tracking-wider">Description</h4>
                                        <p className="text-xs opacity-80 mt-1 whitespace-pre-line leading-relaxed">
                                            {selectedBook.description || "No description provided."}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1 text-[11px] opacity-60 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        <span>Created: {new Date(selectedBook.created_at).toLocaleString()}</span>
                                    </div>
                                    {selectedBook.updated_at && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            <span>Updated: {new Date(selectedBook.updated_at).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <Link
                                href={`/ahiadmin/edit/book/${selectedBook.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition"
                                style={{ borderColor: "var(--border)" }}
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleDelete(selectedBook.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}