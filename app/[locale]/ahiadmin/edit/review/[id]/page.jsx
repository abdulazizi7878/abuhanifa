"use client";

import { useEffect, useState, use } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { supportedLanguages } from "@/config/supportedLanguages";

export default function EditReviewPage({ params }) {
    const router = useRouter();

    const resolvedParams = use(params);

    const id = resolvedParams?.id;

    const [review, setReview] = useState(null);

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    // Form state
    const [customerName, setCustomerName] =
        useState("");

    const [rating, setRating] = useState(5);

    const [translations, setTranslations] =
        useState({});

    const [isPublished, setIsPublished] =
        useState(true);

    // Fetch review
    async function GetReview() {
        if (!id) {
            setLoading(false);
            setError(true);
            setErrorMessage(
                "Review ID does not exist."
            );
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMessage("");

        try {
            const response = await fetch(
                `/api/reviews/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            const resData =
                await response.json();

            if (
                response.ok &&
                resData.success &&
                resData.data
            ) {
                const reviewData =
                    resData.data;

                setReview(reviewData);

                setCustomerName(
                    reviewData.customerName ||
                    ""
                );

                setRating(
                    reviewData.rating || 5
                );

                setIsPublished(
                    reviewData.isPublished ??
                    true
                );

                const translationData =
                    {};

                if (
                    Array.isArray(
                        reviewData.translations
                    )
                ) {
                    reviewData.translations.forEach(
                        (translation) => {
                            translationData[
                                translation.language
                            ] =
                                translation.text ||
                                "";
                        }
                    );
                }

                setTranslations(
                    translationData
                );
            } else {
                setError(true);

                setErrorMessage(
                    "We couldn't get the review."
                );

                toast.error(
                    "We couldn't get the review."
                );
            }
        } catch (err) {
            console.error(
                "Error while fetching review:",
                err
            );

            setError(true);

            setErrorMessage(
                "Unable to load review details."
            );

            toast.error(
                "Unable to load review details."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetReview();
    }, [id]);

    // Translation change
    const handleTranslationChange = (
        languageCode,
        value
    ) => {
        setTranslations((prev) => ({
            ...prev,
            [languageCode]: value,
        }));
    };

    // Update review
    async function UpdateReview(e) {
        e.preventDefault();

        if (!customerName.trim()) {
            toast.error(
                "Customer name is required."
            );
            return;
        }

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            toast.error(
                "Rating must be between 1 and 5."
            );
            return;
        }

        for (const language of supportedLanguages) {
            const text =
                translations[language.code];

            if (!text || !text.trim()) {
                toast.error(
                    `Review in ${language.name} is required.`
                );
                return;
            }
        }

        setUpdating(true);

        const toastId =
            toast.loading(
                "Updating review..."
            );

        try {
            const response = await fetch(
                `/api/reviews/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        customerName:
                            customerName.trim(),
                        rating,
                        translations,
                        isPublished,
                    }),
                }
            );

            const data =
                await response.json();

            if (response.ok && data.success) {
                toast.success(
                    "Review updated successfully",
                    {
                        id: toastId,
                    }
                );

                router.push(
                    "/ahiadmin/view/reviews"
                );
            } else {
                throw new Error(
                    data.message ||
                    "Failed to update review."
                );
            }
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "We couldn't update the review.",
                {
                    id: toastId,
                }
            );
        } finally {
            setUpdating(false);
        }
    }

    return (
        <main className="w-full flex flex-col justify-center items-center py-8 px-4">
            <div className="w-full max-w-4xl space-y-6">

                {/* Top Bar Navigation */}
                <div className="flex justify-between items-center mb-2 gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/ahiadmin/view/review"
                            )
                        }
                        className="px-4 py-2 rounded-lg border text-sm font-medium transition cursor-pointer flex items-center gap-2 hover:opacity-80"
                        style={{
                            borderColor:
                                "var(--border)",
                            color:
                                "var(--foreground)",
                        }}
                    >
                        ← Back to Reviews
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/ahiadmin/create/review"
                            )
                        }
                        className="px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-md"
                        style={{
                            backgroundColor:
                                "var(--primary)",
                            color:
                                "var(--foreground)",
                        }}
                    >
                        Create a new Review
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-sm font-medium opacity-80">
                            Loading review...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10 space-y-4">

                        <p className="text-lg text-red-600 dark:text-red-400 font-medium">
                            {errorMessage ||
                                "Review does not exist."}
                        </p>

                        <div className="flex justify-center gap-4">

                            <button
                                onClick={
                                    GetReview
                                }
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer shadow-md border"
                                style={{
                                    borderColor:
                                        "var(--border)",
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() =>
                                    router.push(
                                        "/ahiadmin/create/review"
                                    )
                                }
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer shadow-md"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Create a new Review
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {!loading && !error && (
                    <form
                        onSubmit={UpdateReview}
                        className="rounded-xl shadow-lg border p-6 sm:p-8 space-y-6 backdrop-blur-sm"
                        style={{
                            backgroundColor:
                                "var(--background)",
                            borderColor:
                                "var(--border)",
                        }}
                    >

                        {/* Header */}
                        <div
                            className="pb-4 border-b"
                            style={{
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <h1
                                className="text-2xl sm:text-3xl font-bold"
                                style={{
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Edit Review
                            </h1>

                            <p className="text-xs opacity-70 mt-1">
                                Review ID: {id}
                            </p>
                        </div>

                        {/* Customer Name */}
                        <div>
                            <label
                                htmlFor="customerName"
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Customer Name{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                id="customerName"
                                value={
                                    customerName
                                }
                                onChange={(e) =>
                                    setCustomerName(
                                        e.target.value
                                    )
                                }
                                placeholder="Customer Name"
                                required
                                disabled={
                                    updating
                                }
                                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm disabled:opacity-50"
                                style={{
                                    borderColor:
                                        "var(--border)",
                                }}
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Rating{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </label>

                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <button
                                            key={
                                                star
                                            }
                                            type="button"
                                            disabled={
                                                updating
                                            }
                                            onClick={() =>
                                                setRating(
                                                    star
                                                )
                                            }
                                            aria-label={`${star} star${star >
                                                    1
                                                    ? "s"
                                                    : ""
                                                }`}
                                            className="text-4xl leading-none transition-transform hover:scale-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

                                <span className="ml-2 text-sm font-semibold opacity-80">
                                    {rating}/5
                                </span>
                            </div>
                        </div>

                        {/* Translations */}
                        <div className="space-y-5">

                            <div
                                className="pb-3 border-b"
                                style={{
                                    borderColor:
                                        "var(--border)",
                                }}
                            >
                                <h2
                                    className="text-xl font-semibold"
                                    style={{
                                        color:
                                            "var(--foreground)",
                                    }}
                                >
                                    Review Text
                                </h2>

                                <p className="text-xs opacity-70 mt-1">
                                    Update the review
                                    in every
                                    supported
                                    language.
                                </p>
                            </div>

                            {supportedLanguages.map(
                                (language) => (
                                    <div
                                        key={
                                            language.code
                                        }
                                    >
                                        <label
                                            htmlFor={`review-${language.code}`}
                                            className="block text-sm font-medium mb-2"
                                            style={{
                                                color:
                                                    "var(--foreground)",
                                            }}
                                        >
                                            {
                                                language.name
                                            }{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <textarea
                                            id={`review-${language.code}`}
                                            value={
                                                translations[
                                                language
                                                    .code
                                                ] ||
                                                ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleTranslationChange(
                                                    language.code,
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder={`Review in ${language.name}`}
                                            required
                                            disabled={
                                                updating
                                            }
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm resize-y disabled:opacity-50"
                                            style={{
                                                borderColor:
                                                    "var(--border)",
                                            }}
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        {/* Publish */}
                        <div
                            className="pt-4 border-t"
                            style={{
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <label
                                className="flex items-center gap-3 cursor-pointer"
                                style={{
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={
                                        isPublished
                                    }
                                    onChange={(e) =>
                                        setIsPublished(
                                            e.target
                                                .checked
                                        )
                                    }
                                    disabled={
                                        updating
                                    }
                                    className="h-4 w-4 accent-[var(--primary)]"
                                />

                                <span className="text-sm font-medium">
                                    Publish this
                                    review
                                </span>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div
                            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t"
                            style={{
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    router.push(
                                        "/ahiadmin/view/review"
                                    )
                                }
                                disabled={
                                    updating
                                }
                                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer disabled:opacity-50"
                                style={{
                                    borderColor:
                                        "var(--border)",
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    updating
                                }
                                className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-md disabled:opacity-50"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                {updating
                                    ? "Updating..."
                                    : "Update Review"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}