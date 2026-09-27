'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  BookOpen,
  FileText,
  Megaphone,
  ClipboardList,
  Calculator,
  ShoppingCart,
  Image,
  Star,
  MessageSquare,
  KeyRound,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  User,
  Loader2,
  Search,
  GripVertical
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: '/ahiadmin',
    icon: LayoutDashboard,
    exact: true,
    keySegment: 'ahiadmin',
    keywords: ['home', 'main', 'overview', 'stats', 'analytics'],
  },
  {
    label: 'Products',
    href: '/ahiadmin/view/products',
    icon: Boxes,
    keySegment: 'product',
    prefixes: ['/ahiadmin/view/products', '/ahiadmin/create/product', '/ahiadmin/edit/product'],
    keywords: ['items', 'inventory', 'store', 'catalog', 'prod'],
  },
  {
    label: 'Books',
    href: '/ahiadmin/view/books',
    icon: BookOpen,
    keySegment: 'book',
    prefixes: ['/ahiadmin/view/books', '/ahiadmin/create/book', '/ahiadmin/edit/book'],
    keywords: ['publications', 'reading', 'library', 'pdf'],
  },
  {
    label: 'Blog',
    href: '/ahiadmin/view/blogs',
    icon: FileText,
    keySegment: 'blog',
    prefixes: ['/ahiadmin/view/blogs', '/ahiadmin/create/blog', '/ahiadmin/edit/blog'],
    keywords: ['posts', 'articles', 'news', 'content'],
  },
  {
    label: 'Promotions',
    href: '/ahiadmin/view/promotions',
    icon: Megaphone,
    keySegment: 'promotion',
    prefixes: ['/ahiadmin/view/promotions', '/ahiadmin/create/promotion', '/ahiadmin/edit/promotion'],
    keywords: ['ads', 'banners', 'marketing', 'offers', 'promo'],
  },
  {
    label: 'Materials',
    href: '/ahiadmin/view/materials',
    icon: ClipboardList,
    keySegment: 'material',
    prefixes: ['/ahiadmin/view/materials', '/ahiadmin/create/material', '/ahiadmin/edit/material'],
    keywords: ['supplies', 'quotation', 'list', 'items'],
  },
  {
    label: 'Estimates',
    href: '/ahiadmin/view/estimates',
    icon: Calculator,
    keySegment: 'estimate',
    prefixes: ['/ahiadmin/view/estimates', '/ahiadmin/create/estimate', '/ahiadmin/edit/estimate'],
    keywords: ['calculator', 'quotes', 'cost', 'pricing', 'calc'],
  },
  {
    label: 'Orders',
    href: '/ahiadmin/view/orders',
    icon: ShoppingCart,
    keySegment: 'order',
    prefixes: ['/ahiadmin/view/orders', '/ahiadmin/create/order', '/ahiadmin/edit/order'],
    keywords: ['purchases', 'transactions', 'cart', 'sales'],
  },
  {
    label: 'Installation Showcase',
    href: '/ahiadmin/create/showcase',
    icon: Image,
    keySegment: 'showcase',
    prefixes: ['/ahiadmin/create/showcase', '/ahiadmin/view/showcase'],
    keywords: ['show', 'showcase', 'installation', 'gallery', 'photos', 'portfolio'],
  },
  {
    label: 'Reviews',
    href: '/ahiadmin/create/review',
    icon: Star,
    keySegment: 'review',
    prefixes: ['/ahiadmin/create/review', '/ahiadmin/view/reviews'],
    keywords: ['ratings', 'feedback', 'testimonials', 'stars'],
  },
  {
    label: 'Messages',
    href: '/ahiadmin/view/messages',
    icon: MessageSquare,
    keySegment: 'message',
    prefixes: ['/ahiadmin/view/messages'],
    keywords: ['inbox', 'contact', 'chat', 'mail', 'inquiries'],
  },
  {
    label: 'Change Password',
    href: '/ahiadmin/change-password',
    icon: KeyRound,
    keySegment: 'change-password',
    prefixes: ['/ahiadmin/change-password'],
    keywords: ['pw', 'password', 'security', 'account', 'auth', 'change password'],
  },
];

