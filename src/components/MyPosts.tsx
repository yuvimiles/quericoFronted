import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService, { PostWithAuthor } from '../services/post-service';
import authService from '../services/auth-service';
import PostCard from '../components/postCard';
import CreatePost from '../components/createPost';

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    fetchPosts();
  }, [navigate, currentUser]);
  
  const fetchPosts = async (pageNumber: number = 1) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { request } = postService.getUserPosts(currentUser._id, pageNumber);
      const response = await request;
      
      const { posts: newPosts, total } = response.data;
      
      if (pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(posts.length + newPosts.length < total);
      setPage(pageNumber);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePostCreated = (newPost: PostWithAuthor) => {
    setPosts(prev => [newPost, ...prev]);
  };
  
  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };
  
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Posts</h1>
      
      <CreatePost onPostCreated={handlePostCreated} />
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      
      {posts.length === 0 && !loading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">You haven't created any posts yet. Create your first post above!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onDeletePost={handlePostDeleted} 
            />
          ))}
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPosts;