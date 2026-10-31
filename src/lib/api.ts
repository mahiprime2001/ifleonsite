/*
 * The site's content now comes from the IFLEON dashboard (dashboard.ifleon.com) instead of WordPress:
 * blog posts, testimonials and the contact form. See dashboard/src/app/api/public/.
 *
 * Prerendered pages (scripts/prerender.mjs) embed the data they were built with in
 * <script id="ifleon-data">, so the first render doesn't wait for a fetch.
 */

export const API_BASE = (import.meta.env.VITE_API_BASE || "https://dashboard.ifleon.com/api/public").replace(/\/+$/, "");
const DASHBOARD_ORIGIN = API_BASE.replace(/\/api\/public$/, "");

export interface PostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  authorName: string | null;
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface Post extends PostSummary {
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  readingMinutes: number;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number | null;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  /** Hidden spam trap: people leave it empty. */
  website?: string;
}

type Preloaded = { posts?: PostSummary[]; post?: Post; testimonials?: Testimonial[] };

let preloaded: Preloaded | null = null;
/* Data a prerendered page was built with, if any (read once). */
export function getPreloaded(): Preloaded {
  if (preloaded) return preloaded;
  try {
    const el = typeof document !== "undefined" ? document.getElementById("ifleon-data") : null;
    preloaded = el?.textContent ? (JSON.parse(el.textContent) as Preloaded) : {};
  } catch {
    preloaded = {};
  }
  return preloaded;
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { signal });
  if (!res.ok) throw Object.assign(new Error(`GET ${path} failed (${res.status})`), { status: res.status });
  return res.json() as Promise<T>;
}

export async function fetchPosts(signal?: AbortSignal) {
  return (await getJson<{ posts: PostSummary[] }>("/posts", signal)).posts;
}

/* null when the post doesn't exist (or isn't published). */
export async function fetchPost(slug: string, signal?: AbortSignal): Promise<Post | null> {
  try {
    return (await getJson<{ post: Post }>(`/posts/${encodeURIComponent(slug)}`, signal)).post;
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
}

export async function fetchTestimonials(signal?: AbortSignal) {
  return (await getJson<{ testimonials: Testimonial[] }>("/testimonials", signal)).testimonials;
}

/* Counts one view (the dashboard ignores repeat views from the same visitor for 30 minutes). */
export function countView(postId: number) {
  fetch(`${DASHBOARD_ORIGIN}/api/v1/posts/${postId}/view`, { method: "POST", keepalive: true }).catch(() => {});
}

export async function sendContact(form: ContactForm): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return { ok: true };
    return { ok: false, error: data.error || "The message couldn't be sent. Please try again." };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Check your connection and try again, or email info@ifleon.com." };
  }
}
