import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { LikeButton } from "./LikeButton";

interface PostMetaProps {
  author: string;
  publishedAt: string;
  likes: number;
  liked: boolean;
  onLike: () => void;
}

export const PostMeta = ({
  author,
  publishedAt,
  likes,
  liked,
  onLike,
}: PostMetaProps) => (
  <div className="flex flex-wrap items-center gap-6 mb-6">
    <div className="flex items-center space-x-2 text-gray-600">
      <User className="h-5 w-5" />
      <span>{author}</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-600">
      <Calendar className="h-5 w-5" />
      <span>{format(new Date(publishedAt), "MMMM dd, yyyy")}</span>
    </div>
    <LikeButton onClick={onLike} liked={liked} likes={likes} />
  </div>
);
