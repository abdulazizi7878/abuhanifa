'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Eye, 
  PackagePlus, 
  Boxes, 
  ClipboardPlus, 
  ClipboardList, 
  FilePlus2, 
  FileText, 
  Tags, 
  Megaphone, 
  MessageSquareText, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Palette, 
  Sun, 
  Moon, 
  Check, 
  LogOut 
} from 'lucide-react';

const adminLinks = [
  { text: "Dashboard", href: "/ahiadmin", icon: <LayoutDashboard className="w-4 h-4 text-emerald-500" />, category: "Overview" },
  { text: "Create Blog", href: "/ahiadmin/create/blog", icon: <PlusCircle className="w-4 h-4 text-[var(--primary)]" />, category: "Content" },
  { text: "View Blogs", href: "/ahiadmin/view/blogs", icon: <Eye className="w-4 h-4 text-purple-400" />, category: "Content" },
  { text: "Create Product", href: "/ahiadmin/create/product", icon: <PackagePlus className="w-4 h-4 text-[var(--primary)]" />, category: "Inventory" },
  { text: "View Products", href: "/ahiadmin/view/products", icon: <Boxes className="w-4 h-4 text-purple-400" />, category: "Inventory" },
  { text: "Create Material", href: "/ahiadmin/create/material", icon: <ClipboardPlus className="w-4 h-4 text-[var(--primary)]" />, category: "Operations" },
  { text: "View Materials", href: "/ahiadmin/view/materials", icon: <ClipboardList className="w-4 h-4 text-purple-400" />, category: "Inventory" },
  { text: "Create Estimate", href: "/ahiadmin/create/estimate", icon: <FilePlus2 className="w-4 h-4 text-[var(--primary)]" />, category: "Operations" },
  { text: "View Estimates", href: "/ahiadmin/view/estimates", icon: <FileText className="w-4 h-4 text-purple-400" />, category: "Operations" },
  { text: "Create Promotion", href: "/ahiadmin/create/promotion", icon: <Tags className="w-4 h-4 text-[var(--primary)]" />, category: "Marketing" },
  { text: "View Promotions", href: "/ahiadmin/view/promotions", icon: <Megaphone className="w-4 h-4 text-purple-400" />, category: "Marketing" },
  { text: "View Comments & Messages", href: "/ahiadmin/view/messages", icon: <MessageSquareText className="w-4 h-4 text-purple-400" />, category: "Support" },
  { text: "View Job & Product Orders", href: "/ahiadmin/view/orders", icon: <ShoppingCart className="w-4 h-4 text-purple-400" />, category: "Operations" },
];

/**
 * Exact route-matching helper.
 * Only highlights the navigation item if the current pathname matches the href exactly.
 */
function isNavItemActive(pathname, href) {
  if (!pathname) return false;

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const cleanHref = href.replace(/\/+$/, '') || '/';

  return cleanPath === cleanHref;
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ahi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setIsDark(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 180 && newWidth <= 400) {
        setSidebarWidth(newWidth);
        if (isCollapsed && newWidth > 200) {
          setIsCollapsed(false);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isCollapsed]);

  const toggleTheme = (darkTheme) => {
    setIsDark(darkTheme);
    if (darkTheme) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('ahi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('ahi_theme', 'light');
    }
    setThemeMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex transition-colors duration-200 selection:bg-[var(--primary)]/30 selection:text-[var(--foreground)]">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        aria-label="Admin Navigation Sidebar"
        style={{ width: isCollapsed ? '72px' : `${sidebarWidth}px` }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[var(--background)] border-r border-[var(--border)] transition-[width] duration-75 lg:sticky lg:top-0 lg:h-screen select-none ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-xs tracking-tight text-[var(--foreground)] truncate">Abu Hanifa</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--primary)]">Installation</span>
              </div>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button 
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar drawer"
            className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] opacity-70 hover:opacity-100 lg:hidden transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto overflow-x-visible">
          {adminLinks.map((item, index) => {
            const isActive = isNavItemActive(pathname, item.href);
            return (
              <div 
                key={index} 
                className="relative"
                onMouseEnter={() => isCollapsed && setHoveredIndex(index)}
                onMouseLeave={() => isCollapsed && setHoveredIndex(null)}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  aria-label={item.text}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-[var(--primary)]/15 text-[var(--primary)] font-bold border border-[var(--primary)]/30 shadow-xs'
                      : 'text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--muted)]/50 border border-transparent'
                  }`}
                >
                  <span className="shrink-0 transition-transform group-hover:scale-110 flex items-center justify-center w-5 h-5">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.text}</span>
                      <span className="text-[8px] uppercase tracking-wider opacity-50">{item.category}</span>
                    </div>
                  )}

                  {/* Subtle Accent Indicator for Active Item */}
                  {isActive && !isCollapsed && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  )}
                </Link>

                {/* Floating Tooltip for Collapsed Sidebar */}
                {isCollapsed && hoveredIndex === index && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] shadow-xl whitespace-nowrap pointer-events-none flex flex-col animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2">
                      {item.text}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-[var(--primary)] font-semibold">{item.category}</span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Collapse & Footer */}
        <div className="p-3 border-t border-[var(--border)] hidden lg:flex items-center justify-between shrink-0">
          {!isCollapsed && (
            <span className="text-[11px] font-medium opacity-60 truncate">Collapse</span>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
            className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] opacity-75 hover:opacity-100 transition-all cursor-pointer mx-auto lg:mx-0"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Resize Handle for Desktop Sidebar */}
        <div 
          onMouseDown={() => setIsResizing(true)}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[var(--primary)]/50 transition-colors hidden lg:block"
          title="Drag to resize sidebar"
        />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 sm:px-8 bg-[var(--background)]/90 border-b border-[var(--border)] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open mobile navigation menu"
              className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] lg:hidden transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)]">
                Abu Hanifa Installation
              </h1>
              <p className="text-[11px] opacity-60 font-medium hidden sm:block">
                Enterprise administration & operational management platform.
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                aria-label="Toggle theme selection menu"
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] hover:opacity-100 transition-all cursor-pointer shadow-xs"
              >
                <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span className="text-xs font-semibold capitalize hidden sm:inline">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-2xl p-1.5 z-50">
                  <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider opacity-50">
                    Theme Mode
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleTheme(false)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        !isDark ? 'bg-[var(--primary)] text-slate-950 font-bold shadow-xs' : 'text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--muted)]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </div>
                      {!isDark && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTheme(true)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isDark ? 'bg-[var(--primary)] text-slate-950 font-bold shadow-xs' : 'text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--muted)]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </div>
                      {isDark && <Check className="w-3 h-3 shrink-0" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar & Quick Exit */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center font-bold text-xs shadow-inner text-[var(--primary)] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Admin user profile placeholder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Link 
                href="/" 
                aria-label="Exit admin console and return to main application" 
                className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] opacity-75 hover:opacity-100 hover:text-rose-500 transition-all cursor-pointer" 
                title="Exit Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}