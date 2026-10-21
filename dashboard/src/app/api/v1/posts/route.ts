import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { authenticate, jsonError } from "@/lib/api-keys";
import { isUniqueViolation } from "@/lib/db-errors";
import { slugify } from "@/lib/slug";

const MAX_BODY_BYTES = 1_000_000;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

const createPostInput = z
  .object({
    title: z.string().trim().min(1, "title is required").max(300),
    content: z.string().max(200_000).default(""),
    slug: z.string().trim().max(200).optional(),
    excerpt: optionalText(1000),
    tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
    coverImageUrl: z.url().nullish().transform((v) => v ?? null),
    seoTitle: optionalText(300),
    seoDescription: optionalText(500),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.iso.datetime({ offset: true }).nullish(),
    /* Shown in the dashboard's Source column. The API is mostly used by AI writers. */
    source: z.enum(["manual", "ai"]).default("ai"),
  })
  .strict();

/*
 * POST /api/v1/posts — create a post. Requires an API key with "posts:create";
 * creating it as published (or scheduled) also needs "posts:publish".
 */
export async function POST(request: Request) {
  const auth = await authenticate(request, "posts:create");
  if (!auth.ok) return auth.response;

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return jsonError(413, "Request body is too large (max 1 MB).");
  }
  const body = await request.json().catch(() => undefined);
  if (body === undefined) return jsonError(400, "Body must be valid JSON.");

  const parsed = createPostInput.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid request body.", { issues: z.flattenError(parsed.error) });
  }
  const input = parsed.data;

  if (input.status === "published" && !auth.key.scopes.includes("posts:publish")) {
    return jsonError(403, 'This API key can only create drafts. Use status "draft", or a key with "posts:publish".');
  }

  const values = {
    title: input.title,
    content: input.content,
    excerpt: input.excerpt,
    tags: input.tags,
    coverImageUrl: input.coverImageUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    status: input.status,
    source: input.source,
    // Publishing without a date means "now"; a future date schedules the post.
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : input.status === "published" ? new Date() : null,
  };

  // An explicit slug must be free; without one, we pick the first free variant of the title.
  const explicitSlug = input.slug !== undefined;
  const base = explicitSlug ? slugify(input.slug!) : slugify(input.title) || "post";
  if (!base) return jsonError(400, "slug needs at least one letter or number.");

  for (let attempt = 1; attempt <= 20; attempt++) {
    const slug = attempt === 1 ? base : `${base.slice(0, 190)}-${attempt}`;
    try {
      const [created] = await db
        .insert(posts)
        .values({ ...values, slug })
        .returning({ id: posts.id, slug: posts.slug, status: posts.status, publishedAt: posts.publishedAt });

      revalidateTag("posts", "max");
      const baseUrl = process.env.PUBLIC_BASE_URL || new URL(request.url).origin;
      return Response.json(
        { ...created, editUrl: new URL(`/admin/posts/${created.id}`, baseUrl).toString() },
        { status: 201 },
      );
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      if (explicitSlug) return jsonError(409, `A post with slug "${slug}" already exists (it may be in Trash).`);
    }
  }
  return jsonError(409, "Could not find a free slug for this title. Pass an explicit slug.");
}
