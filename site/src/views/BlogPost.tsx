"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router";
import { countView, type Post } from "../lib/api";
import { formatLongDate } from "../lib/format";
import { PostRenderer } from "../components/post/PostRenderer";
import { PageCta } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

/* One article, set for reading: a single centred column with a reading-progress rule on top. */
export const BlogPost = ({ post }: { post: Post }) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    countView(post.id);
  }, [post.id]);

  return (
    <>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-brand-600" />

      <article className="pb-8 pt-32 md:pt-40">
        <header className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <Link to="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-ink-3 hover:text-ink">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Journal
            </Link>
            {post.tags.length > 0 && (
              <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-brand-700">
                {post.tags.slice(0, 3).map((t) => `#${t}`).join("  ")}
              </p>
            )}
          </motion.div>

          <h1 className="mt-5 overflow-hidden pb-[0.08em] font-serif text-[2.4rem] font-normal leading-[1.08] tracking-tightest sm:text-5xl md:text-6xl">
            <motion.span
              className="block"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              {post.title}
            </motion.span>
          </h1>

          {post.excerpt && (
            <motion.p
              className="mt-6 text-xl leading-relaxed text-ink-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            >
              {post.excerpt}
            </motion.p>
          )}

          <motion.dl
            className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {[
              { label: "By", value: post.authorName || "IFLEON" },
              { label: "Published", value: formatLongDate(post.publishedAt) },
              { label: "Read", value: `${post.readingMinutes} min` },
              ...(post.viewCount > 0 ? [{ label: "Views", value: String(post.viewCount) }] : []),
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-2">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-3">{item.label}</dt>
                <dd className="font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </header>

        {post.coverImageUrl && (
          <motion.div
            className="mx-auto mt-12 max-w-5xl px-5 sm:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            {/* Cover images live on the dashboard; plain <img> keeps them out of Next's image optimizer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt="" className="aspect-[2/1] w-full rounded-[1.5rem] object-cover shadow-lift" />
          </motion.div>
        )}

        <div className="mx-auto mt-12 max-w-3xl px-5 sm:px-8">
          <PostRenderer html={post.contentHtml} />

          {post.tags.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full border border-line-strong bg-white px-3 py-1 text-sm text-ink-2">
                  #{t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <PageCta
        title={
          <>
            Want this done <em className="text-brand-300">for you?</em>
          </>
        }
        text="We build and run systems like the one in this article. The first consultation is free."
      />
    </>
  );
};
