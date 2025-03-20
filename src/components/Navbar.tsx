import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box, Avatar, useTheme } from "@mui/material";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function AppNavbar({ handleToggle, isDarkMode }: { handleToggle: () => void, isDarkMode: boolean }) {
  const { user, logout } = useAuth();
  const theme = useTheme(); // Get the current theme object

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 3 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logo} alt="Logo" width="40" height="40" />
            <Typography variant="h6" sx={{ ml: 2, color: 'secondary.main', fontFamily: 'Roboto, sans-serif' }}>
              QueRico
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/AiChat" sx={{ color: 'secondary.main', mr: 3 }}>
            AI-Chat
          </Button>
          <Button component={Link} to="/feed" sx={{ color: 'secondary.main', mr: 3 }}>
            Feed
          </Button>
          <Button component={Link} to="/profile" sx={{ color: 'secondary.main', mr: 3 }}>
            Profile
          </Button>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={user.profileImage || import.meta.env.VITE_DEFAULT_USER_PHOTO}
                alt="User Avatar"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button component={Link} to="/login" variant="outlined" color="inherit">
              Login
            </Button>
          )}
          {/* Dark mode toggle button */}
          <Button
              onClick={handleToggle}
              sx={{
                ml: 3,
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.primary.contrastText,
              }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <BedtimeIcon /> : <LightModeIcon />}
            </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
