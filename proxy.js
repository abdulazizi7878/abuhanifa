import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // ==========================================
  // FIND LOCALE
  // ==========================================

  let locale = null;

  for (const currentLocale of routing.locales) {
    if (
      pathname === `/${currentLocale}` ||
      pathname.startsWith(`/${currentLocale}/`)
    ) {
      locale = currentLocale;
      break;
    }
  }

  // ==========================================
  // REMOVE LOCALE FROM PATH
  // ==========================================

  let pathnameWithoutLocale = pathname;

  if (locale) {
    pathnameWithoutLocale =
      pathname.slice(`/${locale}`.length) || "/";
  }

  // ==========================================
  // CHECK PROTECTED ROUTES
  // ==========================================

  const isAdminRoute =
    pathnameWithoutLocale === "/ahiadmin" ||
    pathnameWithoutLocale.startsWith("/ahiadmin/") ||
    pathnameWithoutLocale === "/estimates" ||
    pathnameWithoutLocale.startsWith("/estimates/") ||
    pathnameWithoutLocale === "/material" ||
    pathnameWithoutLocale.startsWith("/material/");

  // ==========================================
  // PUBLIC ROUTE
  // ==========================================

  if (!isAdminRoute) {
    return intlMiddleware(request);
  }

  // ==========================================
  // CHECK TOKEN
  // ==========================================

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const signInPath = locale
      ? `/${locale}/signin`
      : "/signin";

    return NextResponse.redirect(
      new URL(signInPath, request.url)
    );
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return intlMiddleware(request);
}

// ==========================================
// MATCHER
// ==========================================

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};