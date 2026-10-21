"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/password";
import { allowAttempt, clearAttempts } from "@/lib/rate-limit";
import {
  adminEmail,
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";

export type LoginState = { error?: string } | undefined;

/* Only allow redirects back into the dashboard, never to another site. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") ? next : "/admin";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Nginx sets X-Forwarded-For; without it every attempt shares one bucket, which is the safe direction.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limitKey = `login:${ip}`;
  if (!allowAttempt(limitKey)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  const expectedEmail = adminEmail();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedEmail || !hash) {
    return { error: "Admin login is not configured on the server." };
  }

  // Always hash, even for a wrong email, so response time doesn't reveal which part was wrong.
  const passwordOk = await verifyPassword(password, hash);
  if (!passwordOk || email !== expectedEmail) {
    return { error: "Wrong email or password." };
  }

  clearAttempts(limitKey);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(expectedEmail), sessionCookieOptions());
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
