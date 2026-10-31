import { NextResponse, type NextRequest } from "next/server";

/* WordPress leftovers: tell crawlers these are gone for good (410), instead of serving a page. */
export function proxy(request: NextRequest) {
  void request;
  return new NextResponse(null, { status: 410 });
}

export const config = {
  matcher: ["/wp-admin/:path*", "/wp-content/:path*", "/wp-includes/:path*", "/wp-json/:path*", "/wp-login.php", "/xmlrpc.php"],
};