export default function AdminLayout({ children }) {
  const rawPathname = usePathname();
  const router = useRouter();

  // Normalized path: lowercased and locale prefix stripped (e.g., /En/Ahiadmin/View/Products -> /ahiadmin/view/products)
  const pathname = useMemo(() => {
    if (!rawPathname) return '';
    const clean = rawPathname.toLowerCase();
    // Strip locale prefix if present (e.g., /en/ahiadmin -> /ahiadmin)
    return clean.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  }, [rawPathname]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(288); // 288px default (w-72)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  // Handle Sidebar Resizing
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 480) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Sync theme on mount
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

  // Close mobile navigation full-screen menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    setIsSearchFocused(false);
  }, [rawPathname]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('ahi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('ahi_theme', 'light');
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError('');

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        window.location.href = '/signin';
      } else {
        const data = await res.json().catch(() => ({}));
        setLogoutError(data.message || 'Logout failed. Please try again.');
        setIsLoggingOut(false);
      }
    } catch (err) {
      setLogoutError('Network error occurred during logout.');
      setIsLoggingOut(false);
    }
  };

  // Robust active route match: exact check, prefix check, or keySegment parsing
  const isItemActive = (item) => {
    if (item.exact) {
      return pathname === item.href || pathname === '/ahiadmin/' || pathname === '/ahiadmin';
    }

    // Check keySegment in pathname (e.g. "product" in "/ahiadmin/create/product")
    if (item.keySegment && pathname.includes(item.keySegment)) {
      return true;
    }

    if (item.prefixes) {
      return item.prefixes.some((prefix) => pathname.startsWith(prefix.toLowerCase()));
    }

    return pathname.startsWith(item.href.toLowerCase());
  };

  const getBreadcrumbs = () => {
    const segments = (rawPathname || '').split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  // Route search filtering logic
  const filteredNavItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return NAVIGATION_ITEMS;

    return NAVIGATION_ITEMS.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchHref = item.href.toLowerCase().includes(query);
      const matchKeywords = item.keywords?.some((kw) => kw.toLowerCase().includes(query));
      return matchLabel || matchHref || matchKeywords;
    });
  }, [searchQuery]);

  const handleNavigateToRoute = (href) => {
    router.push(href);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`h-screen bg-[var(--background)] text-[var(--foreground)] flex overflow-hidden antialiased selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)] ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
      {/* DESKTOP SIDEBAR WITH RESIZE HANDLE */}
      <aside
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex relative bg-[var(--background)] border-r border-[var(--border)] flex-col shrink-0 select-none transition-[width] duration-75 ease-out"
      >
        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-[var(--primary)]/50 active:bg-[var(--primary)] z-50 transition-colors group flex items-center justify-center"
          title="Drag to resize sidebar"
        >
          <div className="w-0.5 h-8 rounded bg-[var(--border)] group-hover:bg-[var(--primary)] transition-colors" />
        </div>

        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between shrink-0">
          <Link href="/ahiadmin" className="flex items-center gap-3 rounded-lg p-1 -ml-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[var(--border)]">
              <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-tight truncate">Abuhanifa</span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--primary)]">Installation ET</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1 text-sm font-medium [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {NAVIGATION_ITEMS.map((item) => {
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all outline-none border-0 cursor-pointer
                  ${active
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/60'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--background)] shrink-0 space-y-3">
          {logoutError && (
            <div className="text-xs text-rose-500 bg-rose-500/10 p-2 rounded-lg font-medium flex items-center justify-between">
              <span className="truncate">{logoutError}</span>
              <button onClick={() => setLogoutError('')} className="ml-1 text-rose-500 hover:text-rose-700 font-bold">
                ×
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[var(--muted)] text-[var(--foreground)] flex items-center justify-center font-semibold text-sm shrink-0 border border-[var(--border)]">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">Abuhanifa Admin</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-[var(--muted-foreground)] hover:text-rose-500 rounded-lg hover:bg-[var(--muted)] outline-none transition-colors border-0 cursor-pointer disabled:opacity-50"
              title="Logout"
              aria-label="Logout"
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* DESKTOP HEADER */}
        <header className="hidden lg:flex h-16 px-8 bg-[var(--background)] border-b border-[var(--border)] items-center justify-between shrink-0 z-30 sticky top-0 gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm font-medium">
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

          <div className="flex items-center gap-3">
            {/* Desktop Page Search */}
            <div className="relative w-64">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-[var(--muted-foreground)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Find page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.trim() !== '' && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50 p-1 space-y-0.5 max-h-80 overflow-y-auto">
                  {filteredNavItems.length > 0 ? (
                    filteredNavItems.map((item) => {
                      const Icon = item.icon;
                      const active = isItemActive(item);
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onMouseDown={() => handleNavigateToRoute(item.href)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer
                            ${active
                              ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold'
                              : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-[var(--muted-foreground)]">
                      No pages found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Switcher Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]/50 transition-all cursor-pointer text-xs font-semibold"
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-28 lg:pb-8 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* MOBILE FLOATING BOTTOM CONTROL */}
        <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 bg-[var(--background)]/90 backdrop-blur-md border border-[var(--border)] shadow-2xl rounded-full p-2 px-4 text-[var(--foreground)]">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>

            <div className="w-[1px] h-5 bg-[var(--border)]" />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-full hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="w-[1px] h-5 bg-[var(--border)]" />

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-[var(--foreground)] text-[var(--background)] font-semibold text-xs transition-transform active:scale-95 cursor-pointer shadow-sm"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* MOBILE FULL-SCREEN NAVIGATION & SEARCH INTERFACE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[var(--background)] flex flex-col p-6 overflow-hidden animate-in fade-in duration-200">
            {/* Full-Screen Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[var(--border)]">
                  <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight">Admin Menu</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">Abuhanifa Installation Et</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search Input */}
            <div className="pt-4 pb-2 shrink-0">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-[var(--muted-foreground)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Navigation / Search Results Links */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredNavItems.length > 0 ? (
                filteredNavItems.map((item) => {
                  const active = isItemActive(item);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavigateToRoute(item.href)}
                      className={`
                        w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-colors outline-none cursor-pointer text-left
                        ${active
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                          : 'text-[var(--foreground)] hover:bg-[var(--muted)]/60'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-[var(--primary-foreground)]' : 'text-current'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No pages found
                </div>
              )}
            </nav>

            {/* Mobile Footer / Logout */}
            <div className="pt-4 border-t border-[var(--border)] shrink-0 space-y-3">
              {logoutError && (
                <div className="text-xs text-rose-500 bg-rose-500/10 p-2 rounded-lg font-medium flex items-center justify-between">
                  <span className="truncate">{logoutError}</span>
                  <button onClick={() => setLogoutError('')} className="ml-1 text-rose-500 hover:text-rose-700 font-bold">
                    ×
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 font-semibold text-sm transition-colors border-0 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}