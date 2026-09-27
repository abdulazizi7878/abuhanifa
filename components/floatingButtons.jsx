"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Send } from "lucide-react";

export default function FloatingButtons() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      try {
        const res = await fetch("/api/check");

        if (res.ok) {
          const data = await res.json();

          if (isMounted && data?.authorized) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        // Keep the floating buttons working even if the admin check fails.
        if (isMounted) {
          setIsAdmin(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      dir="ltr"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Admin Floating Button */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => router.push("/ahiadmin")}
          className="group flex flex-row items-center rounded-full border border-white/20 bg-linear-to-r from-blue-600 to-indigo-600 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-blue-500/50 active:scale-95 cursor-pointer"
          title="Admin Dashboard"
        >
          <ShieldCheck className="h-5 w-5 shrink-0 text-white animate-pulse" />

          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-wide transition-all duration-500 ease-in-out group-hover:ml-2.5 group-hover:max-w-xs">
            Admin Panel
          </span>
        </button>
      )}

      {/* Telegram Floating Button */}
      <a
        href="https://t.me/abuhanifainstallation"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-row items-center rounded-full border border-white/25 bg-[#229ED9] p-3.5 text-white shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[#229ED9]/50 active:scale-95 cursor-pointer"
        title="Contact on Telegram"
      >
        <Send className="h-5 w-5 shrink-0 text-white" />

        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-wide transition-all duration-500 ease-in-out group-hover:ml-2.5 group-hover:max-w-xs">
          Telegram
        </span>
      </a>
    </div>
  );
}
