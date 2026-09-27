'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ExternalLink, ChevronLeft, ChevronRight, BookX, Search, X } from 'lucide-react';

export default function BooksClient({ books = [], currentPage = 1, totalPages = 1 }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = useMemo(() => {
        if (!searchQuery.trim()) return books;
        const query = searchQuery.toLowerCase().trim();
        return books.filter((book) => {
            const titleMatch = book.title?.toLowerCase().includes(query);
            const descMatch = book.description?.toLowerCase().includes(query);
            return titleMatch || descMatch;
        });
    }, [books, searchQuery]);

    return (
        <div className="space-y-8">
            {/* Header & Search Bar Row */}
            <div className="border-b border-[var(--border)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-xs uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>Digital Library</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                        Books & Publications
                    </h1>
                </div>

                {/* Live Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search books by title or topic..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs focus:outline-hidden focus:border-[var(--primary)] transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-md"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Empty State: No Books */}
            {(!books || books.length === 0) && (
                <div className="py-20 text-center space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--muted)]/10">
                    <BookX className="w-12 h-12 mx-auto text-[var(--muted-foreground)]" />
                    <h2 className="text-xl font-bold">No books available yet</h2>
                    <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
                        We haven't published any books in this section yet. Please check back later.
                    </p>
                </div>
            )}

            {/* Empty State: Search Query No Match */}
            {books && books.length > 0 && filteredBooks.length === 0 && (
                <div className="py-16 text-center space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/10">
                    <Search className="w-10 h-10 mx-auto text-[var(--muted-foreground)] opacity-50" />
                    <h3 className="font-bold text-lg">No matching publications</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                        No books found matching "{searchQuery}".
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 rounded-xl bg-[var(--muted)] text-xs font-semibold hover:bg-[var(--border)] transition-colors mt-2"
                    >
                        Clear Search
                    </button>
                </div>
            )}

            {/* Book Grid */}
            {filteredBooks && filteredBooks.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                    {filteredBooks.map((book) => {
                        const telegramUrl = book.telegram_url || book.telegram_link;
                        return (
                            <div
                                key={book.id}
                                className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full overflow-hidden shadow-xs hover:shadow-lg"
                            >
                                <div className="relative w-full aspect-[3/4] bg-[var(--muted)]/30 overflow-hidden shrink-0">
                                    {book.cover_url ? (
                                        <Image
                                            src={book.cover_url}
                                            alt={book.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[var(--muted-foreground)]">
                                            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                                            <span className="text-xs">No Cover</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                                    <div className="space-y-2">
                                        <h2 className="font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                            {book.title}
                                        </h2>
                                        {book.description ? (
                                            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap break-words">
                                                {book.description}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-[var(--muted-foreground)] italic">
                                                No description provided.
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 mt-auto">
                                        {telegramUrl ? (
                                            <a
                                                href={telegramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 px-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2 text-center"
                                            >
                                                <span>Read on Telegram</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        ) : (
                                            <button
                                                disabled
                                                className="w-full py-2.5 px-4 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] font-semibold text-xs flex items-center justify-center gap-2 text-center cursor-not-allowed opacity-60"
                                            >
                                                <span>Link Unavailable</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {books && books.length > 0 && !searchQuery && (
                <div className="flex items-center justify-between pt-8 border-t border-[var(--border)]">
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">
                        Page {currentPage} of {totalPages}
                    </span>

                    <div className="flex items-center gap-2">
                        {currentPage > 1 ? (
                            <Link
                                href={`/books?page=${currentPage - 1}`}
                                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)] flex items-center gap-1 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold opacity-40 cursor-not-allowed flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </button>
                        )}

                        {currentPage < totalPages ? (
                            <Link
                                href={`/books?page=${currentPage + 1}`}
                                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)] flex items-center gap-1 transition-colors"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold opacity-40 cursor-not-allowed flex items-center gap-1"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}