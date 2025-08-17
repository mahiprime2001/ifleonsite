import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { useLikes } from "../hooks/useLikes";
import { useComments } from "../hooks/useComments";
import { BackButton } from "./post/BackButton";
import { PostHeader } from "./post/PostHeader";
import { PostMeta } from "./post/PostMeta";
import { PostRenderer } from "./post/PostRenderer";
import { PostSkeleton } from "./post/PostSkeleton";
import { NotFound } from "./post/NotFound";
import { CommentList } from "./post/comments/CommentList";
import { CommentForm } from "./post/comments/CommentForm";

export const BlogPost = () => {
  const { post, loading } = usePost();
  const { likes, liked, handleLike } = useLikes(post?.id || null);
  const { comments, addComment, setSortOrder, sortOrder } = useComments(post?.id || null);

  useEffect(() => {
    if (post) {
      window.scrollTo(0, 0);
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
        />
        <PostRenderer content={post.content} />
        <div className="mt-12">
          <CommentForm onSubmit={addComment} />
          <CommentList comments={comments} sortOrder={sortOrder} onSortChange={setSortOrder} />
        </div>
      </article>
    </div>
  );
};
