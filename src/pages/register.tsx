import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth-service';
import { TextField, Button, Card, Container, Alert, CircularProgress, Box, Typography, Input } from '@mui/material';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // New state for image preview
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (profileImage && (profileImage.size > 5 * 1024 * 1024 || !profileImage.type.startsWith('image/'))) {
      setImageError('Please upload an image file (max 5MB).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setImageError('');

      const { request } = authService.register({ name, email, password });
      const response = await request;
      
      // Save the uploaded image or add it to the user profile if required
      if (profileImage) {
        // Optionally, handle uploading the image
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        // Send this form data to your backend (replace with your logic for uploading the image)
      }
      
      authService.saveAuth(response.data);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfileImage(file);
      setImageError('');
      
      // Create an image preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Card sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" mb={3}>Register</Typography>
        
        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              sx={{ marginBottom: 2 }}
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ marginBottom: 2 }}
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ marginBottom: 2 }}
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              sx={{ marginBottom: 2 }}
            />
          </Box>

          <Box mb={3}>
            <Input
              type="file"
              onChange={handleImageChange}
              sx={{ display: 'none' }}
              inputProps={{ accept: 'image/*' }}  // This is how we pass the accept property
              id="profile-image-upload"
            />
            <label htmlFor="profile-image-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Profile Image
              </Button>
            </label>
            {profileImage && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {profileImage.name}
              </Typography>
            )}
            {imageError && <Alert severity="error" sx={{ marginTop: 2 }}>{imageError}</Alert>}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please upload only image files (max 5MB).
            </Typography>
            
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} 
                />
              </Box>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ marginBottom: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        
        <Box display="flex" alignItems="center" my={2}>
          <Box sx={{ flexGrow: 1 }}>
            <hr />
          </Box>
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            or
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <hr />
          </Box>
        </Box>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Register;
