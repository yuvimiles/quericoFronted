
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Post } from "../services/post-service";
import postService from "../services/post-service";
import authService from "../services/auth-service";
import EditPost from "./EditPost";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Dialog,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface PostCardProps {
  post: Post;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (updatedPost: Post) => void; // Handle updated post
}

const PostCard: React.FC<PostCardProps> = ({ post, onDeletePost }) => {
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    const currentUser = authService.getCurrentUser();
    return currentUser ? post.likes.includes(currentUser.id) : false;
  });

  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const currentUser = authService.getCurrentUser();
  const isAuthor = currentUser && post.author._id === currentUser.id;

  const formatDate = (date: Date): string => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const { request } = postService.toggleLike(post._id);
        await request;
        setLikesCount((prev) => prev - 1);
      } else {
        const { request } = postService.toggleLike(post._id);
        await request;
        setLikesCount((prev) => prev + 1);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setIsDeleting(true);
        const { request } = postService.deletePost(post._id);
        await request;


        if (onDeletePost) onDeletePost(post._id);
      } catch (error) {
        console.error("Error deleting post", error);
        alert("An error occurred while deleting the post");

      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);

  const handlePostUpdated = (updatedPost: Post) => {
    if (onUpdatePost) onUpdatePost(updatedPost);
    handleEditClose();
  };

  return (
    <>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar
              src={post.author.profileImage || "/default-avatar.jpg"}
              alt={post.author.name}
            />
          }
          title={
            <Link
              to={`/profile/${post.author._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {post.author.name}
            </Link>
          }
          subheader={formatDate(post.createdAt)}
          action={
            isAuthor && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton onClick={handleEditOpen}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete} disabled={isDeleting}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            )
          }
        />
        <CardContent>
          <Typography sx={{ whiteSpace: "pre-line", mb: 2 }}>
            {post.text}
          </Typography>
          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="Post image"
              sx={{
                width: "100%",
                borderRadius: 2,
                maxHeight: 400,
                objectFit: "cover",
              }}
            />
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleLikeToggle}
              color={isLiked ? "primary" : "default"}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography>{likesCount}</Typography>
            <IconButton component={Link} to={`/post/${post._id}`}>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography>{post.comments.length}</Typography>
          </Box>
        </CardActions>
      </Card>

      {/* Edit Post Popup */}
      <Dialog open={isEditOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <EditPost post={post} onPostUpdated={handlePostUpdated} onClose={handleEditClose} />
      </Dialog>
    </>
  );
};

export default PostCard;
