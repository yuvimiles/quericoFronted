import React, { useState, useRef } from 'react';
import { User, UserUpdateRequest } from '../types/user-type';
import userService from '../services/user-service';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileEditModalProps {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ user, onSave, onClose }) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updateData: UserUpdateRequest = { name, email };
      if (profileImage) updateData.profileImage = profileImage;

      const { request } = userService.updateUserProfile(user.id, updateData);
      const response = await request;

      onSave(response.data);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Profile
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Box sx={{ bgcolor: 'error.light', color: 'error.dark', p: 2, borderRadius: 1, mb: 2 }}>
            {error}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'grey.400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Avatar src={imagePreview} alt={name} sx={{ width: '100%', height: '100%' }} />
            ) : (
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'grey.300' }} />
            )}
          </Box>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
          <Button onClick={() => fileInputRef.current?.click()} sx={{ mt: 1 }} variant="text">
            Change Profile Picture
          </Button>
        </Box>

        <TextField
          label="name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
