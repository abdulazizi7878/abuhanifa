"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";

const SECTIONS = [
    { keySuffix: "1", label: "Section 1" },
    { keySuffix: "2", label: "Section 2" },
    { keySuffix: "3", label: "Section 3" },
    { keySuffix: "4", label: "Section 4" },
    { keySuffix: "5", label: "Section 5" },
    { keySuffix: "6", label: "Section 6" },
    { keySuffix: "7", label: "Section 7" },
    { keySuffix: "71", label: "Section 7.1" },
    { keySuffix: "72", label: "Section 7.2" },
];

export default function ContractForm({ initialData = {}, onSubmit, isSubmitting, title = "Contract Form" }) {
    const [formData, setFormData] = useState({
        customerName: initialData.customerName || "",
        customerPhone: initialData.customerPhone || "",
        customerAddress: initialData.customerAddress || "",
        contractDate: initialData.contractDate ? initialData.contractDate.split("T")[0] : new Date().toISOString().split("T")[0],
        mainTitle: initialData.mainTitle || "",

        subtitle1: initialData.subtitle1 || "",
        content1: initialData.content1 || "",
        subtitle2: initialData.subtitle2 || "",
        content2: initialData.content2 || "",
        subtitle3: initialData.subtitle3 || "",
        content3: initialData.content3 || "",
        subtitle4: initialData.subtitle4 || "",
        content4: initialData.content4 || "",
        subtitle5: initialData.subtitle5 || "",
        content5: initialData.content5 || "",
        subtitle6: initialData.subtitle6 || "",
        content6: initialData.content6 || "",
        subtitle7: initialData.subtitle7 || "",
        content7: initialData.content7 || "",
        subtitle71: initialData.subtitle71 || "",
        content71: initialData.content71 || "",
        subtitle72: initialData.subtitle72 || "",
        content72: initialData.content72 || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            {/* Customer Information Block */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[var(--secondary)] border-b border-[var(--border)] pb-2">
                    Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                            Customer Name *
                        </label>
                        <input
                            type="text"
                            name="customerName"
                            required
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="e.g. Abebe Bikila"
                            className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                            Customer Phone
                        </label>
                        <input
                            type="text"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="e.g. 0911223344"
                            className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                            Customer Address
                        </label>
                        <input
                            type="text"
                            name="customerAddress"
                            value={formData.customerAddress}
                            onChange={handleChange}
                            placeholder="e.g. Addis Ababa, Bole"
                            className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Contract Information Block */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[var(--secondary)] border-b border-[var(--border)] pb-2">
                    Contract Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                            Contract Date *
                        </label>
                        <input
                            type="date"
                            name="contractDate"
                            required
                            value={formData.contractDate}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                            Main Contract Title *
                        </label>
                        <input
                            type="text"
                            name="mainTitle"
                            required
                            value={formData.mainTitle}
                            onChange={handleChange}
                            placeholder="e.g. Installation & Equipment Supply Agreement"
                            className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none font-semibold"
                        />
                    </div>
                </div>
            </div>

            {/* Clauses & Sections */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">Contract Sections & Clauses</h3>
                {SECTIONS.map((sec) => {
                    const subKey = `subtitle${sec.keySuffix}`;
                    const conKey = `content${sec.keySuffix}`;

                    return (
                        <div
                            key={sec.keySuffix}
                            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs space-y-4"
                        >
                            <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--muted)] border border-[var(--border)] text-[var(--secondary)]">
                                {sec.label}
                            </span>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                    Subtitle ({sec.label})
                                </label>
                                <input
                                    type="text"
                                    name={subKey}
                                    value={formData[subKey]}
                                    onChange={handleChange}
                                    placeholder={`Subtitle for ${sec.label}`}
                                    className="w-full px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                    Content ({sec.label})
                                </label>
                                <textarea
                                    name={conKey}
                                    rows={4}
                                    value={formData[conKey]}
                                    onChange={handleChange}
                                    placeholder={`Detailed terms and clause content for ${sec.label}...`}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none leading-relaxed"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form Bottom Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--border)] sticky bottom-4 bg-[var(--background)]/90 backdrop-blur-md p-4 rounded-xl border">
                <Link
                    href="/ahiadmin/view/contracts"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:bg-[var(--muted)] transition"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Contract</span>
                </button>
            </div>
        </form>
    );
}