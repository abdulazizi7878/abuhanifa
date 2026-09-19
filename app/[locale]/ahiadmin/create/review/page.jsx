"use client";

import { useState, useEffect } from "react";
import {
    Copy,
    Check,
    Clock,
    Plus,
    Star,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    RefreshCw
} from "lucide-react";

const EXPIRATION_OPTIONS = [
    { label: "10 minutes", value: 10 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "5 hours", value: 300 },
    { label: "1 day", value: 1440 },
    { label: "2 days", value: 2880 },
    { label: "3 days", value: 4320 },
];

export default function AdminReviewsPage() {
    const [duration, setDuration] = useState(10);
    const [generating, setGenerating] = useState(false);
    const [createdSession, setCreatedSession] = useState(null);
    const [copied, setCopied] = useState(false);
    const [genError, setGenError] = useState("");

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [listError, setListError] = useState("");

    async function fetchSessions() {
        setLoadingSessions(true);
        setListError("");
        try {
            const res = await fetch("/api/reviews");
            const data = await res.json();
            if (res.ok && data.success) {
                // Accepts either data.data or data.sessions/data
                setSessions(data.data || data.sessions || []);
            } else {
                setListError(data.message || "Failed to load review sessions");
            }
        } catch (err) {
            setListError("Error connecting to server");
        } finally {
            setLoadingSessions(false);
        }
    }

    useEffect(() => {
        fetchSessions();
    }, []);

    async function handleGenerateLink(e) {
        e.preventDefault();
        setGenerating(true);
        setGenError("");
        setCreatedSession(null);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ duration_minutes: Number(duration) })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Fixed: reading from data.session or falling back to data.data
                const sessionObj = data.session || data.data || {};
                const token = sessionObj.token;
                const expiresAtRaw = sessionObj.expires_at;

                if (!token) {
                    throw new Error("Token not found in response");
                }

                const fullUrl = `${window.location.origin}/review/${token}`;
                setCreatedSession({
                    url: fullUrl,
                    expiresAt: expiresAtRaw ? new Date(expiresAtRaw).toLocaleString() : "N/A"
                });
                fetchSessions();
            } else {
                setGenError(data.message || "Failed to generate link");
            }
        } catch (err) {
            setGenError(err.message || "Network error occurred");
        } finally {
            setGenerating(false);
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function getSessionStatus(session) {
        const now = new Date();
        const expiresAt = new Date(session.expires_at);

        if (session.used_at !== null && session.used_at !== undefined) {
            return { label: "Used", style: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CheckCircle2 };
        }
        if (expiresAt <= now) {
            return { label: "Expired", style: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: XCircle };
        }
        return { label: "Active", style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: Clock };
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] pb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Review Link Generator</h1>
                        <p className="text-sm opacity-70 mt-1">Create single-use review links for customers and track active sessions.</p>
                    </div>
                    <button
                        onClick={fetchSessions}
                        disabled={loadingSessions}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition text-sm font-semibold self-start sm:self-auto cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 ${loadingSessions ? "animate-spin" : ""}`} />
                        <span>Refresh List</span>
                    </button>
                </div>

                {/* Section 1: Generate Link Generator Card */}
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--foreground)]/5 p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[var(--primary)]" />
                        <span>Generate New Review Link</span>
                    </h2>

                    <form onSubmit={handleGenerateLink} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:w-64 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                                Link Expiration Duration
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition font-medium"
                            >
                                {EXPIRATION_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={generating}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-md"
                        >
                            {generating ? "Generating..." : "Generate Review Link"}
                        </button>
                    </form>

                    {genError && (
                        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-medium">
                            {genError}
                        </div>
                    )}

                    {/* Output Area */}
                    {createdSession && (
                        <div className="p-5 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Generated Link Ready</span>
                                <span className="text-xs opacity-70 font-medium">Expires: {createdSession.expiresAt}</span>
                            </div>

                            <div className="flex items-center gap-2 bg-[var(--background)] p-2 pl-4 rounded-xl border border-[var(--border)]">
                                <input
                                    type="text"
                                    readOnly
                                    value={createdSession.url}
                                    className="w-full bg-transparent text-sm font-mono outline-none"
                                />
                                <button
                                    onClick={() => copyToClipboard(createdSession.url)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 transition shrink-0 cursor-pointer"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                                </button>
                            </div>

                            <p className="text-xs text-amber-500 font-semibold flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4" />
                                <span>Note: This link can only be used once to submit a review.</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Section 2: Review Sessions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Review Sessions</h2>

                    {listError && (
                        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
                            {listError}
                        </div>
                    )}

                    {loadingSessions ? (
                        <div className="p-12 text-center text-sm opacity-60 font-medium">Loading sessions...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-12 text-center border border-[var(--border)] rounded-3xl opacity-60 font-medium">
                            No review sessions generated yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-[var(--border)] rounded-3xl bg-[var(--background)]">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--border)] bg-[var(--foreground)]/5 text-xs font-bold uppercase tracking-wider opacity-70">
                                        <th className="p-4">Created Date</th>
                                        <th className="p-4">Expiration Date</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Reviewer</th>
                                        <th className="p-4">Rating</th>
                                        <th className="p-4">Review Content</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {sessions.map((session) => {
                                        const status = getSessionStatus(session);
                                        const StatusIcon = status.icon;

                                        return (
                                            <tr key={session.id || session.token} className="hover:bg-[var(--foreground)]/5 transition">
                                                <td className="p-4 whitespace-nowrap text-xs font-medium opacity-80">
                                                    {session.created_at ? new Date(session.created_at).toLocaleString() : "—"}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-xs font-medium opacity-80">
                                                    {session.expires_at ? new Date(session.expires_at).toLocaleString() : "—"}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.style}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-semibold whitespace-nowrap">
                                                    {session.reviewer_name || <span className="opacity-40 italic">Not submitted</span>}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    {session.rating ? (
                                                        <div className="flex items-center text-amber-400 font-bold">
                                                            <span>{session.rating}</span>
                                                            <Star className="w-4 h-4 fill-amber-400 ml-1" />
                                                        </div>
                                                    ) : (
                                                        <span className="opacity-40 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="p-4 max-w-xs truncate text-xs opacity-80" title={session.review_text}>
                                                    {session.review_text || <span className="opacity-40 italic">—</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}