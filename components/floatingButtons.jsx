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
        // ኤረር ቢኖርም ፋይሉ አሳልፎ እንዲሰጥ እና ማሳያውን እንዳያበላሸው ጸጥ እናደርገዋለን
        if (isMounted) setIsAdmin(false);
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* 1. Admin Floating Button (Visible ONLY if admin) */}
      {isAdmin && (
        <button
          onClick={() => router.push("/ahiadmin")}
          className="group flex items-center bg-linear-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer border border-white/20 backdrop-blur-md"
          title="Admin Dashboard"
        >
          <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-500 ease-in-out text-xs font-semibold tracking-wide uppercase">
            Admin Panel
          </span>
        </button>
      )}

      {/* 2. Telegram Floating Button (Visible ALWAYS for everyone) */}
      <a
        href="https://t.me/abuhanifainstallation"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#229ED9] text-white p-3.5 rounded-full shadow-2xl hover:shadow-[#229ED9]/50 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer border border-white/25 backdrop-blur-md"
        title="Contact on Telegram"
      >
        <Send className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-500 ease-in-out text-xs font-semibold tracking-wide uppercase">
          Telegram
        </span>
      </a>
    </div>
  );
}