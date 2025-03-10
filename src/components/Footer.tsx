import React from 'react';
import { Box, Typography, Avatar, Link, useTheme } from '@mui/material';

const creators = [
  {
    name: import.meta.env.VITE_CREATOR_NAME_ONE,
    photo: import.meta.env.VITE_PHOTO_ONE,
    link: '#',
  },
  {
    name: import.meta.env.VITE_CREATOR_NAME_TWO,
    photo: import.meta.env.VITE_PHOTO_TWO,
    link: '#',
  },
  {
    name: import.meta.env.VITE_CREATOR_NAME_THREE,
    photo: import.meta.env.VITE_PHOTO_THREE,
    link: '#',
  },
  {
    name: import.meta.env.VITE_CREATOR_NAME_FOUR,
    photo: import.meta.env.VITE_PHOTO_FOUR,
    link: '#',
  },
];

const Footer: React.FC = () => {
  const theme = useTheme(); // Get the current theme object

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5',
        boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.12)',
        paddingY: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '1280px', // max-w-7xl equivalent
          marginX: 'auto', // Center horizontally
          paddingX: 4,
          '@media (min-width: 600px)': { paddingX: 6 }, // sm:px-6
          '@media (min-width: 1200px)': { paddingX: 8 }, // lg:px-8
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            sm: { flexDirection: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ marginBottom: 4, sm: { marginBottom: 0 } }}>
            <Typography
              variant="body2"
              color={theme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'}
            >
              &copy; {new Date().getFullYear()} QueRico. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {creators.map((creator, index) => (
              <Link key={index} href={creator.link} sx={{ textAlign: 'center' }}>
                <Avatar
                  src={creator.photo}
                  alt={creator.name}
                  sx={{
                    width: 48,
                    height: 48,
                    border: '2px solid',
                    borderColor:
                      theme.palette.mode === 'dark' ? 'grey.600' : 'grey.300',
                    marginBottom: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  color={theme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'}
                >
                  {creator.name}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
