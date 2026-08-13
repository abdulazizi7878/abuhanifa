"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "am", name: "አማርኛ" },
  { code: "ar", name: "العربية" },
];

export default function LanguageSwitcher({ display }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  function changeLanguage(newLocale) {
    if (!pathname) return;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setIsOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-foreground/[0.03] border border-(--border) hover:border-(--primary)/40 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-sm transition-all duration-300 cursor-pointer select-none"
      >
        {display !== false && (
          <div className="text-xs font-semibold text-foreground/70 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="var(--primary)" className="transition-transform duration-300 hover:rotate-45">
              <path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/>
            </svg>
            <span>Language:</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{currentLanguage.name}</span>
          <svg 
            className={`w-3.5 h-3.5 text-foreground/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full min-w-[140px] bg-background border border-(--border) rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn p-1.5 backdrop-blur-xl">
          {languages.map((lang) => {
            const isSelected = lang.code === locale;
            return (
              <div
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`text-xs font-semibold px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected 
                    ? "bg-(--primary) text-background shadow-sm" 
                    : "text-foreground hover:bg-foreground/5"
                }`}
              >
                <span>{lang.name}</span>
                {isSelected && <span className="text-xs">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}