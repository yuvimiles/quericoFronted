import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Button, Typography, Card, Avatar, Alert } from '@mui/material';
import userService from '../services/user-service';
import postService, { PostWithAuthor } from '../services/post-service';
import authService from '../services/auth-service';
import { User } from '../types/user-type';
import PostCard from '../components/postCard';
import ProfileEditModal from './ProfileEdit';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser(); // Get the current user from localStorage or authService
  const targetUserId = currentUser?.id;

  useEffect(() => {
    setUser(currentUser)
    console.log(currentUser);
    if (!targetUserId) {
      navigate('/login');
      return;
    }
    // fetchPosts(1);
  }, [targetUserId, navigate]);

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
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 4 }}>
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
      
      {/* User Profile */}
      {user && (
        <Card sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', mr: 4 }}>
            <Avatar
              alt={user.name}
              src={user.profileImage || '/default-avatar.jpg'}
              sx={{ width: 120, height: 120, border: 4, borderColor: 'white', objectFit: 'cover' }}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{user.email}</Typography>
            {user.id && (
              <Button
                onClick={() => setShowEditModal(true)}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Card>
      )}

      {/* User Posts */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 , color: 'text.secondary' }}>Posts</Typography>
      {posts.length === 0 && !loading ? (
        <Typography variant="body2" color="text.secondary" align="center">No posts yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}

      {hasMore && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchPosts(page + 1)}
          >
            Load More
          </Button>
        </Box>
      )}

      {/* Edit Profile Modal */}
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
    </Box>
  );
};

export default Profile;
