"use client";

import { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Search, Heart, Eye } from 'lucide-react';
import { Link } from "@/lib/router";
import { formatShortDate } from '@/lib/format';
import { motion } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { MagnetCard } from '../components/animations/MagnetCard';
import type { PostSummary } from '../lib/api';

/* The post list is loaded on the server (lib/content.ts) and passed in. */
export const Blog = ({ posts }: { posts: PostSummary[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most-liked'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const postsPerPage = 9;

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === currentPage) return;
    setIsTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => {
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsTransitioning(false);
      }, 250);
    });
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage]);

  // Likes live in this browser only, so they're read after hydration (the server can't know them).
  const [likes, setLikes] = useState<Record<number, number>>({});
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after hydration
    setLikes(Object.fromEntries(posts.map((p) => [p.id, parseInt(localStorage.getItem(`likes-${p.id}`) || '0', 10)])));
  }, [posts]);

  const getLikes = (id: number) => likes[id] ?? 0;

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case 'most-liked':
        return getLikes(b.id) - getLikes(a.id);
      case 'newest':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();

  return (
    <div className="bg-paper min-h-screen">
      <PageHero
        eyebrow="Tech Blog"
        title="Insights from"
        highlight="our engineering desk"
        description="Technical deep dives, project updates, and source code from our AI, DevOps, and IT consulting work — all examples available on our GitHub."
      />

      <section className="relative py-12 md:py-16 bg-gradient-to-b from-paper via-paper-2 to-paper overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark w-full pl-11"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="input-dark cursor-pointer md:w-44 md:flex-none"
            >
              <option value="" className="bg-paper">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-paper">
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'most-liked')}
              className="input-dark cursor-pointer md:w-44 md:flex-none"
            >
              <option value="newest" className="bg-paper">Newest</option>
              <option value="oldest" className="bg-paper">Oldest</option>
              <option value="most-liked" className="bg-paper">Most Liked</option>
            </select>
          </div>

          {posts.length === 0 && (
            <p className="text-center text-ink-3 py-16">No articles yet. Check back soon.</p>
          )}

          {/* Posts Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
              isTransitioning
                ? 'opacity-0 scale-[0.98] blur-sm translate-y-2'
                : 'opacity-100 scale-100 blur-none translate-y-0'
            }`}
          >
            {currentPosts.map((post, index) => (
              <motion.article
                key={`${post.id}-${currentPage}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <MagnetCard
                  intensity={5}
                  className="h-full bg-white border border-line backdrop-blur-md rounded-2xl hover:bg-paper-2 hover:border-brand-600/40 transition-all"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 text-xs text-ink-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatShortDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                        <span>{getLikes(post.id)}</span>
                      </div>
                    </div>

                    <Link to={`/blog/${post.slug}`} className="block group">
                      <h3 className="text-lg font-bold text-ink mb-3 group-hover:text-brand-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-ink-2 mb-6 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-line">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-brand-700 hover:text-brand-700 font-semibold text-sm flex items-center gap-1.5 group"
                      >
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <div className="flex items-center gap-1.5 text-ink-3 text-xs">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{post.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </MagnetCard>
              </motion.article>
            ))}
          </div>

          {isTransitioning && (
            <div className="fixed inset-0 bg-paper/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-brand-600/30 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2 p-2 rounded-xl bg-white border border-line backdrop-blur-md">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-2 transition"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={isTransitioning}
                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg'
                        : 'text-ink hover:bg-paper-2'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isTransitioning}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-paper-2 transition"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {totalPages > 0 && (
            <div className="mt-6 text-center text-sm text-ink-3">
              Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, sortedPosts.length)} of {sortedPosts.length} posts
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
