"use client";

import { useState } from "react";
import {
    KeyRound,
    ShieldAlert,
    CheckCircle2,
    Lock,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || "Failed to change password.");
                return;
            }

            setMessage(
                data.message || "Password changed successfully."
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("CHANGE PASSWORD ERROR:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-6 p-6 lg:p-8 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xs transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5" />
                </div>

                <div>
                    <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                        Change Password
                    </h1>

                    <p className="text-xs text-[var(--muted-foreground)]">
                        Update your account password securely.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                {/* Current Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)]">
                        Current Password
                    </label>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
                            <Lock className="w-4 h-4" />
                        </span>

                        <input
                            type={showCurrent ? "text" : "password"}
                            name="currentPassword"
                            placeholder="••••••••"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrent(!showCurrent)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                            tabIndex={-1}
                        >
                            {showCurrent ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)]">
                        New Password
                    </label>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
                            <Lock className="w-4 h-4" />
                        </span>

                        <input
                            type={showNew ? "text" : "password"}
                            name="newPassword"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            minLength={8}
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                            tabIndex={-1}
                        >
                            {showNew ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)]">
                        Confirm New Password
                    </label>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted-foreground)]">
                            <Lock className="w-4 h-4" />
                        </span>

                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                            minLength={8}
                            className="w-full pl-10 pr-10 py-2.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirm(!showConfirm)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                            tabIndex={-1}
                        >
                            {showConfirm ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success */}
                {message && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-2.5 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-semibold text-sm shadow-xs hover:opacity-95 focus:outline-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Changing Password...</span>
                        </>
                    ) : (
                        <span>Change Password</span>
                    )}
                </button>
            </form>
        </div>
    );
}