import React from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import BooksClient from './BooksClient';

async function getBooks(page = 1, limit = 12) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/public-books?page=${page}&limit=${limit}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

export default async function BooksPage({ searchParams }) {
    const currentPage = parseInt((await searchParams)?.page || '1', 10);
    const limit = 12;

    const response = await getBooks(currentPage, limit);

    const books = response?.books || response?.data || (Array.isArray(response) ? response : []);
    const totalPages = response?.totalPages || response?.pagination?.totalPages || (books.length >= limit ? currentPage + 1 : currentPage);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <BooksClient
                        books={books}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}