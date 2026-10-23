"use server";

import { and, eq, inArray, isNull, ne, sql } from "drizzle-orm";
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
  redirect(`/admin/posts/${id}/edit`);
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

/* Post ids from the bulk form: positive integers only, at most 500 at a time. */
function selectedIds(formData: FormData) {
  return [...new Set(formData.getAll("postId").map(Number))].filter((id) => Number.isInteger(id) && id > 0).slice(0, 500);
}

/* Runs a bulk change, then refreshes the list. count = posts actually changed, not posts selected. */
async function bulk(formData: FormData, label: string, change: (ids: number[]) => Promise<number>): Promise<BulkActionResult> {
  await requireAdmin();
  const ids = selectedIds(formData);
  if (ids.length === 0) return { success: false, count: 0, error: "No posts selected" };
  try {
    const count = await change(ids);
    revalidateTag("posts", "max");
    refresh();
    return { success: true, count };
  } catch (error) {
    console.error(`[posts] bulk ${label} failed:`, error);
    return { success: false, count: 0, error: `Failed to ${label} posts` };
  }
}

/* Archives the selected posts (drafts or published; already-archived ones are left alone). */
export async function archiveSelected(formData: FormData): Promise<BulkActionResult> {
  return bulk(formData, "archive", async (ids) => {
    const rows = await db
      .update(posts)
      .set({ status: "archived" })
      .where(and(isNull(posts.deletedAt), ne(posts.status, "archived"), inArray(posts.id, ids)))
      .returning({ id: posts.id });
    return rows.length;
  });
}

/* Moves the selected posts to Trash (kept 30 days, restorable). */
export async function deleteSelected(formData: FormData): Promise<BulkActionResult> {
  return bulk(formData, "delete", async (ids) => {
    const rows = await db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(and(isNull(posts.deletedAt), inArray(posts.id, ids)))
      .returning({ id: posts.id });
    return rows.length;
  });
}

/* Publishes the selected posts. Keeps an existing publish date (so scheduled posts stay scheduled), else now. */
export async function republishSelected(formData: FormData): Promise<BulkActionResult> {
  return bulk(formData, "publish", async (ids) => {
    const rows = await db
      .update(posts)
      .set({ status: "published", publishedAt: sql`coalesce(${posts.publishedAt}, now())` })
      .where(and(isNull(posts.deletedAt), inArray(posts.id, ids)))
      .returning({ id: posts.id });
    return rows.length;
  });
}
