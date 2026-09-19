'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Palette,
  Sun,
  Moon,
  Check,
  LogOut,
  User,
  KeyRound
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Theme state
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sidebar resizing state
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const isResizingRef = useRef(false);

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
    if (pathname.includes('/ahiadmin/create/blog') || pathname.includes('/ahiadmin/view/blogs')) {
      setIsContentOpen(true);
    }
    if (pathname.includes('/ahiadmin/create/product') || pathname.includes('/ahiadmin/view/products')) {
      setIsInventoryOpen(true);
    }
    if (pathname.includes('/ahiadmin/create/material') || pathname.includes('/ahiadmin/create/estimate') || pathname.includes('/ahiadmin/view/estimates') || pathname.includes('/ahiadmin/view/materials')) {
      setIsOperationsOpen(true);
    }
    if (pathname.includes('/ahiadmin/create/promotion') || pathname.includes('/ahiadmin/view/promotions')) {
      setIsMarketingOpen(true);
    }
    if (pathname.includes('/ahiadmin/view/messages') || pathname.includes('/ahiadmin/create/review') || pathname.includes('/ahiadmin/view/reviews') || pathname.includes('/ahiadmin/view/orders')) {
      setIsSupportOpen(true);
    }

    // Close mobile drawer on route change
    setIsSidebarOpen(false);
  }, [pathname]);

  // Handle sidebar resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const newWidth = e.clientX;
      if (newWidth >= 220 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = (e) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.userSelect = 'none';
  };

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

  const isExactActive = (path) => pathname === path;
  const isSubActive = (prefix) => pathname.startsWith(prefix);

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-screen bg-[var(--background)] text-[var(--foreground)] flex overflow-hidden antialiased selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: `${sidebarWidth}px` }}
        className={`
          fixed inset-y-0 left-0 z-50 bg-[var(--background)] border-r border-[var(--border)]
          flex flex-col transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0 shrink-0 select-none shadow-xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between shrink-0">
          <Link
            href="/ahiadmin"
            className="flex items-center gap-2.5 rounded-lg p-1 -ml-1 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full shadow-xs flex items-center justify-center">
              <img src="/images/logo.jpg" alt="LOGO" className='rounded-full'  />
            </div>

            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-tight truncate">Abuhanifa</span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--primary)]">Installation Et</span>
            </div>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 text-sm font-medium bg-[var(--background)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Dashboard */}
          <Link
            href="/ahiadmin"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-colors outline-none border-0 cursor-pointer
              ${isExactActive("/ahiadmin")
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              }
            `}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
            <span>Dashboard</span>
          </Link>

          {/* Content */}
          <div className="space-y-1">
            <button
              onClick={() => setIsContentOpen(!isContentOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5
                rounded-lg transition-colors outline-none border-0 cursor-pointer
                ${isSubActive("/ahiadmin/create/blog") || isSubActive("/ahiadmin/view/blogs")
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </div>
              {isContentOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isContentOpen && (
              <div className="pl-9 space-y-1 py-1">
                <Link
                  href="/ahiadmin/create/blog"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/blog")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Blog
                </Link>
                <Link
                  href="/ahiadmin/view/blogs"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/blogs")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Blogs
                </Link>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="space-y-1">
            <button
              onClick={() => setIsInventoryOpen(!isInventoryOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5
                rounded-lg transition-colors outline-none border-0 cursor-pointer
                ${pathname.includes("/ahiadmin/create/product") || pathname.includes("/ahiadmin/view/products")
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4" />
                <span>Inventory</span>
              </div>
              {isInventoryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isInventoryOpen && (
              <div className="pl-9 space-y-1 py-1">
                <Link
                  href="/ahiadmin/create/product"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/product")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Product
                </Link>
                <Link
                  href="/ahiadmin/view/products"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/products")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Products
                </Link>
              </div>
            )}
          </div>

          {/* Operations */}
          <div className="space-y-1">
            <button
              onClick={() => setIsOperationsOpen(!isOperationsOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5
                rounded-lg transition-colors outline-none border-0 cursor-pointer
                ${pathname.includes("/ahiadmin/create/material") || pathname.includes("/ahiadmin/create/estimate") || pathname.includes("/ahiadmin/view/estimates") || pathname.includes("/ahiadmin/view/materials")
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" />
                <span>Operations</span>
              </div>
              {isOperationsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isOperationsOpen && (
              <div className="pl-9 space-y-1 py-1">
                <Link
                  href="/ahiadmin/create/material"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/material")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Material
                </Link>
                <Link
                  href="/ahiadmin/create/estimate"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/estimate")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Estimate
                </Link>
                <Link
                  href="/ahiadmin/view/estimates"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/estimates")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Estimates
                </Link>
                <Link
                  href="/ahiadmin/view/materials"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/materials")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Materials
                </Link>
              </div>
            )}
          </div>

          {/* Marketing */}
          <div className="space-y-1">
            <button
              onClick={() => setIsMarketingOpen(!isMarketingOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5
                rounded-lg transition-colors outline-none border-0 cursor-pointer
                ${pathname.includes("/ahiadmin/create/promotion") || pathname.includes("/ahiadmin/view/promotions")
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4" />
                <span>Marketing</span>
              </div>
              {isMarketingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isMarketingOpen && (
              <div className="pl-9 space-y-1 py-1">
                <Link
                  href="/ahiadmin/create/promotion"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/promotion")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Promotion
                </Link>
                <Link
                  href="/ahiadmin/view/promotions"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/promotions")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Promotions
                </Link>
              </div>
            )}
          </div>

          {/* Support */}
          <div className="space-y-1">
            <button
              onClick={() => setIsSupportOpen(!isSupportOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5
                rounded-lg transition-colors outline-none border-0 cursor-pointer
                ${pathname.includes("/ahiadmin/view/messages") || pathname.includes("/ahiadmin/create/review") || pathname.includes("/ahiadmin/view/reviews")
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <MessageSquareText className="w-4 h-4" />
                <span>Support</span>
              </div>
              {isSupportOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {isSupportOpen && (
              <div className="pl-9 space-y-1 py-1">
                <Link
                  href="/ahiadmin/view/messages"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/messages")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Comments & Messages
                </Link>

                <Link
                  href="/ahiadmin/view/orders"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/orders")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Orders
                </Link>
                <Link
                  href="/ahiadmin/create/review"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/create/review")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  Create Review
                </Link>
                <Link
                  href="/ahiadmin/view/reviews"
                  className={`
                    block px-3 py-2 rounded-lg text-xs transition-colors outline-none border-0 cursor-pointer
                    ${isExactActive("/ahiadmin/view/reviews")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                    }
                  `}
                >
                  View Reviews
                </Link>
              </div>
            )}
          </div>

          {/* Change Password Link */}
          <Link
            href="/ahiadmin/change-password"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-colors outline-none border-0 cursor-pointer
              ${isExactActive("/ahiadmin/change-password")
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              }
            `}
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Change Password</span>
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center font-semibold text-sm shrink-0">
                <User className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Abuhanifa Admin</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">Installation Management</p>
              </div>
            </div>

            <Link
              href="/"
              className="p-2 text-[var(--muted-foreground)] hover:text-rose-500 rounded-lg hover:bg-[var(--muted)] outline-none transition-colors border-0 cursor-pointer"
              title="Exit Admin"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={startResizing}
          className="hidden lg:flex absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[var(--primary)]/50 transition-colors items-center justify-center group"
          title="Drag to resize sidebar"
        >
          <div className="w-0.5 h-8 bg-[var(--border)] group-hover:bg-[var(--primary)] rounded-full" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 px-6 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)] outline-none border-0 cursor-pointer bg-[var(--background)]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base font-semibold tracking-tight lg:hidden">
              Abuhanifa Admin
            </h1>

            <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <div key={crumb.href} className="flex items-center space-x-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />}
                    {isLast ? (
                      <span className="text-[var(--foreground)] font-semibold">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] hover:opacity-100 transition-all cursor-pointer shadow-xs text-xs font-semibold"
              >
                <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span className="capitalize hidden sm:inline">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-2xl p-1.5 z-50">
                  <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider opacity-50">Theme Mode</div>
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleTheme(false)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${!isDark ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs' : 'text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--muted)]/50'
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
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isDark ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs' : 'text-[var(--foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--muted)]/50'
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

            <div className="flex lg:hidden items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center font-semibold text-xs shrink-0 border border-[var(--border)]">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}