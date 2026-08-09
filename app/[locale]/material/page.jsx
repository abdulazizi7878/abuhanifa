"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  PlusCircle, 
  Eye, 
  ChevronRight, 
  ClipboardList 
} from "lucide-react";

export default function MaterialDashboardPage() {
  const router = useRouter();

  const options = [
    {
      id: "create",
      title: "Create Material List",
      description: "Start a new material list by choosing electrical, plumbing, or sanitary installation categories and phases.",
      icon: <PlusCircle className="w-8 h-8 text-[var(--primary)]" />,
      link: "/material/create",
    },
    {
      id: "view",
      title: "View Material Lists",
      description: "Access, review, and manage all previously created material lists across your projects.",
      icon: <Eye className="w-8 h-8 text-[var(--secondary)]" />,
      link: "/material/view",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--foreground)]/5 text-xs font-semibold uppercase tracking-wider mb-3">
              <ClipboardList className="w-3.5 h-3.5 text-[var(--primary)]" />
              Inventory & Materials Hub
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Material Management
            </h1>
            <p className="mt-2 text-base opacity-75">
              Choose an option below to create a new material list or view existing records.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {options.map((option) => (
              <div
                key={option.id}
                className="group relative rounded-3xl p-8 border border-[var(--border)] bg-[var(--background)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[var(--foreground)]/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                <div>
                  <div className="w-16 h-16 rounded-2xl border border-[var(--border)] bg-[var(--foreground)]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {option.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {option.title}
                  </h3>
                  <p className="text-sm opacity-75 leading-relaxed mb-8">
                    {option.description}
                  </p>
                </div>

                <button
                  onClick={() => router.push(option.link)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-medium border border-[var(--border)] shadow-sm transition-all duration-200 cursor-pointer hover:bg-[var(--primary)] hover:text-white"
                >
                  <span>Access Module</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}