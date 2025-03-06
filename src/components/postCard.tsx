import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { PostWithAuthor } from '../services/post-service';
import postService from '../services/post-service';
import authService from '../services/auth-service';

interface PostCardProps {
  post: PostWithAuthor;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (post: PostWithAuthor) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDeletePost, onUpdatePost }) => {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    const currentUser = authService.getCurrentUser();
    return currentUser ? post.likes.includes(currentUser._id) : false;
  });
  
  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const currentUser = authService.getCurrentUser();
  const isAuthor = currentUser && post.author._id === currentUser._id;
  
  const formatDate = (date: Date): string => {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true
    });
  };
  
  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const { request } = postService.unlikePost(post._id);
        await request;
        setLikesCount(prev => prev - 1);
      } else {
        const { request } = postService.likePost(post._id);
        await request;
        setLikesCount(prev => prev + 1);
      }
      
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        const { request } = postService.deletePost(post._id);
        await request;
        
        if (onDeletePost) {
          onDeletePost(post._id);
        }
      } catch (error) {
        console.error("Error deleting post", error);
        alert('An error occurred while deleting the post');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Post header with user details */}
      <div className="flex items-center p-4 border-b">
        <Link to={`/profile/${post.author._id}`}>
          <img 
            src={post.author.profileImage || '/default-avatar.jpg'} 
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        </Link>
        
        <div className="flex-1">
          <Link 
            to={`/profile/${post.author._id}`}
            className="font-medium text-gray-900 hover:underline"
          >
            {post.author.username}
          </Link>
          <div className="text-gray-500 text-sm">
            {formatDate(post.createdAt)}
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex space-x-2">
            <Link 
              to={`/edit-post/${post._id}`}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Post content */}
      <div className="p-4">
        <p className="text-gray-800 whitespace-pre-line mb-4">{post.text}</p>
        
        {post.image && (
          <div className="mt-2 mb-4">
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full h-auto rounded-lg max-h-96 object-cover"
            />
          </div>
        )}
        
        {/* Likes and comments */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <div className="flex space-x-4">
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center space-x-1 ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="ml-1">{likesCount}</span>
            </button>
            
            <Link 
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">{post.comments.length}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;