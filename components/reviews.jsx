"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "motion/react";

import {
    Star,
    Quote,
    MessageSquareQuote,
} from "lucide-react";

import { useTranslations } from "next-intl";

function Stars({ rating, size = 18 }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    strokeWidth={1.8}
                    className={
                        star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-[var(--border)]"
                    }
                />
            ))}
        </div>
    );
}

export default function Reviews() {
    const t = useTranslations("reviews");

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReviews() {
            try {
                setLoading(true);

                const response = await fetch(
                    "/api/public-reviews"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load reviews"
                    );
                }

                setReviews(data.reviews || []);
            } catch (error) {
                console.error(
                    "Failed to load reviews:",
                    error
                );

                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        loadReviews();
    }, []);

    const averageRating = useMemo(() => {
        if (!reviews.length) {
            return 0;
        }

        const total = reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );

        return total / reviews.length;
    }, [reviews]);

    if (loading) {
        return (
            <section className="w-full py-16 overflow-hidden">
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3].map((item) => (
                        <motion.div
                            key={item}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="shrink-0 w-80 rounded-4xl border border-[var(--border)]/50 p-6"
                        >
                            <div className="h-28 rounded-2xl bg-foreground/5 animate-pulse" />

                            <div className="mt-5 h-5 w-32 rounded-full bg-foreground/5 animate-pulse" />

                            <div className="mt-4 h-4 w-24 rounded-full bg-foreground/5 animate-pulse" />
                        </motion.div>
                    ))}
                </div>
            </section>
        );
    }

    if (!reviews.length) {
        return null;
    }

    return (
        <section className="w-full py-16">
            <div className="mx-auto max-w-7xl px-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[var(--primary)]">
                            <MessageSquareQuote
                                size={20}
                            />

                            <span className="text-sm font-semibold uppercase tracking-widest">
                                {t("customerReviews")}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold md:text-5xl">
                            {t("heading")}
                        </h2>

                        <p className="mt-3 max-w-xl text-foreground/60">
                            {t("description")}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-[var(--border)]/50 bg-foreground/5 px-6 py-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/15">
                            <Star
                                size={25}
                                className="fill-yellow-400 text-yellow-400"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                    {averageRating.toFixed(
                                        1
                                    )}
                                </span>

                                <span className="text-sm text-foreground/50">
                                    {t("outOf")}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Stars
                                    rating={Math.round(
                                        averageRating
                                    )}
                                    size={14}
                                />

                                <span className="text-xs text-foreground/50">
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? t("review")
                                        : t("reviews")}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review, index) => (
                        <motion.article
                            key={review.id}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.45,
                                delay: index * 0.08,
                            }}
                            whileHover={{
                                y: -6,
                            }}
                            className="group relative flex min-h-80 flex-col overflow-hidden rounded-4xl border border-[var(--border)]/50 bg-background p-6 transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div className="absolute right-5 top-5 opacity-10 transition-opacity duration-300 group-hover:opacity-20">
                                <Quote
                                    size={60}
                                    strokeWidth={1}
                                />
                            </div>

                            <div className="relative flex-1 rounded-3xl bg-foreground/5 p-5">
                                <p className="leading-7 text-foreground/80">
                                    “{review.review_text}”
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <Stars
                                    rating={Number(
                                        review.rating
                                    )}
                                />

                                <span className="font-mono text-sm font-semibold text-foreground/60">
                                    {Number(
                                        review.rating
                                    ).toFixed(1)}
                                </span>
                            </div>

                            <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)]/30 pt-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 font-bold text-[var(--primary)]">
                                    {review.reviewer_name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-semibold">
                                        {
                                            review.reviewer_name
                                        }
                                    </p>

                                    <p className="text-xs text-foreground/45">
                                        {t(
                                            "verifiedCustomer"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}