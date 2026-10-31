import type { Post, PostSummary, Testimonial } from "./api";

/*
 * Server-side reads from the dashboard's public API. Responses are cached for a minute (ISR), so a
 * newly published post shows up within ~60 seconds without rebuilding the site.
 *
 * API_INTERNAL_BASE (set in docker-compose) reaches the dashboard over the Docker network; builds and
 * local dev fall back to the public URL.
 */
export const API_BASE = (
  process.env.API_INTERNAL_BASE ||
  process.env.DASHBOARD_API_BASE ||
  "https://dashboard.ifleon.com/api/public"
).replace(/\/+$/, "");

/* The dashboard's own origin, for endpoints outside /api/public (the view counter). */
export const DASHBOARD_ORIGIN = API_BASE.replace(/\/api\/public$/, "");

export const REVALIDATE_SECONDS = 60;

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

async function get<T>(path: string, tags: string[]): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: REVALIDATE_SECONDS, tags } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Dashboard API ${path} answered ${res.status}`);
  return (await res.json()) as T;
}

/*
 * If the dashboard is unreachable while the Docker image builds, pages are built empty instead of
 * failing the build; they fill in on the first revalidation.
 */
async function orEmptyDuringBuild<T>(load: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (!isBuild) throw error;
    console.warn("[content] dashboard unreachable during build, rendering empty:", error);
    return empty;
  }
}

export function getPosts() {
  return orEmptyDuringBuild(async () => (await get<{ posts: PostSummary[] }>("/posts", ["posts"]))?.posts ?? [], []);
}

export async function getPost(slug: string) {
  return (await get<{ post: Post }>(`/posts/${encodeURIComponent(slug)}`, ["posts", `post:${slug}`]))?.post ?? null;
}

/* Testimonials are a nice-to-have on the home page: never let them take the page down. */
export async function getTestimonials() {
  try {
    return (await get<{ testimonials: Testimonial[] }>("/testimonials", ["testimonials"]))?.testimonials ?? [];
  } catch (error) {
    console.error("[content] testimonials unavailable:", error);
    return [];
  }
}
