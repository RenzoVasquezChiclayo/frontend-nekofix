import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Redirección canónica; la auth JWT se valida en cliente (RequireAdmin + Zustand). */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
