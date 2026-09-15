"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const languages = [
    { code: "en", name: "English" },
    { code: "am", name: "አማርኛ" },
    { code: "ar", name: "العربية" },
    { code: "om", name: "Oromifa" },
    { code: "ti", name: "ትግርኛ" },
    { code: "so", name: "Somali" },
];

export default function LanguageModal() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if user has already chosen a language preference in localStorage
        const savedLanguage = localStorage.getItem("preferred_locale");
        if (!savedLanguage) {
            setIsOpen(true);
        }
    }, []);

    const handleSelectLanguage = (locale: string) => {
        localStorage.setItem("preferred_locale", locale);
        setIsOpen(false);

        // Update the URL path prefix to the selected locale
        if (!pathname) return;
        const segments = pathname.split("/");
        segments[1] = locale;

        router.push(segments.join("/"));
        router.refresh();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-11/12 max-w-lg p-6 sm:p-8 bg-background border border-(--border) rounded-3xl shadow-2xl flex flex-col items-center gap-6 text-center">

                <div className="flex flex-col gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                        Choose Your Language / ቋንቋ ይምረጡ
                    </h2>
                    <p className="text-xs sm:text-sm text-foreground/60">
                        Please select your preferred language to continue exploring Abuhanifa Installation.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelectLanguage(lang.code)}
                            className="py-3 px-4 font-bold text-sm rounded-2xl bg-foreground/[0.03] border border-(--border) hover:border-(--primary) hover:bg-(--primary) hover:text-background transition-all duration-200 text-foreground flex items-center justify-center shadow-sm"
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}