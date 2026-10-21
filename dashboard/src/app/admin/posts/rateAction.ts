"use server";

import { and, eq, isNull } from "drizzle-orm";
import { refresh, revalidateTag } from "next/cache";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export async function ratePost(postId: number, rating: 1 | -1 | null): Promise<void> {
  await requireAdmin();

  // A post that hasn't been moved to Trash.
  const livePost = and(eq(posts.id, postId), isNull(posts.deletedAt));

  await db.update(posts).set({ rating }).where(livePost);

  revalidateTag("posts", "max");
  // Re-render the page to update the button state and rating display
  refresh();
}
