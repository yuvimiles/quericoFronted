import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import postService, { Post } from '../services/post-service';
import PostCard from '../components/postCard';
import CreatePost from '../components/createPost';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = async (pageNumber: number = 1) => {
    try {
      setLoading(true);
      const { request } = postService.getAllPosts(pageNumber);
      const response = await request;
      const newPosts = response.data.posts;
      const total = response.data.totalPosts;

      // Update posts state and calculate hasMore
    setPosts(prev => {
      const updatedPosts = pageNumber === 1 ? newPosts : [...prev, ...newPosts];
      setHasMore(updatedPosts.length < total);
      return updatedPosts;
    });
      setPage(pageNumber);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Handle infinite scroll event
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if ((!loading )&& hasMore) {
          fetchPosts(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore, page]);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        px: 4,
        py: 6,
      }}
    >
      <CreatePost onPostCreated={handlePostCreated} />
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          {/* Main content - posts column */}
          <Box sx={{ flex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 6 }}>
                {error}
              </Alert>
            )}

            {posts.length === 0 && !loading ? (
              <Box sx={{ bgcolor: 'white', p: 6, borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No posts yet. Be the first to share something!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                {posts.map(post => (
                  <PostCard key={post._id} post={post} onDeletePost={handlePostDeleted} onUpdatePost={handlePostUpdated} />
                ))}
              </Box>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
