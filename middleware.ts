import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/cadastro"]);

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/logout")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (PUBLIC_PATHS.has(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
