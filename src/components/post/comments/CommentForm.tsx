import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    onSubmit(content);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="font-display text-xl font-bold mb-4 text-foreground">Leave a Comment</h3>
      <div className="relative">
        <label htmlFor="content" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-foreground placeholder:text-muted-foreground sm:text-sm pr-16"
          placeholder="Add a comment..."
          required
        />
        <button
          type="submit"
          className="absolute bottom-2 right-2 inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </form>
  );
};
