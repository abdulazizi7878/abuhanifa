'use client';

import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './lannguageSwitcher';

export default function Header() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const localeLang = useLocale();

  const navContainerRef = useRef(null);
  const hiddenMeasureContainerRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Defined in priority order (1 is highest priority, 8 is lowest/first to move to More)
  const NAV_ITEMS = useMemo(() => [
    { key: "home", href: "/", priority: 1 },
    { key: "order", href: "/order", priority: 2 },
    { key: "products", href: "/products", priority: 3 },
    { key: "books", href: "/books", priority: 4 },
    { key: "promotions", href: "/promotions", priority: 5 },
    { key: "blog", href: "/blog", priority: 6 },
    { key: "contact", href: "/contact", priority: 7 },
    { key: "services", href: `/${localeLang}#services`, priority: 8 },
  ], [localeLang]);

  // Keys of items that move into the More menu dropdown
  const [overflowKeys, setOverflowKeys] = useState([]);

  // Active route checking helper
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#') || href.startsWith(`/${localeLang}#`)) return false;
    return pathname.startsWith(href);
  };

  // Sync dark mode state with document element on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Toggle dark mode class on html/root tag
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
  };

  // Close menus on Escape key press or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMoreOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Exact measurement & classification of visibleItems vs overflowItems
  useLayoutEffect(() => {
    const navContainer = navContainerRef.current;
    const measureContainer = hiddenMeasureContainerRef.current;
    if (!navContainer || !measureContainer) return;

    const calculateAdaptiveLayout = () => {
      const availableWidth = navContainer.clientWidth;
      if (availableWidth <= 0) return;

      // 1. Measure exact widths from offscreen DOM container
      const itemWidths = {};
      NAV_ITEMS.forEach((item) => {
        const el = measureContainer.querySelector(`[data-measure-key="${item.key}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          itemWidths[item.key] = (rect.width > 0 ? rect.width : 70) + 16; // Fallback width + gap spacing
        }
      });

      const moreBtnEl = measureContainer.querySelector('[data-measure-key="more-btn"]');
      const moreBtnWidth = (moreBtnEl && moreBtnEl.getBoundingClientRect().width > 0
        ? moreBtnEl.getBoundingClientRect().width
        : 80) + 16;

      // 2. Total width if ALL items fit
      const totalWidthNeeded = Object.values(itemWidths).reduce((acc, curr) => acc + curr, 0);

      // If everything fits, overflow list is empty
      if (totalWidthNeeded <= availableWidth) {
        setOverflowKeys([]);
        return;
      }

      // 3. Otherwise, collapse items starting from lowest priority (Services -> Contact -> Blog, etc.)
      const collapseCandidates = [...NAV_ITEMS].sort((a, b) => b.priority - a.priority);

      let currentWidth = totalWidthNeeded;
      const newlyOverflowing = [];

      for (const item of collapseCandidates) {
        if (item.priority === 1) break; // Home never collapses

        newlyOverflowing.push(item.key);
        currentWidth -= (itemWidths[item.key] || 0);

        if (currentWidth + moreBtnWidth <= availableWidth) {
          break;
        }
      }

      setOverflowKeys(newlyOverflowing);
    };

    const resizeObserver = new ResizeObserver(() => {
      calculateAdaptiveLayout();
    });

    resizeObserver.observe(navContainer);
    calculateAdaptiveLayout();

    return () => resizeObserver.disconnect();
  }, [NAV_ITEMS]);

  // Strict separation: Every item belongs to EXACTLY ONE array
  const visibleItems = NAV_ITEMS.filter((item) => !overflowKeys.includes(item.key));
  const overflowItems = NAV_ITEMS.filter((item) => overflowKeys.includes(item.key));
  const isMoreActive = overflowItems.some((item) => isActive(item.href));

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background text-foreground transition-colors"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        color: 'var(--foreground)'
      }}
    >
      <div className="mx-auto flex h-14 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md shrink-0 z-10"
        >
          <div
            className="flex size-10 items-center justify-center overflow-hidden shrink-0 rounded-full border"
            style={{ borderColor: 'var(--border)' }}
          >
            <img src="/images/logo.jpg" alt="Abuhanifa Logo" className='object-cover size-full' />
          </div>
          <span className="sm:text-md md:text-lg lg:text-2xl text-[11px] font-bold whitespace-nowrap">{t("title")}</span>
        </Link>

        {/* Center: Adaptive Desktop Navigation Container */}
        <div ref={navContainerRef} className="hidden md:flex flex-1 items-center justify-center min-w-0 h-full">
          <nav aria-label="Main Navigation" className="flex items-center gap-x-4 lg:gap-x-6 flex-nowrap">
            {/* Render Visible Items */}
            {visibleItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md px-1 py-0.5 whitespace-nowrap shrink-0 ${active ? 'font-bold text-primary underline underline-offset-4' : 'text-foreground'
                    }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            {/* Render More Button and Dropdown ONLY if overflowItems exists */}
            {overflowItems.length > 0 && (
              <div className="relative shrink-0" ref={moreMenuRef}>
                <button
                  type="button"
                  aria-expanded={isMoreOpen}
                  aria-haspopup="true"
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md px-2 py-1 whitespace-nowrap ${isMoreActive ? 'font-bold text-primary underline underline-offset-4' : 'text-foreground'
                    }`}
                >
                  <span>{t("more") || "More"}</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 shrink-0 ${isMoreOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Vertical Scrollable Dropdown for Overflow Items */}
                {isMoreOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-2xl py-2 z-[100] flex flex-col overflow-y-auto max-h-[calc(100vh-5rem)] bg-background text-foreground border-border"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    {overflowItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.key}
                          href={item.href}
                          onClick={() => setIsMoreOpen(false)}
                          className={`w-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/80 text-left block truncate ${active ? 'font-bold text-primary bg-muted/40' : 'text-foreground'
                            }`}
                        >
                          {t(item.key)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Right: Action Controls (Fixed & Independent) */}
        <div className="flex items-center gap-x-3 shrink-0 z-10">
          {/* Desktop Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden md:inline-flex items-center justify-center rounded-2xl border p-2 text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            style={{ borderColor: 'var(--border)' }}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current md:hidden"
          >
            <span className="sr-only">{isOpen ? 'Close main menu' : 'Open main menu'}</span>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher display={false} />
        </div>
      </div>

      {/* Offscreen Measurement Node (Guaranteed accurate measurements using inline styles) */}
      <div
        ref={hiddenMeasureContainerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
          display: 'flex',
          gap: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: 500
        }}
      >
        {NAV_ITEMS.map((item) => (
          <span key={item.key} data-measure-key={item.key} style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem', whiteSpace: 'nowrap' }}>
            {t(item.key)}
          </span>
        ))}
        <span data-measure-key="more-btn" style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', whiteSpace: 'nowrap' }}>
          {t("more") || "More"}
        </span>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col justify-between px-6 py-6 transition-all duration-200 ease-in-out md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col space-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-md py-1"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Mobile Theme Switcher */}
        <div className="border-t pt-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-medium">Theme</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-semibold"
            style={{ borderColor: 'var(--border)' }}
          >
            {isDark ? 'Dark Mode' : 'Light Mode'}
            {isDark ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}