import { useState, useEffect } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import './animatedBubble.css';  // Import the CSS file


const ChatBubble  = ({ message, avatarSrc }: { message: string, avatarSrc: string }) => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    setShowBubble(true); // Trigger the animation when component mounts
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      marginBottom: 2,
    }}>
      <Avatar src={avatarSrc} sx={{ width: 40, height: 40 }} />
      
      <Box sx={{
        marginLeft: 2,
        padding: '10px 20px',
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: '20px',
        maxWidth: '300px',
        position: 'relative',
        opacity: showBubble ? 1 : 0,
        transform: showBubble ? 'translateX(0)' : 'translateX(-20px)',
        animation: showBubble ? 'slideIn 0.5s ease-out' : 'none',
        whiteSpace: 'pre-wrap',
      }}>
        <Typography color='black'>{message}</Typography>
      </Box>
    </Box>
  );
};

export default ChatBubble ;
