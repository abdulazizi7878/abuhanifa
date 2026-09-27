'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Book, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomepageBooksSection() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const t = useTranslations("books");

    useEffect(() => {
        let isMounted = true;
        async function fetchBooks() {
            try {
                const res = await fetch('/api/public-books?page=1&limit=4');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                if (isMounted) {
                    setBooks(data.books || data.data || (Array.isArray(data) ? data : []));
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        }
        fetchBooks();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] text-[var(--foreground)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-sm uppercase tracking-wider mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{t("Library & Publications")}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {t("Featured Books")}
                    </h2>
                </div>
                <Link
                    href="/books"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline transition-all"
                >
                    <span>{t("View All Books")}</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden flex flex-col h-full"
                        >
                            <div className="w-full aspect-[3/4] bg-[var(--muted)]/60" />
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="h-5 w-3/4 bg-[var(--muted)]/60 rounded-md" />
                                    <div className="h-3 w-full bg-[var(--muted)]/30 rounded-md" />
                                    <div className="h-3 w-2/3 bg-[var(--muted)]/30 rounded-md" />
                                </div>
                                <div className="h-9 w-full bg-[var(--muted)]/50 rounded-xl mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/20 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
                    <p className="text-sm text-[var(--muted-foreground)]">
                        {t("Unable to load books")}
                    </p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && books.length === 0 && (
                <div className="p-12 rounded-2xl border border-[var(--border)] text-center space-y-3">
                    <Book className="w-10 h-10 mx-auto text-[var(--muted-foreground)]" />
                    <h3 className="font-semibold text-lg">{t("No books available yet")}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        {t("New educational and technical guides will appear here soon")}
                    </p>
                </div>
            )}

            {/* Books Grid */}
            {!loading && !error && books.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full overflow-hidden shadow-xs hover:shadow-md"
                        >
                            <div className="relative w-full aspect-[3/4] bg-[var(--muted)]/30 overflow-hidden">
                                {book.cover_url ? (
                                    <Image
                                        src={book.cover_url}
                                        alt={book.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[var(--muted-foreground)]">
                                        <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-xs">No Cover</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-base line-clamp-1 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                        {book.title}
                                    </h3>
                                    {book.description && (
                                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                                            {book.description}
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={`/books/${book.id}`}
                                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--muted)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--foreground)] font-semibold text-xs transition-colors flex items-center justify-center gap-2 text-center"
                                >
                                    <span>View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}