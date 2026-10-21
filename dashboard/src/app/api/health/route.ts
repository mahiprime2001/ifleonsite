import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";

/* Used by the container health check. connection() keeps this out of the build-time prerender. */
export async function GET() {
  await connection();
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: "up" });
  } catch {
    return Response.json({ ok: false, db: "down" }, { status: 503 });
  }
}
