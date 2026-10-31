"use client";

import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useLikes } from "../hooks/useLikes";
import { countView, type Post } from "../lib/api";
import { BackButton } from "../components/post/BackButton";
import { PostHeader } from "../components/post/PostHeader";
import { PostMeta } from "../components/post/PostMeta";
import { PostRenderer } from "../components/post/PostRenderer";

/* One blog post. Loaded on the server (app/blog/[slug]/page.tsx), so its text is in the HTML. */
export const BlogPost = ({ post }: { post: Post }) => {
  const { likes, liked, handleLike } = useLikes(String(post.id));

  useEffect(() => {
    countView(post.id);
  }, [post.id]);

  return (
    <div className="relative min-h-screen bg-slate-950 pt-24 pb-20 text-slate-100 overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl">
        <BackButton />

        {post.coverImageUrl && (
          // Cover images live on the dashboard; plain <img> keeps them out of Next's image optimizer.
          // eslint-disable-next-line @next/next/no-img-element
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
