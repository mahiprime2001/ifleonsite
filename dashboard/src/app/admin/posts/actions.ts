"use server";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { refresh, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type PostFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; saved?: boolean }
  | undefined;

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const postInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: z.string().trim().max(200),
  excerpt: nullableText(1000),
  content: z.string().max(200_000),
  coverImageUrl: z
    .union([z.literal(""), z.url("Must be a full URL, e.g. https://…")])
    .transform((v) => (v === "" ? null : v)),
  tags: z
    .string()
    .transform((v) =>
      v
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 20),
    ),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.string().transform((v, ctx) => {
    if (!v) return null;
    const date = new Date(v);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({ code: "custom", message: "Invalid date" });
      return z.NEVER;
    }
    return date;
  }),
  seoTitle: nullableText(300),
  seoDescription: nullableText(500),
});

type ParseResult =
  | { ok: true; values: z.output<typeof postInput> & { slug: string } }
  | { ok: false; state: PostFormState };

function parse(formData: FormData): ParseResult {
  const result = postInput.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      ok: false,
      state: { error: "Fix the highlighted fields.", fieldErrors: z.flattenError(result.error).fieldErrors },
    };
  }
  const values = result.data;
  const slug = slugify(values.slug || values.title);
  if (!slug) {
    return { ok: false, state: { fieldErrors: { slug: ["Slug needs at least one letter or number"] } } };
  }
  // Publishing without a date means "now"; a future date schedules the post.
  const publishedAt =
    values.status === "published" && !values.publishedAt ? new Date() : values.publishedAt;
  return { ok: true, values: { ...values, slug, publishedAt } };
}

function isUniqueViolation(error: unknown) {
  const candidates = [error, (error as { cause?: unknown })?.cause];
  return candidates.some((e) => (e as { code?: string })?.code === "23505");
}

const slugTakenState: PostFormState = {
  error: "Another post already uses this slug (check Trash too).",
  fieldErrors: { slug: ["Already used by another post, possibly one in Trash"] },
};

/* A post that hasn't been moved to Trash. */
const livePost = (id: number) => and(eq(posts.id, id), isNull(posts.deletedAt));

export async function createPost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) return parsed.state;

  let id: number;
  try {
    const [row] = await db.insert(posts).values(parsed.values).returning({ id: posts.id });
    id = row.id;
  } catch (error) {
    if (isUniqueViolation(error)) return slugTakenState;
    throw error;
  }

  revalidateTag("posts", "max");
  redirect(`/admin/posts/${id}`);
}

export async function updatePost(
  id: number,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) return parsed.state;

  try {
    await db.update(posts).set(parsed.values).where(livePost(id));
  } catch (error) {
    if (isUniqueViolation(error)) return slugTakenState;
    throw error;
  }

  revalidateTag("posts", "max");
  // Re-renders the page header (Updated time); the form keeps its own controlled state.
  refresh();
  return { saved: true };
}

export type AutosaveResult = { ok: true } | { ok: false; error: string };

/*
 * Background save from the editor. Only ever touches drafts: if the post was published meanwhile
 * (another tab, or the status was changed), autosave stops and the user saves manually.
 */
export async function autosavePost(id: number, formData: FormData): Promise<AutosaveResult> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) return { ok: false, error: "Autosave paused: some fields are invalid. Click Save to see them." };
  if (parsed.values.status !== "draft") return { ok: false, error: "Autosave only runs for drafts." };

  try {
    const updated = await db
      .update(posts)
      .set(parsed.values)
      .where(and(livePost(id), eq(posts.status, "draft")))
      .returning({ id: posts.id });
    if (updated.length === 0) {
      return { ok: false, error: "This post is no longer a draft. Save it manually." };
    }
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "Autosave paused: another post already uses this slug." };
    throw error;
  }
  return { ok: true };
}

/* Moves the post to Trash (kept 30 days, restorable). It disappears from the site right away. */
export async function deletePost(id: number) {
  await requireAdmin();
  await db.update(posts).set({ deletedAt: new Date() }).where(livePost(id));
  revalidateTag("posts", "max");
  redirect("/admin/posts");
}

export type BulkActionResult = { success: boolean; count: number; error?: string };

/* Archives selected posts. */
export async function archiveSelected(formData: FormData): Promise<BulkActionResult> {
  await requireAdmin();
  const ids = formData.getAll("postId").map((id) => Number(id)).filter(Boolean);
  if (ids.length === 0) {
    return { success: false, count: 0, error: "No posts selected" };
  }

  try {
    const result = await db
      .update(posts)
      .set({ status: "archived" })
      .where(and(eq(posts.status, "draft"), inArray(posts.id, ids)));

    revalidateTag("posts", "max");
    return { success: true, count: ids.length };
  } catch (error) {
    return { success: false, count: 0, error: "Failed to archive posts" };
  }
}

/* Deletes selected posts (moves to trash). */
export async function deleteSelected(formData: FormData): Promise<BulkActionResult> {
  await requireAdmin();
  const ids = formData.getAll("postId").map((id) => Number(id)).filter(Boolean);
  if (ids.length === 0) {
    return { success: false, count: 0, error: "No posts selected" };
  }

  try {
    const result = await db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(and(isNull(posts.deletedAt), inArray(posts.id, ids)));

    revalidateTag("posts", "max");
    return { success: true, count: ids.length };
  } catch (error) {
    return { success: false, count: 0, error: "Failed to delete posts" };
  }
}

/* Publishes selected posts (sets status to published with current timestamp if not already scheduled). */
export async function republishSelected(formData: FormData): Promise<BulkActionResult> {
  await requireAdmin();
  const ids = formData.getAll("postId").map((id) => Number(id)).filter(Boolean);
  if (ids.length === 0) {
    return { success: false, count: 0, error: "No posts selected" };
  }

  try {
    // Get the posts to check if they have publishedAt set
    const postsToPublish = await db
      .select({ id: posts.id, publishedAt: posts.publishedAt })
      .from(posts)
      .where(and(isNull(posts.deletedAt), inArray(posts.id, ids)));

    // Update each post: if no publishedAt, set to now; otherwise keep existing
    for (const post of postsToPublish) {
      await db
        .update(posts)
        .set({
          status: "published",
          publishedAt: post.publishedAt || new Date(),
        })
        .where(eq(posts.id, post.id));
    }

    revalidateTag("posts", "max");
    return { success: true, count: postsToPublish.length };
  } catch (error) {
    return { success: false, count: 0, error: "Failed to republish posts" };
  }
}
