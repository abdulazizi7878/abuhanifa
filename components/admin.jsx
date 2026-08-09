"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Tag, 
  Package, 
  ClipboardList, 
  BookOpen, 
  MessageSquare, 
  ShoppingCart, 
  Layers, 
  Megaphone, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <AdminMain />
      </div>
    </div>
  );
}

function AdminMain() {
  const adminLinks = [
    { text: "Create Blog", link: "/ahiadmin/create/blog", icon: <FileText className="w-6 h-6 text-(--primary)" />, category: "Content" },
    { text: "Create Product", link: "/ahiadmin/create/product", icon: <Package className="w-6 h-6 text-(--third)" />, category: "Inventory" },
    { text: "Create Material", link: "/material", icon: <ClipboardList className="w-6 h-6 text-(--primary)" />, category: "Operations" },
    { text: "Create Estimate", link: "/estimates/create", icon: <FileText className="w-6 h-6 text-(--primary)" />, category: "Operations" },
    { text: "Create Promotion", link: "/ahiadmin/create/promotion", icon: <Tag className="w-6 h-6 text-(--secondary)" />, category: "Marketing" },
    
    { text: "View Blogs", link: "/ahiadmin/view/blogs", icon: <BookOpen className="w-6 h-6 text-(--secondary)" />, category: "Content" },
    { text: "View Products", link: "/ahiadmin/view/products", icon: <Layers className="w-6 h-6 text-(--secondary)" />, category: "Inventory" },
    { text: "View Material", link: "/material/view", icon: <ClipboardList className="w-6 h-6 text-(--secondary)" />, category: "Inventory" },
    { text: "View Estimates", link: "/estimates", icon: <FileText className="w-6 h-6 text-(--secondary)" />, category: "Operations" },
    { text: "View Promotions", link: "/ahiadmin/view/promotions", icon: <Megaphone className="w-6 h-6 text-(--third)" />, category: "Marketing" },
    { text: "View Comments & Messages", link: "/ahiadmin/view/comments", icon: <MessageSquare className="w-6 h-6 text-(--third)" />, category: "Support" },
    { text: "View Job & Product Orders", link: "/ahiadmin/view/orders", icon: <ShoppingCart className="w-6 h-6 text-(--primary)" />, category: "Operations" },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-y-10">
      <div className="relative w-full overflow-hidden rounded-3xl border border-(--border) bg-background p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-foreground opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-(--primary) opacity-10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--border) bg-foreground/5 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-(--primary)" />
              Secure Admin Console
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base opacity-75 max-w-xl">
              Your centralized management suite for installation services, catalog workflows, content updates, and client orders.
            </p>
          </div>

          <div className="flex items-center justify-center p-5 rounded-2xl border border-(--border) bg-foreground/5 backdrop-blur-md shadow-inner">
            <Zap className="w-10 h-10 text-(--primary) animate-pulse" />
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {adminLinks.map((item, index) => (
          <LinkDivs 
            key={index} 
            text={item.text} 
            link={item.link} 
            icon={item.icon} 
            category={item.category} 
          />
        ))}
      </div>
    </div>
  );
}

function LinkDivs({ text, link, icon, category }) {
  return (
    <Link 
      href={link} 
      className="group relative bg-background hover:bg-foreground/5 border border-(--border) p-6 flex flex-col justify-between rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-foreground/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

      <div className="flex items-start justify-between w-full mb-6">
        <div className="w-12 h-12 rounded-xl border border-(--border) bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-(--border) bg-background opacity-75">
          {category}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-1 group-hover:text-(--primary) transition-colors">
          {text}
        </h3>
        <div className="flex items-center gap-1 text-xs font-medium opacity-60 group-hover:opacity-100 transition-opacity mt-2">
          <span>Access module</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}