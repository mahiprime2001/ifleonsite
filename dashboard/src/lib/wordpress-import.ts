import { and, eq, isNotNull, max } from "drizzle-orm";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { db } from "@/db";
import { posts, testimonials } from "@/db/schema";
import { isUniqueViolation } from "@/lib/db-errors";
import { slugify } from "@/lib/slug";
import { saveImage, UploadError } from "@/lib/uploads";

/*
 * One-way import from the WordPress site (ifleon.com) through its public REST API.
 * Re-runnable: every imported row keeps its WordPress id (wp_id), so a second run skips what's
 * already here, or updates it when `update` is set. Images are downloaded into our uploads so they
 * survive WordPress going away. Post slugs are kept, so /blog/<slug> URLs (and Google) don't change.
 */

const WP_API = (process.env.WORDPRESS_URL || "https://ifleon.com").replace(/\/$/, "") + "/wp-json/wp/v2";
const FETCH_TIMEOUT_MS = 30_000;

export type ImportReport = {
  posts: { found: number; created: number; updated: number; skipped: number; failed: string[] };
  testimonials: { found: number; created: number; updated: number; skipped: number; failed: string[] };
  images: { downloaded: number; failed: string[] };
  notes: string[];
};

type WpPost = {
  id: number;
  slug: string;
  status: string;
  date_gmt: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  jetpack_featured_media_url?: string;
  aioseo_head_json?: { title?: string; description?: string };
  _embedded?: { "wp:term"?: { taxonomy: string; name: string }[][]; author?: { name?: string }[] };
};

type WpTestimonial = {
  id: number;
  acf?: { name?: string; title?: string; quote?: string; rating?: string | number; image?: string | { url?: string } | false };
};

/* ---------- helpers ---------- */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", copy: "©", reg: "®", trade: "™",
};

/* Decodes HTML entities in short plain-text fields (titles, excerpts). */
function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? whole;
  });
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function toMarkdownService() {
  const service = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "_" });
  service.use(gfm);
  // Keep the language of <pre><code class="language-x"> blocks so they get syntax colours here too.
  service.addRule("fencedCodeWithLanguage", {
    filter: (node) => node.nodeName === "PRE" && node.firstChild?.nodeName === "CODE",
    replacement: (_content, node) => {
      const code = node.firstChild as HTMLElement;
      const language = /language-([\w+-]+)/.exec(code.getAttribute("class") || "")?.[1] ?? "";
      return `\n\n\`\`\`${language}\n${(code.textContent || "").replace(/\n$/, "")}\n\`\`\`\n\n`;
    },
  });
  return service;
}

async function fetchJson<T>(url: string): Promise<{ data: T; totalPages: number }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`WordPress returned HTTP ${res.status} for ${url}`);
  return { data: (await res.json()) as T, totalPages: Number(res.headers.get("x-wp-totalpages") || 1) };
}

async function fetchAll<T>(path: string): Promise<T[]> {
  const all: T[] = [];
  for (let page = 1; ; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const { data, totalPages } = await fetchJson<T[]>(`${WP_API}/${path}${sep}per_page=100&page=${page}`);
    all.push(...data);
    if (page >= totalPages || data.length === 0) return all;
  }
}

/* Downloads an image into our uploads and returns its new public URL (cached per run). */
async function importImage(url: string, cache: Map<string, string>, report: ImportReport): Promise<string> {
  const cached = cache.get(url);
  if (cached) return cached;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = await res.arrayBuffer();
    const name = new URL(url).pathname.split("/").pop() || "image";
    const publicPath = await saveImage(new File([bytes], name));
    const publicUrl = new URL(publicPath, process.env.PUBLIC_BASE_URL || "http://localhost:3100").toString();
    cache.set(url, publicUrl);
    report.images.downloaded++;
    return publicUrl;
  } catch (error) {
    // Keep the original link rather than losing the image reference entirely.
    report.images.failed.push(`${url} (${error instanceof UploadError ? error.message : error instanceof Error ? error.message : "failed"})`);
    cache.set(url, url);
    return url;
  }
}

/* Rewrites every <img src> pointing at the WordPress site to our downloaded copy. */
async function localizeImages(html: string, cache: Map<string, string>, report: ImportReport) {
  const wpHost = new URL(WP_API).host;
  const urls = new Set<string>();
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/gi)) {
    try {
      if (new URL(m[1]).host === wpHost) urls.add(m[1]);
    } catch {}
  }
  let out = html;
  for (const url of urls) out = out.split(url).join(await importImage(url, cache, report));
  // srcset lists other sizes on WordPress; drop them so readers don't fetch the old host.
  return out.replace(/\s(srcset|sizes)="[^"]*"/gi, "");
}

/* ---------- posts ---------- */

