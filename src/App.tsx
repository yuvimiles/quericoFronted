import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import Chat from './components/Chat';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <AppRoutes handleToggle={handleToggle} isDarkMode={isDarkMode} />
            <Chat />
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
