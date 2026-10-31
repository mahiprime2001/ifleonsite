import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { jsonLd, ORGANIZATION, pageMetadata, SITE_URL } from "@/lib/seo";
import { Blog } from "@/views/Blog";

export const revalidate = 60; // seconds; keep in step with REVALIDATE_SECONDS in lib/content.ts
export const metadata: Metadata = pageMetadata("/blog");

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "IFLEON Tech Blog",
          url: `${SITE_URL}/blog`,
          publisher: ORGANIZATION,
        })}
      />
      <Blog posts={posts} />
    </>
  );
}
