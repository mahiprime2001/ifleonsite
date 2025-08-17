import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import he from "he";

// (interfaces and cleanMarkdown function would be here)
// To keep this concise, let's assume they are defined elsewhere
// and imported, or defined directly in this file.

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
  _embedded?: { author?: WPAuthor[] };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  slug: string;
}


export const usePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://ifleon.com/wp-json/wp/v2/posts?_embed&acf_format=standard`
        );
        const data: WPPost[] = await res.json();

        const current = data.find((p) => p.slug === slug);
        if (!current) {
          setPost(null);
        } else {
          setPost({
            id: String(current.id),
            title: he.decode(current.title?.rendered || "Untitled"),
            excerpt: current.excerpt?.rendered || "",
            content: current.content?.rendered || "",
            author: current._embedded?.author?.[0]?.name || "Author",
            publishedAt: current.date,
            tags: current.tags?.map((id) => `tag-${id}`) || [],
            slug: current.slug,
          });
        }
      } catch (e) {
        console.error("Failed to load blog data:", e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  return { post, loading };
};
