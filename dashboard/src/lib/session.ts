import { jwtVerify, SignJWT } from "jose";

/*
 * Single-owner admin session: a signed JWT in an httpOnly cookie.
 * Used by proxy.ts (edge of every /admin request) and by server code (lib/auth.ts).
 */
export const SESSION_COOKIE = "ifleon_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export async function createSessionToken(email: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

/* Returns the admin email for a valid session, or null. Changing ADMIN_EMAIL invalidates old sessions. */
export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.sub && payload.sub === adminEmail() ? payload.sub : null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    // Browsers treat http://localhost as secure, so this stays on for local Docker tests too.
    secure: process.env.COOKIE_SECURE !== "false",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
