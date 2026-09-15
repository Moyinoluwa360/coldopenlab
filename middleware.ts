import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast edge guard: bounce anyone without a session cookie away from /admin
 * before the page renders. This is a cheap first gate only — the real
 * cryptographic verification happens in app/admin/layout.tsx (Node runtime),
 * since the Firebase Admin SDK can't run on the edge.
 */
const SESSION_COOKIE = "col_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable while logged out.
  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
