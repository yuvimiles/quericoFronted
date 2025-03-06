import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../services/user-service';
import postService, { PostWithAuthor } from '../services/post-service';
import authService from '../services/auth-service';
import { User } from '../types/user-type';
import PostCard from '../components/postCard';
import ProfileEditModal from './ProfileEdit';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  
  const currentUser = authService.getCurrentUser();
  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);
  const targetUserId = userId || (currentUser?._id as string);
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  useEffect(() => {
    if (!targetUserId) {
      navigate('/login');
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const { request: userRequest } = userService.getUserProfile(targetUserId);
        const userResponse = await userRequest;
        setUser(userResponse.data);
        
        // Fetch user posts
        const { request: postsRequest } = postService.getUserPosts(targetUserId);
        const postsResponse = await postsRequest;
        setPosts(postsResponse.data.posts);
        setHasMore(postsResponse.data.posts.length < postsResponse.data.total);
      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [targetUserId, navigate]);
  
  const handleLoadMore = async () => {
    if (!targetUserId || loading || !hasMore) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      
      const { request } = postService.getUserPosts(targetUserId, nextPage);
      const response = await request;
      
      setPosts(prev => [...prev, ...response.data.posts]);
      setHasMore(posts.length + response.data.posts.length < response.data.total);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };
  
  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setShowEditModal(false);
  };
  
  if (loading && !user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div className="p-6 relative">
          <div className="absolute -top-16 left-6">
            <img 
              src={user.profileImage || '/default-avatar.jpg'} 
              alt={user.username} 
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          </div>
          
          <div className="ml-36">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        
        {posts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No posts yet.</p>
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
      
      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal 
          user={user} 
          onSave={handleProfileUpdate} 
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </div>
  );
};

export default Profile;