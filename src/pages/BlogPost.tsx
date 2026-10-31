import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useLikes } from "../hooks/useLikes";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { countView } from "../lib/api";
import { BackButton } from "../components/post/BackButton";
import { PostHeader } from "../components/post/PostHeader";
import { PostMeta } from "../components/post/PostMeta";
import { PostRenderer } from "../components/post/PostRenderer";
import { PostSkeleton } from "../components/post/PostSkeleton";
import { NotFound } from "../components/post/NotFound";

export const BlogPost = () => {
  const { post, loading, failed } = usePost();
  const { likes, liked, handleLike } = useLikes(post ? String(post.id) : null);

  useDocumentMeta({
    title: post ? `${post.seoTitle} | IFLEON Blog` : undefined,
    description: post?.seoDescription || undefined,
    canonical: post ? `https://ifleon.com/blog/${post.slug}` : undefined,
    image: post?.coverImageUrl || undefined,
  });

  const postId = post?.id;
  useEffect(() => {
    if (postId) countView(postId);
  }, [postId]);

  if (loading) return <PostSkeleton />;
  if (failed) {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 text-center text-slate-200">
        <p className="mb-4">This post couldn't be loaded right now.</p>
        <button onClick={() => window.location.reload()} className="text-emerald-400 hover:text-emerald-300 mr-6">
          Try again
        </button>
        <Link to="/blog" className="text-emerald-400 hover:text-emerald-300">
          ← Back to Blog
        </Link>
      </div>
    );
  }
  if (!post) return <NotFound />;

  return (
    <div className="relative min-h-screen bg-slate-950 pt-24 pb-20 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl">
        <BackButton />

        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt=""
            className="w-full aspect-[2/1] object-cover rounded-2xl mb-8 border border-white/10"
          />
        )}

        <PostHeader title={post.title} />

        <PostMeta
          author={post.authorName || "IFLEON"}
          publishedAt={post.publishedAt}
          likes={likes}
          liked={liked}
          onLike={handleLike}
          views={post.viewCount}
        />

        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400 mr-2">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMinutes} min read
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        <PostRenderer html={post.contentHtml} />
      </article>
    </div>
  );
};
