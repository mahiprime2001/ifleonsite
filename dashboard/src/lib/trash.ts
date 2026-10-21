import { and, isNotNull, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, posts, testimonials } from "@/db/schema";

/*
 * Trash: deleting a post, testimonial or message only sets `deleted_at`. Everything else filters
 * those rows out; the Trash page can restore them. After TRASH_DAYS they're removed for good.
 */
export const TRASH_DAYS = 30;

export const TRASHABLE = { post: posts, testimonial: testimonials, message: contactMessages } as const;
export type TrashKind = keyof typeof TRASHABLE;

/* Permanently deletes everything that has been in the trash longer than TRASH_DAYS. */
export async function purgeExpiredTrash() {
  const cutoff = sql`now() - make_interval(days => ${TRASH_DAYS})`;
  let removed = 0;
  for (const table of Object.values(TRASHABLE)) {
    const rows = await db
      .delete(table)
      .where(and(isNotNull(table.deletedAt), lt(table.deletedAt, cutoff)))
      .returning({ id: table.id });
    removed += rows.length;
  }
  return removed;
}
