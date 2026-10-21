import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/* Sends anyone without a valid session from /admin to the login page. */
export async function proxy(request: NextRequest) {
  const admin = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (admin) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
