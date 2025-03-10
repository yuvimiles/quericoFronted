import { createTheme } from '@mui/material/styles';

// Light and dark mode theme configurations
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f1e0c6', // Light skin tone color
    },
    secondary: {
      main: '#212121', // Matte black color
    },
    background: {
      default: '#f4f6f8', // Light background color
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f1e0c6', // Light skin tone color
    },
    secondary: {
      main: '#212121', // Matte black color
    },
    background: {
      default: '#121212', // Dark background color
    },
  },
});

export { lightTheme, darkTheme };
