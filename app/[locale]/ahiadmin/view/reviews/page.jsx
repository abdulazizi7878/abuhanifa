"use client";

import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
    MoreVertical,
    Edit,
    Trash2,
    Plus,
    Search,
    MessageSquareQuote,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

export default function ViewReviews() {
    const router = useRouter();

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [activeDropdownId, setActiveDropdownId] =
        useState(null);

    const [reviewToDelete, setReviewToDelete] =
        useState(null);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const dropdownRefs = useRef({});

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdownId !== null) {
                const currentRef =
                    dropdownRefs.current[
                    activeDropdownId
                    ];

                if (
                    currentRef &&
                    !currentRef.contains(
                        event.target
                    )
                ) {
                    setActiveDropdownId(null);
                }
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [activeDropdownId]);

    // Fetch reviews
    const fetchReviews = async () => {
        setLoading(true);
        setError(false);

        try {
            const response = await fetch(
                "/api/reviews",
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch reviews."
                );
            }

            const data =
                await response.json();

            setReviews(
                data?.data || []
            );
        } catch (err) {
            console.error(err);

            setError(true);

            toast.error(
                "Unable to load reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Search
    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const query =
                searchQuery.toLowerCase();

            const customerName = (
                review.customerName || ""
            ).toLowerCase();

            return (
                !searchQuery ||
                customerName.includes(query)
            );
        });
    }, [reviews, searchQuery]);

    // Edit
    const handleEdit = (id) => {
        setActiveDropdownId(null);

        router.push(
            `/ahiadmin/edit/review/${id}`
        );
    };

    // Delete modal
    const openDeleteModal = (review) => {
        setActiveDropdownId(null);

        setReviewToDelete(review);
    };

    const closeDeleteModal = () => {
        if (!isDeleting) {
            setReviewToDelete(null);
        }
    };

    // Delete review
    const confirmDelete = async () => {
        if (!reviewToDelete) {
            return;
        }

        setIsDeleting(true);

        const toastId =
            toast.loading(
                "Deleting review..."
            );

        try {
            const response =
                await fetch(
                    `/api/reviews/${reviewToDelete.id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete review."
                );
            }

            setReviews((prev) =>
                prev.filter(
                    (item) =>
                        item.id !==
                        reviewToDelete.id
                )
            );

            toast.success(
                "Review deleted successfully",
                {
                    id: toastId,
                }
            );

            setReviewToDelete(null);
        } catch (err) {
            console.error(err);

            toast.error(
                err.message ||
                "Failed to delete review. Please try again.",
                {
                    id: toastId,
                }
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 bg-[var(--background)] text-[var(--foreground)] transition-colors">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[var(--border)] pb-6">

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                        All Reviews
                    </h1>

                    <p className="text-sm opacity-80 mt-1.5">
                        View and manage customer
                        reviews across your
                        platform.
                    </p>
                </div>

                <button
                    onClick={() =>
                        router.push(
                            "/ahiadmin/create/review"
                        )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-95 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                    <Plus className="w-4 h-4" />

                    Add Review
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--background)] border border-[var(--border)] p-4 rounded-2xl shadow-xs">

                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />

                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-all"
                    />
                </div>

                <div className="text-xs opacity-80 font-medium">
                    Showing{" "}
                    <span className="font-bold">
                        {
                            filteredReviews.length
                        }
                    </span>{" "}
                    of {reviews.length} entries
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-20 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto opacity-60 mb-3" />

                    <p className="text-sm opacity-80">
                        Loading reviews...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-center py-16 p-6 rounded-2xl border border-red-500/30 bg-red-500/10">

                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />

                    <p className="text-base font-semibold text-red-500 mb-4">
                        Unable to load reviews.
                    </p>

                    <button
                        onClick={
                            fetchReviews
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium transition-all shadow-md cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4" />

                        Try Again
                    </button>
                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                filteredReviews.length === 0 && (
                    <div className="text-center py-20 p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]">

                        <MessageSquareQuote className="w-10 h-10 mx-auto opacity-60 mb-3" />

                        <h3 className="text-base font-bold mb-1">
                            No reviews found
                        </h3>

                        <p className="text-xs opacity-80 mb-6">
                            {reviews.length ===
                                0
                                ? "Add your first customer review to get started."
                                : "No reviews match your search criteria."}
                        </p>

                        {reviews.length ===
                            0 && (
                                <button
                                    onClick={() =>
                                        router.push(
                                            "/ahiadmin/create/review"
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium transition-all shadow-md cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />

                                    Add Review
                                </button>
                            )}
                    </div>
                )}

            {/* Reviews Table */}
            {!loading &&
                !error &&
                filteredReviews.length >
                0 && (
                    <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-xs overflow-visible">

                        <div className="overflow-x-auto overflow-y-visible">

                            <table className="w-full text-left border-collapse">

                                <thead>
                                    <tr className="border-b border-[var(--border)] bg-[var(--border)]/10">

                                        <th className="py-3.5 px-6 font-bold text-xs uppercase tracking-wider opacity-80">
                                            Customer
                                        </th>

                                        <th className="py-3.5 px-6 font-bold text-xs uppercase tracking-wider opacity-80">
                                            Rating
                                        </th>

                                        <th className="py-3.5 px-6 font-bold text-xs uppercase tracking-wider opacity-80">
                                            Status
                                        </th>

                                        <th className="py-3.5 px-6 font-bold text-xs uppercase tracking-wider opacity-80">
                                            Created
                                        </th>

                                        <th className="py-3.5 px-6 font-bold text-xs uppercase tracking-wider text-right opacity-80">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[var(--border)]">

                                    {filteredReviews.map(
                                        (review) => (
                                            <tr
                                                key={
                                                    review.id
                                                }
                                                className="transition hover:bg-[var(--border)]/10"
                                            >

                                                {/* Customer */}
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-sm text-[var(--foreground)]">
                                                        {
                                                            review.customerName
                                                        }
                                                    </div>
                                                </td>

                                                {/* Rating */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map(
                                                            (
                                                                star
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        star
                                                                    }
                                                                    className={
                                                                        star <=
                                                                            review.rating
                                                                            ? "text-yellow-400 text-lg"
                                                                            : "text-[var(--foreground)] opacity-20 text-lg"
                                                                    }
                                                                >
                                                                    ★
                                                                </span>
                                                            )
                                                        )}

                                                        <span className="ml-1 text-xs opacity-70">
                                                            (
                                                            {
                                                                review.rating
                                                            }
                                                            /5)
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${review.isPublished
                                                                ? "bg-green-500/10 text-green-600"
                                                                : "bg-gray-500/10 text-gray-500"
                                                            }`}
                                                    >
                                                        {review.isPublished
                                                            ? "Published"
                                                            : "Draft"}
                                                    </span>
                                                </td>

                                                {/* Created */}
                                                <td className="py-4 px-6 text-xs opacity-80 whitespace-nowrap">
                                                    {review.createdAt
                                                        ? new Date(
                                                            review.createdAt
                                                        ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right relative">

                                                    <div
                                                        className="inline-block text-left"
                                                        ref={(el) =>
                                                        (dropdownRefs.current[
                                                            review.id
                                                        ] =
                                                            el)
                                                        }
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                setActiveDropdownId(
                                                                    activeDropdownId ===
                                                                        review.id
                                                                        ? null
                                                                        : review.id
                                                                )
                                                            }
                                                            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-xs"
                                                            aria-label="Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>

                                                        {activeDropdownId ===
                                                            review.id && (
                                                                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-2xl z-50 py-1.5 overflow-hidden">

                                                                    <button
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                review.id
                                                                            )
                                                                        }
                                                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--border)]/20 transition-colors text-left cursor-pointer"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5 text-[var(--primary)]" />

                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                review
                                                                            )
                                                                        }
                                                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />

                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            {/* Delete Modal */}
            {reviewToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={
                        closeDeleteModal
                    }
                >
                    <div
                        className="w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] space-y-4"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="flex items-center gap-3">

                            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                                <Trash2 className="w-6 h-6" />
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-[var(--foreground)]">
                                    Delete Customer
                                    Review
                                </h3>

                                <p className="text-xs opacity-80">
                                    This action
                                    cannot be
                                    undone.
                                </p>
                            </div>
                        </div>

                        {/* Selected Review */}
                        <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--border)]/10 space-y-2">

                            <div className="font-semibold text-xs text-[var(--foreground)] truncate">
                                {
                                    reviewToDelete.customerName
                                }
                            </div>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <span
                                            key={star}
                                            className={
                                                star <=
                                                    reviewToDelete.rating
                                                    ? "text-yellow-400"
                                                    : "text-[var(--foreground)] opacity-20"
                                            }
                                        >
                                            ★
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Modal Buttons */}
                        <div className="flex justify-end gap-2.5 pt-2">

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    isDeleting
                                }
                                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--border)]/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDelete
                                }
                                disabled={
                                    isDeleting
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer shadow-md disabled:opacity-50"
                            >
                                {isDeleting && (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                )}

                                {isDeleting
                                    ? "Deleting..."
                                    : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}