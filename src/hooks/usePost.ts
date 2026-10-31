import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPost, getPreloaded, type Post } from "../lib/api";

/* The post for the current /blog/:slug route, from the prerendered page's data or the dashboard API. */
export const usePost = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(() => {
    const preloaded = getPreloaded().post;
    return preloaded?.slug === slug ? preloaded : null;
  });
  const [loading, setLoading] = useState(post === null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (post?.slug === slug) return;
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetchPost(slug, controller.signal)
      .then((found) => {
        setPost(found);
        setLoading(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load the post:", error);
        setPost(null);
        setFailed(true);
        setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the slug changes
  }, [slug]);

  return { post, loading, failed };
};
