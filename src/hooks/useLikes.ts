import { useState, useEffect } from "react";

export const useLikes = (postId: string | null) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!postId) return;
    const storedLikes = localStorage.getItem(`likes-${postId}`);
    const storedLiked = localStorage.getItem(`liked-${postId}`);
    if (storedLikes) setLikes(parseInt(storedLikes, 10));
    if (storedLiked === "true") setLiked(true);
  }, [postId]);

  const handleLike = () => {
    if (!postId || liked) return;
    const nextLikes = likes + 1;
    setLikes(nextLikes);
    setLiked(true);
    localStorage.setItem(`likes-${postId}`, String(nextLikes));
    localStorage.setItem(`liked-${postId}`, "true");
  };

  return { likes, liked, handleLike };
};
