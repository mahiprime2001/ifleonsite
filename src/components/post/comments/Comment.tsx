import React from 'react';

interface CommentProps {
  content: string;
  publishedAt: string;
}

export const Comment: React.FC<CommentProps> = ({ content, publishedAt }) => {
  return (
    <li className="surface-card p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <p className="text-xs text-muted-foreground">{new Date(publishedAt).toLocaleString()}</p>
      </div>
      <p className="text-foreground">{content}</p>
    </li>
  );
};
