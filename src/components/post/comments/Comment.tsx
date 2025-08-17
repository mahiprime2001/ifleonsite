import React from 'react';

interface CommentProps {
  content: string;
  publishedAt: string;
}

export const Comment: React.FC<CommentProps> = ({ content, publishedAt }) => {
  return (
    <li className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center mb-2">
        <p className="text-xs text-gray-500">{new Date(publishedAt).toLocaleString()}</p>
      </div>
      <p className="text-gray-700">{content}</p>
    </li>
  );
};
