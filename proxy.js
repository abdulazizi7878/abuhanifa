import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
      pathname === "/" + currentLocale ||
      pathname.startsWith("/" + currentLocale + "/")
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
      pathname.slice(("/" + locale).length) || "/";
  }

  // ==========================================
  // CHECK PROTECTED ROUTES
  // ==========================================

  const isAdminRoute =
    pathnameWithoutLocale === "/ahiadmin" ||
    pathnameWithoutLocale.startsWith("/ahiadmin/") ||
    pathnameWithoutLocale === "/estimates" ||
    pathnameWithoutLocale.startsWith("/material")||
    pathnameWithoutLocale.startsWith("/material/")||
    pathnameWithoutLocale.startsWith("/estimates/");

  // ==========================================
  // PUBLIC ROUTE
  // ==========================================

  if (!isAdminRoute) {
    return intlMiddleware(request);
  }

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const signInPath = locale
      ? "/" + locale + "/signin"
      : "/signin";

    return NextResponse.redirect(
      new URL(signInPath, request.url)
    );
  }

  // ==========================================
  // VERIFY JWT
  // ==========================================

  let user;

  try {
    user = jwt.verify(token, process.env.KEY);
  } catch (error) {
    console.error("Invalid JWT:", error);

    const signInPath = locale
      ? "/" + locale + "/signin"
      : "/signin";

    const response = NextResponse.redirect(
      new URL(signInPath, request.url)
    );

    response.cookies.delete("token");

    return response;
  }

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================

  if (!user || user.role !== "admin") {
    const forbiddenPath = locale
      ? "/" + locale + "/403"
      : "/403";

    return NextResponse.redirect(
      new URL(forbiddenPath, request.url)
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

