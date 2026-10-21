import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/*
 * proxy.ts already blocks /admin without a session, but every data read and server action
 * checks again here: server actions are plain POST endpoints and must not trust the proxy alone.
 */
export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/login");
  return admin;
}
