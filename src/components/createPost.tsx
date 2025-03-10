import React, { useState, useRef } from 'react';
import { Box, Button, TextField, Alert, Typography, useTheme } from '@mui/material';
import postService from '../services/post-service';
import authService from '../services/auth-service';

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authService.getCurrentUser();
  const theme = useTheme();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImage(file);

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() && !image) {
      setError('Please add some text or an image');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { request } = postService.createPost({
        text: text.trim(),
        image: image || undefined,
      });
      console.log('before request');
      const response = await request;
      console.log('after request');
      setText('');
      setImage(null);
      setImagePreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'An error occurred while creating the post');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 2,
        p: 4,
        mb: 6,
        maxWidth: '600px', // Ensure maximum width
        width: '100%', // Ensure it takes up full width but doesn't exceed maxWidth
        overflow: 'hidden', // Prevent overflow
        boxSizing: 'border-box', // Ensure padding doesn't push beyond the container
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'start', mb: 4 }}>
        <Box
          component="img"
          src={currentUser?.profileImage || import.meta.env.VITE_DEFAULT_USER_PHOTO}
          alt={currentUser?.name || 'User'}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            mr: 3,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'gray' },
                  '&:hover fieldset': { borderColor: 'blue' },
                  '&.Mui-focused fieldset': { borderColor: 'blue' },
                },
              }}
              disabled={isLoading}
            />

            {imagePreview && (
              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
                  maxHeight: 500,
                  overflow: 'hidden', // Prevent image overflow
                  borderRadius: 1,
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Post image"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: 0,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    padding: 0,
                    boxShadow: 1,
                  }}
                  onClick={removeImage}
                >
                  <Typography variant="caption" sx={{ color: 'secondary.main' }}>
                    X
                  </Typography>
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  hidden
                  disabled={isLoading}
                />
                <Button
                  variant="text"
                  color="secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Add Image
                  </Typography>
                  <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    sx={{ width: 20, height: 20 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </Box>
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ paddingX: 4, paddingY: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
