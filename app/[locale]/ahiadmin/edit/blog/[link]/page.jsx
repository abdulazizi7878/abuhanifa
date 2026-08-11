"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditBlogs({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const link = resolvedParams?.link;

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Form fields state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function GetBlog() {
        if (!link) {
            setLoading(false);
            setError(true);
            setErrorMessage("Blog link does not exist.");
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMessage("");

        try {
            const response = await fetch("/api/showblog", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                })
            });
            const resData = await response.json();
            
            if (resData.success && resData?.data?.blog?.result?.length > 0) {
                const blogData = resData.data.blog.result[0];
                setBlog(blogData);
                setTitle(blogData?.title || "");
                setDescription(blogData?.description || "");
            } else {
                setError(true);
                setErrorMessage("We couldn't get the Blog");
                toast.error("We couldn't get the Blog");
            }
        } catch (err) {
            console.error("error while fetching", err);
            setError(true);
            setErrorMessage("Unable to load blog details.");
            toast.error("Unable to load blog details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetBlog();
    }, [link]);

    async function UpdateBlog(e) {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Blog title is required.");
            return;
        }

        setUpdating(true);
        const toastId = toast.loading("Updating blog...");

        try {
            const response = await fetch("/api/updateblog", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                    title: title.trim(),
                    description: description.trim()
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Blog updated successfully", { id: toastId });
                router.push("/ahiadmin/view/blogs");
            } else {
                throw new Error(data.message || "Failed to update blog.");
            }
        } catch (err) {
            console.error(err);
            toast.error("We couldn't update the Blog", { id: toastId });
        } finally {
            setUpdating(false);
        }
    }

    return (
        <main className="w-full flex flex-col justify-center items-center py-8 px-4">
            <div className="w-full max-w-4xl space-y-6">
                
                {/* Top Bar Navigation */}
                <div className="flex justify-between items-center mb-2">
                    <button
                        type="button"
                        onClick={() => router.push("/ahiadmin/view/blogs")}
                        className="px-4 py-2 rounded-lg border text-sm font-medium transition en cursor-pointer flex items-center gap-2 hover:opacity-80"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                        ← Back to Blogs
                    </button>
                    <a
                        href="/ahiadmin/create/blog"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-md"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                    >
                        Create a new Blog
                    </a>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <p className="text-sm font-medium opacity-80 en">loading</p>
                    </div>
                )}

                {/* Error State / Not Found Message */}
                {!loading && error && (
                    <div className="text-center py-20 p-6 rounded-xl border border-red-500/30 bg-red-500/10 space-y-4">
                        <p className="text-lg text-red-600 dark:text-red-400 font-medium en">
                            {errorMessage || "Blog does not exist."}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={GetBlog}
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md border"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Try Again
                            </button>
                            <a
                                href="/ahiadmin/create/blog"
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                Create a new Blog
                            </a>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {!loading && !error && (
                    <form 
                        onSubmit={UpdateBlog} 
                        className="rounded-xl shadow-lg border p-6 sm:p-8 space-y-6 backdrop-blur-sm"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    >
                        <div className="pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                            <h1 className="text-2xl sm:text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                Edit Blog
                            </h1>
                            <p className="text-xs opacity-70 mt-1 en">Blog link: {link}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Blog Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    title="Blog Title"
                                    placeholder="Blog Title"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Blog Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    title="Description"
                                    placeholder="Blog Description"
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm resize-y"
                                    style={{ borderColor: 'var(--border)' }}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <button
                                type="button"
                                onClick={() => router.push("/ahiadmin/view/blogs")}
                                disabled={updating}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer en disabled:opacity-50"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full sm:w-auto px-8 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer shadow-md en disabled:opacity-50"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                {updating ? "Updating..." : "Update Blog"}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </main>
    );
}