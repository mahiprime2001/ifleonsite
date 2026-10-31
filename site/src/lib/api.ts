/*
 * Shapes of the content the IFLEON dashboard serves (dashboard/src/app/api/public/), plus the two
 * calls the browser makes. Both go to this site's own /api routes, which forward them to the
 * dashboard, so visitors never talk to the dashboard directly and no CORS is involved.
 * Pages load content on the server: see lib/content.ts.
 */

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

/* Counts one view (the dashboard ignores repeat views from the same visitor for 30 minutes). */
export function countView(postId: number) {
  fetch(`/api/view/${postId}`, { method: "POST", keepalive: true }).catch(() => {});
}

export async function sendContact(form: ContactForm): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/contact", {
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
