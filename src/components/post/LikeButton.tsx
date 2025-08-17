import { Heart } from "lucide-react";

interface LikeButtonProps {
  onClick: () => void;
  liked: boolean;
  likes: number;
}

export const LikeButton = ({ onClick, liked, likes }: LikeButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-600"
  >
    <Heart
      className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
    />
    <span>{likes}</span>
  </button>
);
