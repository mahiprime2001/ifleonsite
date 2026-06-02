import { useEffect, useState } from "react";
import { usePost } from "../hooks/usePost";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLikes } from "../hooks/useLikes";
import { useComments } from "../hooks/useComments";
import { BackButton } from "../components/post/BackButton";
import { PostHeader } from "../components/post/PostHeader";
import { PostMeta } from "../components/post/PostMeta";
import { PostRenderer } from "../components/post/PostRenderer";
import { PostSkeleton } from "../components/post/PostSkeleton";
import { NotFound } from "../components/post/NotFound";
import { CommentList } from "../components/post/comments/CommentList";
import { CommentForm } from "../components/post/comments/CommentForm";

/**
 * TEMP VIEW TRACKING (Frontend-only)
 * Later replace this with WordPress REST API
 */
const incrementPostView = (postId: string): number => {
  const viewedKey = `post_viewed_${postId}`;
  const countKey = `post_views_${postId}`;

  // Count only once per browser
  if (!localStorage.getItem(viewedKey)) {
    const current = Number(localStorage.getItem(countKey) || 0);
    localStorage.setItem(countKey, String(current + 1));
    localStorage.setItem(viewedKey, "true");
  }

  return Number(localStorage.getItem(countKey) || 0);
};

export const BlogPost = () => {
  const { post, loading } = usePost();
  useDocumentMeta({
    title: post ? `${post.title} | IFLEON Blog` : "Blog Post | IFLEON",
    description: post?.excerpt
      ? post.excerpt.replace(/<[^>]+>/g, "").slice(0, 160)
      : "Technical insights on AI, DevOps, and cloud engineering from IFLEON.",
    canonical: post ? `https://ifleon.com/blog/${post.slug}` : undefined,
  });

  // Likes & comments stay public
  const { likes, liked, handleLike } = useLikes(post?.id || null);

  useEffect(() => {
    if (!post) return;
    const id = "blogposting-jsonld";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "",
      "url": `https://ifleon.com/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": "https://ifleon.com",
      },
      "publisher": {
        "@type": "Organization",
        "name": "IFLEON",
        "url": "https://ifleon.com",
        "logo": { "@type": "ImageObject", "url": "https://ifleon.com/og-image.png" },
      },
      "image": "https://ifleon.com/og-image.png",
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://ifleon.com/blog/${post.slug}` },
    });
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, [post]);
  const { comments, addComment, setSortOrder, sortOrder } =
    useComments(post?.id || null);

  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (post) {
      window.scrollTo(0, 0);

      // 👀 Increment public view count
      const updatedViews = incrementPostView(post.id);
      setViews(updatedViews);
    }
  }, [post]);

  if (loading) return <PostSkeleton />;
  if (!post) return <NotFound />;

  return (
    <div className="relative min-h-screen bg-transparent pt-24 pb-20 text-foreground overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-2/10 blur-[120px]" />

      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 surface-card rounded-3xl">
        <BackButton />

        <PostHeader title={post.title} />

        <PostMeta
          author={post.author}
          publishedAt={post.publishedAt}
          likes={likes}
          liked={liked}
          onLike={handleLike}
          views={views} // ✅ NEW
        />

        <PostRenderer content={post.content} />

        <div className="mt-12">
          <CommentForm onSubmit={addComment} />
          <CommentList
            comments={comments}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
      </article>
    </div>
  );
};
