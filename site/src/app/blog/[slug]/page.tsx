import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getPost } from "@/lib/content";
import { DEFAULT_IMAGE, jsonLd, ORGANIZATION, SITE_URL } from "@/lib/seo";
import { BlogPost } from "@/views/BlogPost";

export const revalidate = 60; // seconds; keep in step with REVALIDATE_SECONDS in lib/content.ts

/* One fetch per request, shared by generateMetadata and the page. */
const loadPost = cache(getPost);

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { title: "Post not found | IFLEON Blog", robots: { index: false, follow: true } };

  const title = `${post.seoTitle} | IFLEON Blog`;
  const description = post.seoDescription || post.excerpt;
  const image = post.coverImageUrl || DEFAULT_IMAGE;
  return {
    title: { absolute: title },
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      images: [image],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: { card: post.coverImageUrl ? "summary_large_image" : "summary", title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title.slice(0, 110),
          description: post.seoDescription || post.excerpt,
          image: [post.coverImageUrl || DEFAULT_IMAGE],
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: post.authorName || "IFLEON", url: `${SITE_URL}/` },
          publisher: ORGANIZATION,
          mainEntityOfPage: url,
          keywords: post.tags.join(", "),
        })}
      />
      <BlogPost post={post} />
    </>
  );
}
