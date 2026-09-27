import React from 'react';

export default function AdminLoading() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            {/* Top Header Placeholder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
                <div className="space-y-2">
                    {/* Page Title Skeleton */}
                    <div className="h-8 w-48 bg-[var(--muted)]/60 rounded-lg" />
                    {/* Subtitle / Description Skeleton */}
                    <div className="h-4 w-72 bg-[var(--muted)]/40 rounded-md" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-28 bg-[var(--muted)]/50 rounded-xl" />
                    <div className="h-10 w-32 bg-[var(--primary)]/30 rounded-xl" />
                </div>
            </div>

            {/* Quick Metrics / Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-24 bg-[var(--muted)]/50 rounded-md" />
                            <div className="w-9 h-9 rounded-xl bg-[var(--muted)]/60" />
                        </div>
                        <div className="h-7 w-20 bg-[var(--muted)]/70 rounded-lg" />
                        <div className="h-3 w-32 bg-[var(--muted)]/30 rounded-md" />
                    </div>
                ))}
            </div>

            {/* Main Content / Table / Cards Area Skeleton */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                {/* Toolbar Header Skeleton */}
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
                    <div className="h-10 w-64 bg-[var(--muted)]/40 rounded-xl" />
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-24 bg-[var(--muted)]/40 rounded-xl" />
                        <div className="h-10 w-24 bg-[var(--muted)]/40 rounded-xl" />
                    </div>
                </div>

                {/* Rows Skeleton */}
                <div className="divide-y divide-[var(--border)]">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--muted)]/60 shrink-0" />
                                <div className="space-y-1.5">
                                    <div className="h-4 w-40 bg-[var(--muted)]/60 rounded-md" />
                                    <div className="h-3 w-28 bg-[var(--muted)]/30 rounded-md" />
                                </div>
                            </div>
                            <div className="hidden sm:block h-4 w-24 bg-[var(--muted)]/40 rounded-md" />
                            <div className="h-6 w-16 bg-[var(--muted)]/50 rounded-full" />
                            <div className="h-8 w-8 bg-[var(--muted)]/40 rounded-lg shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}