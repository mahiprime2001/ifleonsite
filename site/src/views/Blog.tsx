"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Eye, Search } from "lucide-react";
import { IntroFacts, PageIntro } from "../components/PageIntro";
import { Link } from "@/lib/router";
import type { PostSummary } from "../lib/api";
import { formatShortDate } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;
const PAGE = 12;

type Sort = "newest" | "oldest" | "popular";

/* The journal: search, topic chips and sort; newest article featured; more load on demand. */
export const Blog = ({ posts }: { posts: PostSummary[] }) => {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [limit, setLimit] = useState(PAGE);

  // The 12 most used topics, as quick filters.
  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))),
    );
    return [...list].sort((a, b) =>
      sort === "popular"
        ? b.viewCount - a.viewCount
        : sort === "oldest"
          ? a.publishedAt.localeCompare(b.publishedAt)
          : b.publishedAt.localeCompare(a.publishedAt),
    );
  }, [posts, query, tag, sort]);

  const browsing = !query && !tag && sort === "newest";
  const featured = browsing ? filtered[0] : undefined;
  const rest = browsing ? filtered.slice(1) : filtered;
  const visible = rest.slice(0, limit);
  const reset = () => setLimit(PAGE);

  return (
    <>
      <PageIntro
        eyebrow="Journal"
        title={
          <>
            Notes from the <em className="text-brand-700">engineering</em> desk.
          </>
        }
        intro="Practical guides and deep dives on AI, DevOps, cloud and security, written from real project work."
        aside={
          <IntroFacts
            items={[
              { value: posts.length, label: "Articles" },
              { value: new Set(posts.flatMap((p) => p.tags)).size, label: "Topics" },
            ]}
          />
        }
      />

      {/* Controls */}
      <section className="pb-10">
        <div className="shell">
          <div className="flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search articles</span>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  reset();
                }}
                placeholder="Search by title, topic or keyword"
                className="w-full border-0 bg-transparent py-2 pl-7 pr-2 text-lg text-ink placeholder:text-ink-4 focus:outline-none focus:ring-0"
              />
            </label>
            <div className="flex items-center gap-1 self-start rounded-full border border-line bg-white p-1 md:self-auto" role="radiogroup" aria-label="Sort articles">
              {(
                [
                  ["newest", "Newest"],
                  ["popular", "Most read"],
                  ["oldest", "Oldest"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="radio"
                  aria-checked={sort === key}
                  onClick={() => {
                    setSort(key);
                    reset();
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    sort === key ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {[null, ...topTags].map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t ?? "all"}
                  onClick={() => {
                    setTag(t);
                    reset();
                  }}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                    active ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong bg-white text-ink-2 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {t ? `#${t}` : "All topics"}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="shell">
          {featured && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <Link
                to={`/blog/${featured.slug}`}
                className="group mb-10 grid overflow-hidden rounded-[1.75rem] bg-brand-900 text-paper shadow-lift md:grid-cols-[1.4fr_1fr]"
              >
                <div className="p-8 md:p-12">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-brand-300">
                    Latest · {formatShortDate(featured.publishedAt)}
                  </p>
                  <h2 className="mt-5 font-serif text-3xl font-normal leading-tight text-paper md:text-5xl">{featured.title}</h2>
                  <p className="mt-5 line-clamp-3 max-w-xl leading-relaxed text-brand-100/80">{featured.excerpt}</p>
                  <span className="mt-8 inline-flex items-center gap-1.5 font-semibold">
                    Read the article
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="relative hidden border-l border-white/10 md:block">
                  <div aria-hidden className="absolute inset-0 iso-grid-bg opacity-[0.12] invert" />
                  <svg
                    viewBox="0 0 200 200"
                    aria-hidden
                    className="absolute inset-[18%] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105"
                  >
                    <circle cx="82" cy="100" r="52" fill="none" stroke="#FAF8F4" strokeOpacity="0.8" strokeWidth="2" />
                    <circle cx="118" cy="100" r="52" fill="none" stroke="#84B699" strokeWidth="2" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          )}

          {visible.length === 0 && !featured ? (
            <div className="border-y border-line py-20 text-center">
              <p className="font-serif text-2xl">No articles match that.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setTag(null);
                  setSort("newest");
                }}
                className="link-arrow mt-4"
              >
                Clear the filters
              </button>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {visible.map((post, i) => (
                  <motion.li
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: (i % PAGE) * 0.03, ease: EASE }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <p className="flex items-center justify-between gap-3 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-3">
                        <span>{formatShortDate(post.publishedAt)}</span>
                        {post.tags[0] && <span className="truncate text-brand-700">#{post.tags[0]}</span>}
                      </p>
                      <h2 className="mt-4 font-serif text-2xl font-normal leading-snug transition-colors group-hover:text-brand-700">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-2">{post.excerpt}</p>
                      <span className="mt-auto flex items-center justify-between pt-6 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                          Read
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                        {post.viewCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-ink-3">
                            <Eye className="h-3.5 w-3.5" />
                            {post.viewCount}
                          </span>
                        )}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {rest.length > visible.length && (
            <div className="mt-14 flex flex-col items-center gap-3">
              <button onClick={() => setLimit((l) => l + PAGE)} className="btn-secondary">
                Load more articles
              </button>
              <p className="text-sm text-ink-3">
                Showing {visible.length + (featured ? 1 : 0)} of {filtered.length}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
