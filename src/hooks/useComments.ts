import { useState, useEffect, useMemo } from 'react';

interface Comment {
  id: number;
  content: string;
  publishedAt: string;
}

export type SortOrder = 'newest' | 'oldest';

export const useComments = (postId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  useEffect(() => {
    if (!postId) return;
    const storedComments = localStorage.getItem(`comments-${postId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [postId]);

  const addComment = (content: string) => {
    if (!postId) return;
    const newComment: Comment = {
      content,
      id: Date.now(),
      publishedAt: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortOrder]);

  return { comments: sortedComments, addComment, setSortOrder, sortOrder };
};
