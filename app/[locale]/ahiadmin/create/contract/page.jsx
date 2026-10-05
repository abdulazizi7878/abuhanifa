"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ContractForm from "@/components/ContractForm";

export default function CreateContractPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (formData) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving contract draft...");

        try {
            const res = await fetch("/api/contracts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create contract");

            const responseData = await res.json();
            const createdContract = responseData.data;

            toast.success("Contract draft created successfully!", { id: toastId });
            router.push(`/ahiadmin/view/contracts/${createdContract.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create contract draft.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            <div className="pb-6 border-b border-[var(--border)]">
                <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                    Abuhanifa Installation ET
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1">Create New Contract</p>
            </div>

            <ContractForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
        </main>
    );
}