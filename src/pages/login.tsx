import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Card, Container, Alert, CircularProgress, Box, Typography } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  // Handle form login (email/password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      try {
        setLoading(true);
        await loginWithGoogle(response.credential);
        navigate('/');
      } catch (err: any) {
        console.error('Google login error:', err);
        setError(err.response?.data?.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
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
        <Typography variant="h5" align="center" mb={3}>Login</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit}>
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

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ marginBottom: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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

        {/* Google Login Button */}
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed')} />

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Register now
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
