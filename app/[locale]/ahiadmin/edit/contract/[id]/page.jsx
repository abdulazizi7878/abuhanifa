"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ContractForm from "@/components/ContractForm";

export default function EditContractPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const contractId = params.id;
    const router = useRouter();

    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const res = await fetch(`/api/contracts/${contractId}`);
                if (!res.ok) throw new Error("Failed to load contract");
                const resData = await res.json();
                setContract(resData.data);
            } catch (err) {
                console.error(err);
                toast.error("Unable to load contract details");
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [contractId]);

    const handleUpdate = async (formData) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving contract changes...");

        try {
            const res = await fetch(`/api/contracts/${contractId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update contract");

            toast.success("Contract updated successfully!", { id: toastId });
            router.push(`/ahiadmin/view/contracts/${contractId}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update contract.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                <p className="text-sm font-medium opacity-80">Loading contract details...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="text-center py-20 p-10 rounded-2xl border border-dashed border-[var(--border)] max-w-md mx-auto">
                <h3 className="text-base font-bold text-rose-500">Contract Not Found</h3>
                <p className="text-xs opacity-75 mt-2">The requested contract could not be loaded.</p>
            </div>
        );
    }

    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] space-y-6">
            <div className="pb-6 border-b border-[var(--border)]">
                <h1 className="text-xl font-bold tracking-tight text-[var(--secondary)]">
                    Abuhanifa Installation ET
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                    Edit Contract #{contract.id}
                </p>
            </div>

            <ContractForm initialData={contract} onSubmit={handleUpdate} isSubmitting={isSubmitting} />
        </main>
    );
}