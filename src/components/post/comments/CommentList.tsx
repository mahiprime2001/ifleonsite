import React from 'react';
import { Comment } from './Comment';
import { SortOrder } from '../../../hooks/useComments';

interface Comment {
  id: number;
  content: string;
  publishedAt: string;
}

interface CommentListProps {
  comments: Comment[];
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, sortOrder, onSortChange }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};
