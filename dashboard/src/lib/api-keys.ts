import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { apiKeys, type ApiKey } from "@/db/schema";

/*
 * API keys for /api/v1. Keys look like `ifl_<32 random chars>` and are sent as
 * `Authorization: Bearer ifl_…`. They're long and random, so a plain SHA-256 hash is enough
 * for storage (a slow password hash is only needed for guessable secrets).
 */
export const SCOPES = {
  "posts:create": "Create draft posts",
  "posts:publish": "Publish posts (or schedule them)",
  "posts:read": "Read posts",
} as const;
export type Scope = keyof typeof SCOPES;

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export function generateApiKey() {
  const key = `ifl_${randomBytes(24).toString("base64url")}`;
  return { key, prefix: key.slice(0, 12), keyHash: hashApiKey(key) };
}

export function jsonError(status: number, error: string, extra?: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json({ error, ...extra }, { status, headers });
}

/* Per-key fixed window, in memory (one dashboard container). */
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;
const usage = new Map<number, { count: number; resetAt: number }>();

function rateLimited(keyId: number) {
  const now = Date.now();
  const entry = usage.get(keyId);
  if (!entry || entry.resetAt <= now) {
    usage.set(keyId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT ? Math.ceil((entry.resetAt - now) / 1000) : null;
}

const BEARER = /^Bearer\s+(ifl_[A-Za-z0-9_-]{20,64})$/;

/* Checks the Authorization header and the scope. Returns the key, or a ready-made error response. */
export async function authenticate(
  request: Request,
  scope: Scope,
): Promise<{ ok: true; key: ApiKey } | { ok: false; response: Response }> {
  const match = BEARER.exec(request.headers.get("authorization")?.trim() ?? "");
  if (!match) {
    return {
      ok: false,
      response: jsonError(401, "Missing or malformed API key. Send: Authorization: Bearer ifl_…", undefined, {
        "WWW-Authenticate": 'Bearer realm="ifleon"',
      }),
    };
  }

  const [key] = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, hashApiKey(match[1])), isNull(apiKeys.revokedAt)))
    .limit(1);
  if (!key) {
    return { ok: false, response: jsonError(401, "Invalid or revoked API key.") };
  }

  const retryAfter = rateLimited(key.id);
  if (retryAfter !== null) {
    return {
      ok: false,
      response: jsonError(429, "Too many requests. Slow down.", undefined, { "Retry-After": String(retryAfter) }),
    };
  }

  if (!key.scopes.includes(scope)) {
    return { ok: false, response: jsonError(403, `This API key is missing the "${scope}" permission.`) };
  }

  await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, key.id));
  return { ok: true, key };
}
