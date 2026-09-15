"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supportedLanguages } from "@/config/supportedLanguages";

export default function CreateReviewPage() {
    const router = useRouter();

    const [customerName, setCustomerName] = useState("");
    const [rating, setRating] = useState(5);
    const [translations, setTranslations] = useState({});
    const [isPublished, setIsPublished] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTranslationChange = (
        languageCode,
        value
    ) => {
        setTranslations((prev) => ({
            ...prev,
            [languageCode]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/reviews",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        customerName,
                        rating,
                        translations,
                        isPublished,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to create review"
                );
            }

            router.push(
                "/ahiadmin/view/reviews"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--foreground)]">
                        Create Customer Review
                    </h1>

                    <p className="mt-2 text-sm text-[var(--foreground)] opacity-70">
                        Enter the customer's review
                        exactly as provided, then add
                        the translated versions.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Customer Name */}
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                        <label
                            htmlFor="customerName"
                            className="mb-2 block font-semibold text-[var(--foreground)]"
                        >
                            Customer Name
                        </label>

                        <input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) =>
                                setCustomerName(
                                    e.target.value
                                )
                            }
                            placeholder="Enter customer name"
                            required
                            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Rating */}
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                        <div className="mb-3">
                            <h2 className="text-xl font-semibold text-[var(--foreground)]">
                                Rating
                            </h2>

                            <p className="mt-1 text-sm text-[var(--foreground)] opacity-60">
                                Select the customer's
                                rating out of 5.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setRating(
                                                star
                                            )
                                        }
                                        aria-label={`${star} star${star > 1
                                                ? "s"
                                                : ""
                                            }`}
                                        className="text-4xl leading-none transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <span
                                            className={
                                                star <=
                                                    rating
                                                    ? "text-yellow-400"
                                                    : "text-[var(--foreground)] opacity-25"
                                            }
                                        >
                                            ★
                                        </span>
                                    </button>
                                )
                            )}

                            <span className="ml-2 text-lg font-semibold text-[var(--foreground)]">
                                {rating}/5
                            </span>
                        </div>
                    </div>

                    {/* Translations */}
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-[var(--foreground)]">
                                Review Text
                            </h2>

                            <p className="mt-1 text-sm text-[var(--foreground)] opacity-60">
                                Enter the review for
                                every supported
                                language.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {supportedLanguages.map(
                                (language) => (
                                    <div
                                        key={
                                            language.code
                                        }
                                    >
                                        <label
                                            htmlFor={`review-${language.code}`}
                                            className="mb-2 block font-semibold text-[var(--foreground)]"
                                        >
                                            {
                                                language.name
                                            }
                                        </label>

                                        <textarea
                                            id={`review-${language.code}`}
                                            value={
                                                translations[
                                                language
                                                    .code
                                                ] || ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleTranslationChange(
                                                    language.code,
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder={`Enter review in ${language.name}`}
                                            required
                                            rows={5}
                                            className="w-full resize-y rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Publish */}
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                        <label className="flex cursor-pointer items-center gap-3 text-[var(--foreground)]">
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) =>
                                    setIsPublished(
                                        e.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 accent-[var(--primary)]"
                            />

                            <span className="font-semibold">
                                Publish this review
                            </span>
                        </label>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Review"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}