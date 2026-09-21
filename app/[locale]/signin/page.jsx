"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";

export default function Signin() {
    return (
        <>
            <Header />

            <main className="flex flex-col justify-center items-center py-14  min-h-[70vh] px-4">
                <Sss />
            </main>

            <Footer />
        </>
    );
}

function Sss() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function LogIn(event) {
        event.preventDefault();

        if (loading) return;

        if (!username.trim() || !password) {
            alert("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                }),
            });

            const responseData = await response.json();

            if (responseData.success === true) {
                window.location.href = "/ahiadmin";
                return;
            }

            alert(responseData.message || "INVALID CREDENTIALS!");
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            alert("SERVER ERROR!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md bg-[var(--background)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Subtle Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]" />

            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
                    Welcome Back!
                </h1>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/60 mt-1">
                    Please enter your credentials to access your account.
                </p>
            </div>

            <form onSubmit={LogIn} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="username"
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70 px-1"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        placeholder="Enter your username"
                        title="Username"
                        disabled={loading}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="password"
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70 px-1"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password webauthn"
                        placeholder="Enter your password"
                        title="Password"
                        disabled={loading}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all duration-200 disabled:opacity-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-[var(--primary)] text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {loading && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>{loading ? "Logging in..." : "Login"}</span>
                </button>
            </form>
        </div>
    );
}