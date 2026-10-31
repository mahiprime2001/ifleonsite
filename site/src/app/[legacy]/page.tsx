import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPost } from "@/lib/content";

/*
 * WordPress served posts at /<slug>/. Google still has those URLs, so if the slug is a post here,
 * send it to /blog/<slug> with a permanent (308) redirect and the ranking carries over.
 * Fixed pages (/blog, /services, ...) take precedence over this catch-all.
 */
/* Only seen when the slug is not a post (real posts redirect before anything renders). */
export const metadata: Metadata = {
  title: { absolute: "Page not found | IFLEON" },
  robots: { index: false, follow: true },
};

export default async function LegacyPostRedirect({ params }: PageProps<"/[legacy]">) {
  const slug = (await params).legacy.toLowerCase();
  if (!/^[a-z0-9-]{1,200}$/.test(slug)) notFound();
  const post = await getPost(slug);
  if (!post) notFound();
  permanentRedirect(`/blog/${post.slug}`);
}
