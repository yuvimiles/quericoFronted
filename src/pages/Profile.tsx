import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../services/user-service';
import postService, { PostWithAuthor } from '../services/post-service';
import authService from '../services/auth-service';
import { User } from '../types/user-type';
import PostCard from '../components/postCard';
import ProfileEditModal from './ProfileEdit';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>(); // מזהה המשתמש מה-URL
  const navigate = useNavigate();
  
  const currentUser = authService.getCurrentUser(); // מקבל את המשתמש המחובר
  const targetUserId = userId || currentUser?._id; // אם אין userId מה-URL, נשתמש במזהה המשתמש המחובר

  console.log("userId from URL:", userId);
  console.log("currentUser:", currentUser);
  console.log("targetUserId:", targetUserId);

  // אם המשתמש לא מחובר ואין targetUserId, נפנה אותו לדף הלוגין
  useEffect(() => {
    if (!targetUserId) {
      console.warn("No targetUserId found. Redirecting to login...");
      navigate('/login');
      return;
    }
    fetchProfileData();
    fetchPosts(1);
  }, [targetUserId, navigate]);

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { request } = userService.getUserProfile(targetUserId!); // הוספת ! כדי לציין שזה אף פעם לא undefined
      const userResponse = await request;
      setUser(userResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const { request } = postService.getUserPosts(targetUserId!);
      const response = await request;

      if (pageNumber === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }

      setHasMore(response.data.posts.length > 0 && posts.length + response.data.posts.length < response.data.total);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* פרטי המשתמש */}
      {user && (
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
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              {currentUser?._id === user._id && (
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
      )}

      {/* הפוסטים של המשתמש */}
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      {posts.length === 0 && !loading ? (
        <p className="text-gray-500 text-center">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => fetchPosts(page + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* מודל עריכת פרופיל */}
      {showEditModal && user && (
        <ProfileEditModal 
        user={user} 
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setShowEditModal(false);
      }} 
      onClose={() => setShowEditModal(false)} 
    />
    )}
    </div>
  );
};

export default Profile;
