import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import commentService from "../services/comment-service";
import { IComment } from "../types/user-type";

interface CommentDialogProps {
  postId: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded: (comment: IComment) => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  postId,
  open,
  onClose,
  onCommentAdded,
}) => {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a comment");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
        // Add new comment
        const { request } = commentService.addComment(postId, text.trim());
        const response = await request;
        onCommentAdded(response.data);
      
      setText("");
      onClose(); // Close dialog after success
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      setError(err.response?.data?.message || "Failed to submit comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Add a Comment
        <IconButton onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> :"Post Comment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
