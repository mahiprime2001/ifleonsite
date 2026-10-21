"use server";

import { and, eq, isNotNull } from "drizzle-orm";
import { refresh, revalidateTag } from "next/cache";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { TRASHABLE, type TrashKind } from "@/lib/trash";

const CACHE_TAG: Record<TrashKind, string | null> = { post: "posts", testimonial: "testimonials", message: null };

/* Arguments bound to server actions come from the browser, so check them before use. */
function target(kind: string, id: number) {
  if (!Object.hasOwn(TRASHABLE, kind) || !Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid trash item.");
  }
  const table = TRASHABLE[kind as TrashKind];
  // Only rows that are actually in the trash can be restored or purged from here.
  return { table, kind: kind as TrashKind, where: and(eq(table.id, id), isNotNull(table.deletedAt)) };
}

export async function restoreItem(kind: string, id: number) {
  await requireAdmin();
  const t = target(kind, id);
  await db.update(t.table).set({ deletedAt: null }).where(t.where);
  const tag = CACHE_TAG[t.kind];
  if (tag) revalidateTag(tag, "max");
  refresh();
}

export async function deleteForever(kind: string, id: number) {
  await requireAdmin();
  const t = target(kind, id);
  await db.delete(t.table).where(t.where);
  refresh();
}

export async function emptyTrash() {
  await requireAdmin();
  for (const table of Object.values(TRASHABLE)) {
    await db.delete(table).where(isNotNull(table.deletedAt));
  }
  refresh();
}