async function importPosts(update: boolean, report: ImportReport, images: Map<string, string>) {
  const wpPosts = await fetchAll<WpPost>("posts?_embed=author,wp:term&status=publish");
  report.posts.found = wpPosts.length;
  const markdown = toMarkdownService();

  const existing = new Map(
    (await db.select({ id: posts.id, wpId: posts.wpId }).from(posts).where(isNotNull(posts.wpId))).map((r) => [r.wpId!, r.id]),
  );

  for (const wp of wpPosts) {
    const title = plainText(wp.title.rendered) || `Post ${wp.id}`;
    try {
      const existingId = existing.get(wp.id);
      if (existingId && !update) {
        report.posts.skipped++;
        continue;
      }

      let html = await localizeImages(wp.content.rendered, images, report);
      // Many posts repeat their title as an <h1> at the top; the title is shown separately here.
      const firstH1 = /^\s*<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
      if (firstH1 && plainText(firstH1[1]).toLowerCase() === title.toLowerCase()) html = html.slice(firstH1[0].length);

      const tags = [
        ...new Set(
          (wp._embedded?.["wp:term"] ?? [])
            .flat()
            .filter((t) => t.taxonomy === "post_tag")
            .map((t) => slugify(decodeEntities(t.name)))
            .filter(Boolean),
        ),
      ].slice(0, 10);

      const cover = wp.jetpack_featured_media_url ? await importImage(wp.jetpack_featured_media_url, images, report) : null;
      const seoTitle = plainText(wp.aioseo_head_json?.title ?? "").slice(0, 300) || null;
      const seoDescription = plainText(wp.aioseo_head_json?.description ?? "").slice(0, 500) || null;
      const excerpt = plainText(wp.excerpt.rendered).replace(/\s*\[…\]$|\s*\[&hellip;\]$/, "").slice(0, 600) || null;

      const values = {
        title: title.slice(0, 300),
        excerpt,
        content: markdown.turndown(html).trim(),
        coverImageUrl: cover,
        tags,
        status: "published" as const,
        source: "wordpress" as const,
        seoTitle,
        seoDescription,
        authorName: wp._embedded?.author?.[0]?.name?.slice(0, 120) || "IFLEON",
        publishedAt: new Date(`${wp.date_gmt}Z`),
        wpId: wp.id,
      };

      if (existingId) {
        await db.update(posts).set(values).where(eq(posts.id, existingId));
        report.posts.updated++;
        continue;
      }

      // Keep the WordPress slug so old links keep working; only if it's taken (e.g. by an AI post) add -wp.
      const baseSlug = slugify(decodeEntities(wp.slug)) || slugify(title) || `post-${wp.id}`;
      for (const slug of [baseSlug, `${baseSlug}-wp`, `${baseSlug}-wp-${wp.id}`]) {
        try {
          await db.insert(posts).values({ ...values, slug });
          if (slug !== baseSlug) report.notes.push(`“${title}”: slug “${baseSlug}” was taken, imported as “${slug}”.`);
          report.posts.created++;
          break;
        } catch (error) {
          if (!isUniqueViolation(error) || slug.endsWith(`-wp-${wp.id}`)) throw error;
        }
      }
    } catch (error) {
      report.posts.failed.push(`${title}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/* ---------- testimonials ---------- */

async function importTestimonials(update: boolean, report: ImportReport, images: Map<string, string>) {
  const items = await fetchAll<WpTestimonial>("testimonials?acf_format=standard");
  report.testimonials.found = items.length;

  const existing = new Map(
    (await db.select({ id: testimonials.id, wpId: testimonials.wpId }).from(testimonials).where(isNotNull(testimonials.wpId))).map(
      (r) => [r.wpId!, r.id],
    ),
  );
  const [{ last }] = await db.select({ last: max(testimonials.sortOrder) }).from(testimonials);
  let nextOrder = (last ?? -1) + 1;

  for (const item of items) {
    const acf = item.acf || {};
    const name = plainText(acf.name ?? "").slice(0, 120);
    const quote = plainText(acf.quote ?? "").slice(0, 2000);
    try {
      if (!name || !quote) {
        report.testimonials.failed.push(`WordPress testimonial ${item.id}: missing name or quote`);
        continue;
      }
      const existingId = existing.get(item.id);
      if (existingId && !update) {
        report.testimonials.skipped++;
        continue;
      }
      const imageUrl = typeof acf.image === "string" ? acf.image : acf.image && acf.image.url ? acf.image.url : null;
      const ratingNumber = Number(acf.rating);
      const values = {
        name,
        role: plainText(acf.title ?? "").slice(0, 120) || null,
        quote,
        rating: Number.isInteger(ratingNumber) && ratingNumber >= 1 && ratingNumber <= 5 ? ratingNumber : null,
        avatarUrl: imageUrl ? await importImage(imageUrl, images, report) : null,
        wpId: item.id,
      };
      if (existingId) {
        await db.update(testimonials).set(values).where(and(eq(testimonials.id, existingId)));
        report.testimonials.updated++;
      } else {
        await db.insert(testimonials).values({ ...values, sortOrder: nextOrder++, isPublished: true });
        report.testimonials.created++;
      }
    } catch (error) {
      report.testimonials.failed.push(`${name || item.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export async function importFromWordPress(options: { posts: boolean; testimonials: boolean; update: boolean }): Promise<ImportReport> {
  const report: ImportReport = {
    posts: { found: 0, created: 0, updated: 0, skipped: 0, failed: [] },
    testimonials: { found: 0, created: 0, updated: 0, skipped: 0, failed: [] },
    images: { downloaded: 0, failed: [] },
    notes: [],
  };
  const images = new Map<string, string>();
  if (options.posts) await importPosts(options.update, report, images);
  if (options.testimonials) await importTestimonials(options.update, report, images);
  return report;
}

/* What's on WordPress right now vs. what's already been imported, for the Import page. */
export async function importStatus() {
  const count = async (path: string) => {
    const res = await fetch(`${WP_API}/${path}?per_page=1`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    return res.ok ? Number(res.headers.get("x-wp-total") || 0) : null;
  };
  const [wpPosts, wpTestimonials, importedPosts, importedTestimonials] = await Promise.all([
    count("posts").catch(() => null),
    count("testimonials").catch(() => null),
    db.$count(posts, isNotNull(posts.wpId)),
    db.$count(testimonials, isNotNull(testimonials.wpId)),
  ]);
  return { source: WP_API.replace("/wp-json/wp/v2", ""), wpPosts, wpTestimonials, importedPosts, importedTestimonials };
}
