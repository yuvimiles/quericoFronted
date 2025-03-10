import React from 'react';
import AppNavbar from './Navbar';
import Footer from './Footer';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  handleToggle: () => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, handleToggle, isDarkMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AppNavbar handleToggle={handleToggle} isDarkMode={isDarkMode} />
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: isDarkMode ? '#121212' : '#f7fafc',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
