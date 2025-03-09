import React from 'react';
import { Box, Typography, Avatar, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.12)',
        paddingY: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '1280px', // max-w-7xl equivalent
          marginX: 'auto', // mx-auto equivalent
          paddingX: 4,
          '@media (min-width: 600px)': { paddingX: 6 }, // sm:px-6 equivalent
          '@media (min-width: 1200px)': { paddingX: 8 }, // lg:px-8 equivalent
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
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} QueRico. All rights reserved.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Avatar 1 */}
            <Link href="#" sx={{ display: 'block', textAlign: 'center' }}>
              <Avatar
                src={import.meta.env.VITE_PHOTO_ONE}
                alt="Creator 1"
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  marginBottom: 1,
                }}
              />
              <Typography variant="body2" color="text.secondary">
              {import.meta.env.VITE_CREATOR_NAME_ONE}
              </Typography>
            </Link>
            {/* Avatar 2 */}
            <Link href="#" sx={{ display: 'block', textAlign: 'center' }}>
              <Avatar
                src={import.meta.env.VITE_PHOTO_TWO}
                alt="Creator 2"
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  marginBottom: 1,
                }}
              />
              <Typography variant="body2" color="text.secondary">
              {import.meta.env.VITE_CREATOR_NAME_TWO}
              </Typography>
            </Link>
            {/* Avatar 3 */}
            <Link href="#" sx={{ display: 'block', textAlign: 'center' }}>
              <Avatar
                src={import.meta.env.VITE_PHOTO_THREE}
                alt="Creator 3"
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  marginBottom: 1,
                }}
              />
              <Typography variant="body2" color="text.secondary">
              {import.meta.env.VITE_CREATOR_NAME_THREE}
              </Typography>
            </Link>
            {/* Avatar 4 */}
            <Link href="#" sx={{ display: 'block', textAlign: 'center' }}>
              <Avatar
                src={import.meta.env.VITE_PHOTO_FOUR}
                alt="Creator 4"
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  marginBottom: 1,
                }}
              />
              <Typography variant="body2" color="text.secondary">
              {import.meta.env.VITE_CREATOR_NAME_FOUR}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
