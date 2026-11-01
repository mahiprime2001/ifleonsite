import { and, asc, eq, isNull } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { portfolioEntries, portfolioProfile } from "@/db/schema";
import { markdownToHtml } from "@/lib/markdown/html";
import { ENTRY_KINDS } from "@/lib/portfolio";
import { corsHeaders, PUBLIC_CACHE } from "@/lib/public-api";

/*
 * GET /api/public/portfolio — everything mahendra.ifleon.com shows, in one response: the profile
 * (bio rendered to HTML) and the visible entries of each kind in dashboard order, keyed by the plural
 * segment (projects, experience, education, skills, certifications, achievements, photos).
 * Markdown bodies come back as HTML in `bodyHtml`. The data is small, so one call is simplest.
 */

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request, "GET") });
}

export async function GET(request: Request) {
  await connection();
  const headers = corsHeaders(request, "GET");
  try {
    const [[profile], rows] = await Promise.all([
      db.select().from(portfolioProfile).where(eq(portfolioProfile.id, 1)).limit(1),
      db
        .select()
        .from(portfolioEntries)
        .where(and(eq(portfolioEntries.isPublished, true), isNull(portfolioEntries.deletedAt)))
        .orderBy(asc(portfolioEntries.sortOrder), asc(portfolioEntries.id)),
    ]);

    const sections: Record<string, unknown[]> = Object.fromEntries(Object.values(ENTRY_KINDS).map((k) => [k.segment, []]));
    for (const e of rows) {
      sections[ENTRY_KINDS[e.kind].segment].push({
        id: e.id,
        slug: e.slug,
        title: e.title,
        subtitle: e.subtitle,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        summary: e.summary,
        bodyHtml: e.body ? await markdownToHtml(e.body) : null,
        imageUrl: e.imageUrl,
        gallery: e.gallery,
        url: e.url,
        repoUrl: e.repoUrl,
        tags: e.tags,
        featured: e.isFeatured,
        updatedAt: e.updatedAt,
      });
    }

    return Response.json(
      {
        profile: profile
          ? {
              name: profile.name,
              headline: profile.headline,
              intro: profile.intro,
              bioHtml: profile.bio ? await markdownToHtml(profile.bio) : "",
              location: profile.location,
              email: profile.email,
              phone: profile.phone,
              availability: profile.availability,
              photoUrl: profile.photoUrl,
              resumeUrl: profile.resumeUrl,
              links: profile.links,
              seoTitle: profile.seoTitle,
              seoDescription: profile.seoDescription,
              updatedAt: profile.updatedAt,
            }
          : null,
        ...sections,
      },
      { headers: { ...headers, "Cache-Control": PUBLIC_CACHE } },
    );
  } catch (error) {
    console.error("[public] failed to load the portfolio:", error);
    return Response.json({ error: "Failed to load the portfolio" }, { status: 500, headers });
  }
}
