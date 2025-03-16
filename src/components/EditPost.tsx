import React, { useState, useRef } from "react";
import {PostUpdateData, Post } from "../services/post-service";
import postService from "../services/post-service";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditPostProps {
  post: Post; // Post to edit
  onPostUpdated: (updatedPost: Post) => void; // Callback after successful edit
  onClose: () => void; // Close dialog callback
}

const EditPost: React.FC<EditPostProps> = ({ post, onPostUpdated, onClose }) => {
  const [hasImg , setHasImg] = useState<boolean>(post.image ? true : false);
  const [text, setText] = useState<string>(post.text);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.image || null
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // Limit image size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setImage(file);
      setHasImg(true);

      // Display image preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setHasImg(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission (post update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError("Please add some text or an image");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Prepare update payload
      const updateData: PostUpdateData = { text: text.trim() };
      if (hasImg) 
        updateData.image = image;
      else
      updateData.image = null;
      // Call updatePost service
      const { request } = postService.updatePost(post._id, updateData);
      const { data: updatedPost } = await request;

      // Notify parent component of the update
      onPostUpdated(updatedPost);

      // Close the dialog
      onClose();
    } catch (err: any) {
      console.error("Error updating post:", err);
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DialogTitle>Edit Post</DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Post Text */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
          sx={{ mb: 3, marginTop: "10px" }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <Box sx={{ position: "relative", mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "8px",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
            <IconButton
              onClick={removeImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Image Upload */}
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          disabled={submitting}
        >
          {imagePreview ? "Change Image" : "Add Image"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          hidden
          disabled={submitting}
        />
      </DialogContent>

      {/* Dialog Actions (Submit & Cancel) */}
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </>
  );
};

export default EditPost;
