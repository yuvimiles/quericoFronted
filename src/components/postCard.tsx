import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { PostWithAuthor } from '../services/post-service';
import postService from '../services/post-service';
import authService from '../services/auth-service';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostCardProps {
  post: PostWithAuthor;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (post: PostWithAuthor) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDeletePost }) => {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    const currentUser = authService.getCurrentUser();
    return currentUser ? post.likes.includes(currentUser.id) : false;
  });

  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const currentUser = authService.getCurrentUser();
  const isAuthor = currentUser && post.author._id === currentUser.id;

  const formatDate = (date: Date): string => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const { request } = postService.unlikePost(post._id);
        await request;
        setLikesCount((prev) => prev - 1);
      } else {
        const { request } = postService.likePost(post._id);
        await request;
        setLikesCount((prev) => prev + 1);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like', error);
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
        console.error('Error deleting post', error);
        alert('An error occurred while deleting the post');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
      {/* Post Header */}
      <CardHeader
        avatar={
          <Link to={`/profile/${post.author._id}`}>
            <Avatar src={post.author.profileImage || '/default-avatar.jpg'} alt={post.author.username} />
          </Link>
        }
        title={
          <Link to={`/profile/${post.author._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.author.username}
            </Typography>
          </Link>
        }
        subheader={<Typography variant="body2" color="text.secondary">{formatDate(post.createdAt)}</Typography>}
        action={
          isAuthor && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton component={Link} to={`/edit-post/${post._id}`} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" disabled={isDeleting}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )
        }
      />

      {/* Post Content */}
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
          {post.text}
        </Typography>

        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt="Post"
            sx={{
              width: '100%',
              borderRadius: 2,
              maxHeight: 400,
              objectFit: 'cover',
              mb: 2,
            }}
          />
        )}
      </CardContent>

      {/* Post Actions */}
      <CardActions disableSpacing>
        <IconButton onClick={handleLikeToggle} color={isLiked ? 'primary' : 'default'}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2">{likesCount}</Typography>

        <Button
          component={Link}
          to={`/post/${post._id}`}
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{ ml: 2, color: 'gray' }}
        >
          {post.comments.length}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;
