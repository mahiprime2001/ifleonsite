import { useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Search, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import he from 'he';

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most-liked'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const postsPerPage = 9;

  // Smooth page change handler
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === currentPage) return;
    
    setIsTransitioning(true);
    
    // Scroll to top and trigger transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update page after transition starts
    requestAnimationFrame(() => {
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsTransitioning(false);
      }, 250);
    });
  }, [currentPage]);

  // Scroll to top on page change
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            IFLEON Tech Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Technical insights, project updates, and source code from our AI, DevOps, and IT
            consulting work. All code examples are available on our GitHub repository.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 bg-white cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most-liked">Most Liked</option>
            </select>
          </div>
        </div>

        {/* Posts Grid with Smooth Transition */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out transform-gpu ${
            isTransitioning 
              ? 'opacity-0 scale-[0.98] blur-sm translate-y-2' 
              : 'opacity-100 scale-100 blur-none translate-y-0'
          }`}
        >
          {currentPosts.map((post, index) => (
            <article 
              key={`${post.id}-${currentPage}-${index}`} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-2 group"
              style={{ 
                transitionDelay: isTransitioning ? '0ms' : `${index * 75}ms`,
                opacity: isTransitioning ? 0 : 1
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                    <span>{getLikes(post.id)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-all duration-200 line-clamp-2 group-hover:line-clamp-none">
                  <Link to={`/blog/${post.slug}`} className="block hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <div className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  <div 
                    className="line-clamp-2" 
                    dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-all duration-200"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                    <i className="fa-solid fa-comment"></i>
                    <span>{getCommentCount(post.id)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Loading overlay during transition */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Pagination with Enhanced Transitions */}
        <div className="mt-16 flex justify-center">
          <nav className={`flex items-center space-x-2 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-50 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
          }`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:scale-[0.98] shadow-sm font-medium min-w-[80px]"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isTransitioning}
                className={`px-4 py-2.5 border font-medium rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:scale-[0.98] shadow-sm min-w-[44px] ${
                  currentPage === page 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-blue-500/25 shadow-md' 
                    : 'text-gray-700 hover:bg-gray-50 hover:border-gray-400 border-gray-300 hover:shadow-md bg-white/80'
                } ${isTransitioning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isTransitioning}
              className="px-4 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:scale-[0.98] shadow-sm font-medium min-w-[80px]"
            >
              Next
            </button>
          </nav>
        </div>

        {/* Page info */}
        {totalPages > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, sortedPosts.length)} of {sortedPosts.length} posts
          </div>
        )}
      </div>
    </div>
  );
};
