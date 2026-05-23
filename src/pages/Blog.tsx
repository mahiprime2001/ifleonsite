import { useState, useEffect, useCallback } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Calendar, ArrowRight, Search, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import he from 'he';
import { motion } from 'framer-motion';
import { PageHero } from '../components/PageHero';
import { MagnetCard } from '../components/animations/MagnetCard';

interface WPAuthor {
  name: string;
}

interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
  };
  acf?: {
    featured_post?: boolean;
    github_link?: string;
    demo_link?: string;
  };
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
  slug: string;
}

export const Blog = () => {
  useDocumentMeta({
    title: "IFLEON Tech Blog — AI, DevOps & Cloud Insights",
    description: "Technical deep-dives, project walkthroughs, and engineering insights on AI/ML, DevOps, cloud infrastructure, cybersecurity, and software development from the IFLEON team.",
    canonical: "https://ifleon.com/blog",
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const perPage = 100;
        const firstPageUrl = `https://ifleon.com/wp-json/wp/v2/posts?_embed&acf_format=standard&per_page=${perPage}&page=1`;
        const firstPageRes = await fetch(firstPageUrl);
        const totalPages = parseInt(firstPageRes.headers.get('X-WP-TotalPages') || '1', 10);
        const firstPageData: WPPost[] = await firstPageRes.json();

        let allPosts: WPPost[] = [...firstPageData];

        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            const pageUrl = `https://ifleon.com/wp-json/wp/v2/posts?_embed&acf_format=standard&per_page=${perPage}&page=${page}`;
            pagePromises.push(fetch(pageUrl).then((res) => res.json()));
          }
          const extraPagesData = await Promise.all(pagePromises);
          allPosts = allPosts.concat(...extraPagesData);
        }

        const formatted: BlogPost[] = allPosts.map((post) => ({
          id: post.id.toString(),
          title: he.decode(post.title.rendered),
          excerpt: he.decode(post.excerpt.rendered),
          content: he.decode(post.content.rendered),
          author: post._embedded?.author?.[0]?.name || 'Author',
          publishedAt: post.date,
          tags: post.tags?.map((id) => `tag-${id}`) || [],
          githubLink: post.acf?.github_link || '',
          demoLink: post.acf?.demo_link || '',
          featured: post.acf?.featured_post || false,
          slug: post.slug,
        }));

        setPosts((currentPosts) => {
          const postMap = new Map(currentPosts.map((p) => [p.id, p]));
          formatted.forEach((p) => postMap.set(p.id, p));
          return Array.from(postMap.values());
        });
      } catch (err) {
        console.error('Failed to load blog data', err);
      }
    };

    fetchPosts();
    const intervalId = setInterval(fetchPosts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getLikes = (id: string) => parseInt(localStorage.getItem(`likes-${id}`) || '0');

  const getCommentCount = (id: string) => {
    const comments = localStorage.getItem(`comments-${id}`);
    return comments ? JSON.parse(comments).length : 0;
  };

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
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  return (
    <div className="bg-slate-950 min-h-screen">
      <PageHero
        eyebrow="Tech Blog"
        title="Insights from"
        highlight="our engineering desk"
        description="Technical deep dives, project updates, and source code from our AI, DevOps, and IT consulting work — all examples available on our GitHub."
      />

      <section className="relative py-12 md:py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-10 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
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
              className="input-dark cursor-pointer min-w-[160px]"
            >
              <option value="" className="bg-slate-900">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-slate-900">
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'most-liked')}
              className="input-dark cursor-pointer min-w-[160px]"
            >
              <option value="newest" className="bg-slate-900">Newest</option>
              <option value="oldest" className="bg-slate-900">Oldest</option>
              <option value="most-liked" className="bg-slate-900">Most Liked</option>
            </select>
          </div>

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
                  className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                        <span>{getLikes(post.id)}</span>
                      </div>
                    </div>

                    <Link to={`/blog/${post.slug}`} className="block group">
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <div
                      className="text-sm text-slate-300 mb-6 leading-relaxed line-clamp-3 flex-1"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center gap-1.5 group"
                      >
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{getCommentCount(post.id)}</span>
                      </div>
                    </div>
                  </div>
                </MagnetCard>
              </motion.article>
            ))}
          </div>

          {isTransitioning && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
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
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isTransitioning}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {totalPages > 0 && (
            <div className="mt-6 text-center text-sm text-slate-400">
              Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, sortedPosts.length)} of {sortedPosts.length} posts
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
