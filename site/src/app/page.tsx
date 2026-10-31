import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Founder } from "@/components/home/Founder";
import { Journal } from "@/components/home/Journal";
import { Marquee } from "@/components/home/Marquee";
import { Numbers } from "@/components/home/Numbers";
import { Practice } from "@/components/home/Practice";
import { Process } from "@/components/home/Process";
import { Voices } from "@/components/home/Voices";
import { Work } from "@/components/home/Work";
import { getPosts, getTestimonials } from "@/lib/content";
import { jsonLd, ORGANIZATION, pageMetadata } from "@/lib/seo";

export const revalidate = 60; // seconds; keep in step with REVALIDATE_SECONDS in lib/content.ts
export const metadata: Metadata = pageMetadata("/");

export default async function HomePage() {
  const [testimonials, posts] = await Promise.all([getTestimonials(), getPosts()]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ "@context": "https://schema.org", ...ORGANIZATION })} />
      <Hero />
      <Marquee />
      <Practice />
      <Process />
      <Work />
      <Numbers articles={posts.length} />
      <Founder />
      <Voices testimonials={testimonials} />
      <Journal posts={posts.slice(0, 3)} />
      <Contact />
    </>
  );
}
