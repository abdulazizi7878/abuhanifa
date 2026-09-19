"use client";

import { useState, useEffect, use } from "react";
import { Star, CheckCircle2, AlertCircle, Clock, ShieldX, Loader2 } from "lucide-react";

export default function CustomerReviewPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const token = params.token;

    const [loading, setLoading] = useState(true);
    const [invalidState, setInvalidState] = useState(null); // 'NOT_FOUND' | 'USED' | 'EXPIRED'

    const [reviewerName, setReviewerName] = useState("");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        async function validateToken() {
            setLoading(true);
            setSubmitError("");
            try {
                const res = await fetch(`/api/reviews/${token}`);

                if (res.status === 404) {
                    setInvalidState("NOT_FOUND");
                } else if (res.status === 410) {
                    const data = await res.json().catch(() => ({}));
                    const reason = data.reason?.toUpperCase() || "";
                    const message = data.message?.toLowerCase() || "";

                    if (reason === "EXPIRED" || message.includes("expire")) {
                        setInvalidState("EXPIRED");
                    } else {
                        setInvalidState("USED");
                    }
                } else if (!res.ok) {
                    setInvalidState("NOT_FOUND");
                }
            } catch (err) {
                setSubmitError("Unable to connect. Please check your network and try again.");
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            validateToken();
        }
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting || rating < 1) return;

        setSubmitting(true);
        setSubmitError("");

        try {
            const res = await fetch(`/api/reviews/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reviewer_name: reviewerName.trim(),
                    rating: Number(rating),
                    review_text: reviewText.trim()
                })
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && (data.success || res.status === 200 || res.status === 201)) {
                setSubmitted(true);
            } else {
                if (res.status === 410) {
                    const reason = data.reason?.toUpperCase() || "";
                    const message = data.message?.toLowerCase() || "";
                    if (reason === "EXPIRED" || message.includes("expire")) {
                        setInvalidState("EXPIRED");
                    } else {
                        setInvalidState("USED");
                    }
                } else if (res.status === 404) {
                    setInvalidState("NOT_FOUND");
                } else {
                    setSubmitError(data.message || "Failed to submit review. Please try again.");
                }
            }
        } catch (err) {
            setSubmitError("Network error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-3 text-sm font-medium opacity-70">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
                    <span>Verifying review invitation...</span>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-xl p-6 sm:p-8 space-y-6">

                {/* Branding */}
                <div className="text-center space-y-2 border-b border-[var(--border)] pb-5">
                    <h1 className="text-2xl font-black tracking-tight">Abuhanifa installation ethiopia</h1>
                    <p className="text-xs uppercase tracking-wider opacity-60 font-semibold">Customer Feedback</p>
                </div>

                {/* 404 - Invalid Link */}
                {invalidState === "NOT_FOUND" && (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
                            <ShieldX className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-bold text-rose-500">Link Not Valid</h2>
                            <p className="text-sm opacity-80 leading-relaxed">
                                This review link is not valid.
                            </p>
                            <p className="text-xs opacity-60 pt-2">
                                Please contact Abuhanifa installation ethiopia if you believe you received this link by mistake.
                            </p>
                        </div>
                    </div>
                )}

                {/* 410 - Used Link */}
                {invalidState === "USED" && (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-bold">Link Already Used</h2>
                            <p className="text-sm opacity-80 leading-relaxed">
                                This review link has already been used.
                            </p>
                            <p className="text-xs font-semibold text-[var(--primary)] pt-1">
                                Thank you for your feedback.
                            </p>
                        </div>
                    </div>
                )}

                {/* 410 - Expired Link */}
                {invalidState === "EXPIRED" && (
                    <div className="py-6 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-bold text-amber-500">Link Expired</h2>
                            <p className="text-sm opacity-80 leading-relaxed">
                                This review link has expired.
                            </p>
                            <p className="text-xs opacity-60 pt-2">
                                Please contact Abuhanifa installation ethiopia if you still need to submit your review.
                            </p>
                        </div>
                    </div>
                )}

                {/* Submitted State */}
                {submitted && (
                    <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black">Thank You!</h2>
                            <p className="text-sm opacity-80 leading-relaxed">
                                Your feedback has been submitted successfully.
                            </p>
                        </div>
                    </div>
                )}

                {/* Active Form */}
                {!invalidState && !submitted && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center">
                            <p className="text-sm font-medium opacity-80">
                                How was your experience with our installation service?
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="reviewer_name" className="text-xs font-bold uppercase tracking-wider opacity-80">
                                Your Name
                            </label>
                            <input
                                id="reviewer_name"
                                type="text"
                                required
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-1.5 text-center">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-80 block">
                                Overall Rating
                            </label>
                            <div className="flex items-center justify-center gap-1.5 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = star <= (hoverRating || rating);
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1.5 cursor-pointer transition-transform active:scale-95 hover:scale-110 focus:outline-none touch-manipulation"
                                            aria-label={`Rate ${star} out of 5 stars`}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${isFilled
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-[var(--foreground)] opacity-20"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="review_text" className="text-xs font-bold uppercase tracking-wider opacity-80">
                                Review Feedback
                            </label>
                            <textarea
                                id="review_text"
                                required
                                rows={4}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us what you liked or how we can improve..."
                                className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition font-medium text-sm resize-none"
                            />
                        </div>

                        {submitError && (
                            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 rounded-2xl bg-[var(--primary)] text-white font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-lg flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit Review</span>
                            )}
                        </button>
                    </form>
                )}

            </div>
        </main>
    );
}