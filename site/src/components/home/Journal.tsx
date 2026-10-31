"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import type { PostSummary } from "@/lib/api";
import { formatLongDate } from "@/lib/format";
import { EASE, SectionHeading } from "./SectionHeading";

/* The three newest posts from the dashboard: one featured, two stacked beside it. */
export function Journal({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;

  return (
    <section className="py-24 md:py-36">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="From the journal"
            title={
              <>
                Notes from the <em className="text-brand-700">engineering</em> desk.
              </>
            }
          />
          <Link to="/blog" className="link-arrow group shrink-0">
            All articles
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <PostCard post={lead} featured delay={0} />
          <div className="grid gap-6">
            {rest.map((post, i) => (
              <PostCard key={post.id} post={post} delay={0.1 * (i + 1)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, featured, delay }: { post: PostSummary; featured?: boolean; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="h-full"
    >
      <Link
        to={`/blog/${post.slug}`}
        className={`group flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:p-9 ${
          featured ? "min-h-[22rem] bg-brand-900 text-paper" : "border border-line bg-white"
        }`}
      >
        <div>
          <p className={`font-mono text-[0.68rem] uppercase tracking-[0.18em] ${featured ? "text-brand-300" : "text-ink-3"}`}>
            {formatLongDate(post.publishedAt)}
            {post.tags[0] ? ` · ${post.tags[0]}` : ""}
          </p>
          <h3
            className={`mt-4 font-serif font-normal leading-tight tracking-[-0.015em] ${
              featured ? "text-3xl text-paper md:text-[2.6rem]" : "text-2xl"
            }`}
          >
            {post.title}
          </h3>
          <p className={`mt-4 line-clamp-3 leading-relaxed ${featured ? "text-brand-100/80" : "text-ink-2"}`}>{post.excerpt}</p>
        </div>
        <span className={`mt-8 inline-flex items-center gap-1.5 text-sm font-semibold ${featured ? "text-paper" : "text-brand-700"}`}>
          Read the article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.article>
  );
}
