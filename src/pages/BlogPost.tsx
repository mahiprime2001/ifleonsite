import { useEffect, useState } from "react";
import { usePost } from "../hooks/usePost";
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

  // Likes & comments stay public
  const { likes, liked, handleLike } = useLikes(post?.id || null);
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
