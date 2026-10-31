import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { PAGES, SITE_URL, type PageInfo } from "@/lib/seo";

export const revalidate = 60; // seconds; keep in step with REVALIDATE_SECONDS in lib/content.ts

/* /sitemap.xml: the fixed pages plus every published post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const latest = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), "");
  const pages = Object.entries(PAGES as Record<string, PageInfo>).map(([path, page]) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: path === "/blog" && latest ? latest : undefined,
    changeFrequency: page.changeFrequency ?? ("monthly" as const),
    priority: page.priority ?? 0.7,
  }));
  return [
    ...pages,
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
