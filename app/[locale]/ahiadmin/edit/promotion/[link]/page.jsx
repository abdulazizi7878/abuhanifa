"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditPromotions({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const link = resolvedParams?.link;

    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Form fields state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ownerLink, setOwnerLink] = useState("");

    async function GetPromotion() {
        if (!link) {
            setLoading(false);
            setError(true);
            setErrorMessage("Promotion link does not exist.");
            return;
        }

        setLoading(true);
        setError(false);
        setErrorMessage("");

        try {
            const response = await fetch("/api/showpromotion", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    link: link,
                })
            });
            const resData = await response.json();            
            
            if (resData.success && resData?.data?.length > 0) {
                const promoData = resData.data[0];
                setPromotion(promoData);
                setName(promoData?.name || "");
                setEmail(promoData?.email || "");
                setPhoneNumber(promoData?.phone_number || "");
                setTitle(promoData?.title || "");
                setDescription(promoData?.description || "");
                setOwnerLink(promoData?.owner_link || "");
            } else {
                setError(true);
                setErrorMessage("We couldn't get the Promotion");
                toast.error("We couldn't get the Promotion");
            }
        } catch (err) {
            console.error("error while fetching", err);
            setError(true);
            setErrorMessage("Unable to load promotion details.");
            toast.error("Unable to load promotion details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetPromotion();
    }, [link]);

    async function UpdatePromotion(e) {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Promotion name is required.");
            return;
        }

        if (!email.trim()) {
            toast.error("Promotion email is required.");
            return;
        }

        setUpdating(true);
        const toastId = toast.loading("Updating promotion...");

        try {
            const response = await fetch("/api/updatepromotion", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone_number: phoneNumber,
                    title: title.trim(),
                    description: description.trim(),
                    owner_link: ownerLink.trim(),
                    link: link,
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Promotion updated successfully", { id: toastId });
                router.push("/ahiadmin/view/promotions");
            } else {
                throw new Error(data.message || "Failed to update promotion.");
            }
        } catch (err) {
            console.error(err);
            toast.error("We couldn't update the Promotion", { id: toastId });
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
                        onClick={() => router.push("/ahiadmin/view/promotions")}
                        className="px-4 py-2 rounded-lg border text-sm font-medium transition en cursor-pointer flex items-center gap-2 hover:opacity-80"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                        ← Back to Promotions
                    </button>
                    <a
                        href="/ahiadmin/create/promotion"
                        className="px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer shadow-md"
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                    >
                        Create a new Promotion
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
                            {errorMessage || "Promotion does not exist."}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={GetPromotion}
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md border"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Try Again
                            </button>
                            <a
                                href="/ahiadmin/create/promotion"
                                className="px-5 py-2.5 rounded-lg font-medium text-sm transition en cursor-pointer shadow-md"
                                style={{ backgroundColor: 'var(--primary)', color: 'var(--foreground)' }}
                            >
                                Create a new Promotion
                            </a>
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {!loading && !error && (
                    <form 
                        onSubmit={UpdatePromotion} 
                        className="rounded-xl shadow-lg border p-6 sm:p-8 space-y-6 backdrop-blur-sm"
                        style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    >
                        <div className="pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                            <h1 className="text-2xl sm:text-3xl font-bold en" style={{ color: 'var(--foreground)' }}>
                                Edit Promotion
                            </h1>
                            <p className="text-xs opacity-70 mt-1 en">Promotion link: {link}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Promotion Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    title="Promotion Name"
                                    placeholder="Promotion Name"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Promotion Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    title="Promotion Email"
                                    placeholder="Promotion Email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    title="Promotion Phone Number"
                                    placeholder="Promotion Phone Number"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Promotion Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    title="Promotion Title"
                                    placeholder="Promotion Title"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Promotion Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    title="Description"
                                    placeholder="Promotion Description"
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm resize-y"
                                    style={{ borderColor: 'var(--border)' }}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 en" style={{ color: 'var(--foreground)' }}>
                                    Owner Link <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="ownerLink"
                                    value={ownerLink}
                                    onChange={(e) => setOwnerLink(e.target.value)}
                                    title="Promotion Owner Link"
                                    placeholder="Promotion owner link"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border text-sm en focus:outline-none focus:ring-2 bg-background text-foreground shadow-sm"
                                    style={{ borderColor: 'var(--border)' }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <button
                                type="button"
                                onClick={() => router.push("/ahiadmin/view/promotions")}
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
                                {updating ? "Updating..." : "Update Promotion"}
                            </button>
                        </div>
                    </form>
                )}
            </div>        
        </main>
    );
}