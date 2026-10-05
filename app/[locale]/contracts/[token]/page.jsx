"use client";

import React, { useState, useEffect } from "react";
import { Printer, Loader2, FileX } from "lucide-react";

const SECTION_KEYS = [
    { sub: "subtitle1", con: "content1", num: "1" },
    { sub: "subtitle2", con: "content2", num: "2" },
    { sub: "subtitle3", con: "content3", num: "3" },
    { sub: "subtitle4", con: "content4", num: "4" },
    { sub: "subtitle5", con: "content5", num: "5" },
    { sub: "subtitle6", con: "content6", num: "6" },
    { sub: "subtitle7", con: "content7", num: "7" },
    { sub: "subtitle71", con: "content71", num: "7.1" },
    { sub: "subtitle72", con: "content72", num: "7.2" },
];

export default function PublicContractPdfPage({ params: paramsPromise }) {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPublicContract = async () => {
            try {
                const resolvedParams = await paramsPromise;
                const token = resolvedParams?.token;

                if (!token) {
                    if (isMounted) {
                        setError("ትክክለኛ ያልሆነ ወይም የተሰረዘ የውል ሊንክ ነው።");
                        setLoading(false);
                    }
                    return;
                }

                const res = await fetch(`/api/public-contracts/${token}`);
                if (!res.ok) throw new Error("Contract not found or link expired");

                const resData = await res.json();
                if (isMounted) {
                    setContract(resData.data);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError("ውሉን መጫን አልተቻለም። ሊንኩ ጊዜው አልፎበት ወይም የተሳሳተ ሊሆን ይችላል።");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPublicContract();

        return () => {
            isMounted = false;
        };
    }, [paramsPromise]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3 p-4 text-slate-800">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm font-semibold">የህጋዊ ውል ሰነዱ በመጫን ላይ ነው...</p>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center max-w-md w-full space-y-4">
                    <FileX className="w-12 h-12 text-rose-500 mx-auto" />
                    <h2 className="text-lg font-bold text-slate-900">ውሉ አልተገኘም</h2>
                    <p className="text-xs text-slate-600">{error || "የውል ሰነዱን ማግኘት አልተቻለም።"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-slate-900">
            {/* Action Bar */}
            <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Abu Hanifa Installation ET</h1>
                    <p className="text-xs text-slate-500">የህጋዊ ሰነዶች ፖርታል</p>
                </div>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-md cursor-pointer"
                >
                    <Printer className="w-4 h-4" />
                    Print / Download PDF
                </button>
            </div>

            {/* Document Paper View Container */}
            <main className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xl space-y-8 font-sans print:shadow-none print:border-none print:p-0">
                {/* 1. BRANDING & HEADER */}
                <header className="border-b-2 border-slate-900 pb-4">
                    <div className="flex justify-between items-center gap-4">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                            <img
                                src="/images/logo.jpg"
                                alt="Abuhanifa Installation Ethiopia Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="text-center flex-1">
                            <h1 className="text-lg sm:text-md font-extrabold text-slate-900 uppercase tracking-wide">
                                Abuhanifa Installation Ethiopia
                            </h1>
                            <h2 className="text-base sm:text-xl font-bold text-slate-800 mt-0.5">
                                አቡሐኒፋ ኢንስታሌሽን ኢትዮጲያ
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 font-semibold italic mt-1">
                                አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ – ለላቀ ጥራትና ታማኝነት ሁሌም ከፊት
                            </p>
                        </div>

                        <div className="w-20 sm:w-24 shrink-0 hidden sm:block"></div>
                    </div>

                    {/* Touch / Clickable Header Contacts */}
                    <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
                        <div>
                            <span className="font-bold">ስልክ:</span>{" "}
                            <a href="tel:+251936489696" className="text-blue-600 hover:underline">
                                +251936489696
                            </a>{" "}
                            /{" "}
                            <a href="tel:+251705489696" className="text-blue-600 hover:underline">
                                +251705489696
                            </a>
                        </div>
                        <div>
                            <span className="font-bold">ቴሌግራም:</span>{" "}
                            <a
                                href="https://t.me/abuhanifainstallation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                t.me/abuhanifainstallation
                            </a>
                        </div>
                        <div>
                            <span className="font-bold">ኢሜይል:</span>{" "}
                            <a
                                href="mailto:abohanifainstallation@gmail.com"
                                className="text-blue-600 hover:underline"
                            >
                                abohanifainstallation@gmail.com
                            </a>
                        </div>
                        <div>
                            <span className="font-bold">ዌብሳይት:</span>{" "}
                            <a
                                href="https://www.abuhanifainstallation.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                www.abuhanifainstallation.com
                            </a>
                        </div>
                    </div>
                </header>

                {/* 2. MAIN TITLE */}
                {contract.mainTitle && (
                    <div className="text-center pt-2 pb-1">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 underline decoration-1 underline-offset-4">
                            {contract.mainTitle}
                        </h2>
                    </div>
                )}

                {/* 3. CLIENT & METADATA BLOCK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="space-y-1">
                        <p className="text-slate-500 uppercase tracking-wider font-semibold">የደበኛ መረጃ (Client Information)</p>
                        <p className="font-bold text-sm text-slate-900">{contract.customerName || "—"}</p>
                        <p className="text-slate-700">
                            ስልክ:{" "}
                            {contract.customerPhone ? (
                                <a href={`tel:${contract.customerPhone}`} className="text-blue-600 hover:underline font-semibold">
                                    {contract.customerPhone}
                                </a>
                            ) : (
                                "—"
                            )}
                        </p>
                        <p className="text-slate-700">አድራሻ: {contract.customerAddress || "—"}</p>
                    </div>
                    <div className="space-y-1 sm:text-right">
                        <p className="text-slate-500 uppercase tracking-wider font-semibold">የሰነድ መረጃ (Document Metadata)</p>
                        <p className="text-slate-700">
                            የተፈረመበት ቀን:{" "}
                            <span className="font-semibold text-slate-900">
                                {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "—"}
                            </span>
                        </p>
                        <p className="text-slate-700">
                            ሁኔታ:{" "}
                            <span className="font-semibold uppercase text-emerald-600 font-mono">የተረጋገጠ (VERIFIED)</span>
                        </p>
                    </div>
                </div>

                {/* 4. SECTIONS */}
                <div className="space-y-6 text-sm text-slate-800">
                    {SECTION_KEYS.map(({ sub, con, num }) => {
                        const subtitle = contract[sub];
                        const content = contract[con];

                        if (!subtitle && !content) return null;

                        return (
                            <div key={num} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
                                {subtitle && (
                                    <h3 className="text-base font-bold text-slate-900 text-center border-b border-slate-200 pb-1">
                                        {num}. {subtitle}
                                    </h3>
                                )}
                                {content && <p className="whitespace-pre-wrap leading-relaxed text-justify opacity-95">{content}</p>}
                            </div>
                        );
                    })}
                </div>

                {/* 5. SIGNATURES */}
                <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                    <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <p className="font-bold uppercase text-slate-700 text-center border-b pb-1">የደበኛው ፊርማ (Client Signature)</p>
                        <p className="text-slate-800">ስም: <span className="font-semibold">{contract.customerName || "—"}</span></p>
                        <p className="text-slate-800">ፊርማ: ___________________________</p>
                        <p className="text-slate-800">ቀን: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "________________"}</p>
                    </div>

                    <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                        <p className="font-bold uppercase text-slate-700 text-center border-b pb-1">የድርጅቱ ተወካይ (Company Representative)</p>
                        <p className="text-slate-800">ስም: <span className="font-semibold">Jemal Nurye Yimam</span></p>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-800">ፊርማ:</span>
                            <div className="relative w-28 h-10">
                                <img
                                    src="/images/signature.jpg"
                                    alt="Admin Signature"
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                        </div>
                        <p className="text-slate-800">ቀን: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : "________________"}</p>
                    </div>
                </div>

                {/* 6. FOOTER */}
                <footer className="pt-6 border-t border-slate-300 text-center space-y-1 text-xs text-slate-700">
                    <p className="font-bold text-sm text-slate-900">
                        ያዘጋጀው / ያረጋገጠው: ጀማል ኑርዬ ይማም
                    </p>
                    <p className="font-semibold text-slate-700">
                        የፕሮጀክት ማኔጀር | ሰርተፋይድ ኤሌክትሪሻን እና ፕለምበር
                    </p>
                    <p className="font-extrabold text-slate-900 pt-1">
                        አቡሐኒፋ ኢንስታሌሽን ኢትዮጵያ – ለላቀ ጥራትና ታማኝነት ሁሌም ከፊት
                    </p>
                </footer>
            </main>
        </div>
    );
}