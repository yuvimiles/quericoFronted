import React, { useState } from 'react';
import postService from '../services/post-service';
import { ICommentWithAuthor } from '../types/user-type';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: ICommentWithAuthor) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { request } = postService.addComment(postId, text.trim());
      const response = await request;
      
      // Transform the response if needed to match ICommentWithAuthor
      const commentData = response.data;
      
      setText('');
      // Pass the data to the parent component
      onCommentAdded(commentData);
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mb-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;