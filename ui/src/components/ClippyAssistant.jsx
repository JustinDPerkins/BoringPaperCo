import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Popover, 
  Paper,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  Help as HelpIcon, 
  Close as CloseIcon, 
  Assistant as AssistantIcon 
} from '@mui/icons-material';
import { DESIGN_TOKENS } from '../theme';

const TIPS = [
  "Welcome to the Boring Paper Company! Need help navigating?",
  "Did you know we have a secure file upload system?",
  "Check out our product catalog for the most exciting paper products!",
  "Our Container XDR keeps your digital workspace safe and sound.",
  "Explore our About page to learn more about our mission of mundane excellence."
];

export default function ClippyAssistant() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTip, setCurrentTip] = useState(0);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cycleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % TIPS.length);
  };

  useEffect(() => {
    let timer;
    if (anchorEl) {
      timer = setTimeout(cycleNextTip, 5000); // Change tip every 5 seconds
    }
    return () => clearTimeout(timer);
  }, [anchorEl, currentTip]);

  const open = Boolean(anchorEl);
  const id = open ? 'clippy-popover' : undefined;

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: DESIGN_TOKENS.spacing.lg, 
        right: DESIGN_TOKENS.spacing.lg, 
        zIndex: 1000 
      }}
    >
      <Tooltip title="Need Help?">
        <IconButton 
          onClick={handleOpen}
          sx={{
            background: 'rgba(255,255,255,0.1)',
            color: theme.palette.text.primary,
            '&:hover': {
              background: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            background: theme.palette.background.paper,
            backdropFilter: 'blur(15px)',
            border: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)`,
            borderRadius: `${DESIGN_TOKENS.borderRadius.lg}px`,
            maxWidth: 350,  // Matched to ChatBot width
            p: theme.spacing(1),
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: theme.spacing(0.5),
          borderBottom: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)`,
          pb: theme.spacing(0.5)
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssistantIcon sx={{ mr: theme.spacing(0.5), color: theme.palette.text.secondary }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              BPC Assistant
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleClose}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.primary, 
            lineHeight: 1.6,
            mb: theme.spacing(0.5),
            background: theme.palette.background.default,
            p: theme.spacing(0.5),
            borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`,
            boxShadow: theme.shadows[1]
          }}
        >
          {TIPS[currentTip]}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: theme.spacing(0.5) }}>
          <IconButton 
            size="small" 
            onClick={cycleNextTip}
            sx={{ 
              color: theme.palette.text.secondary,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`,
              '&:hover': { 
                color: theme.palette.text.primary,
                background: 'rgba(255,255,255,0.2)'
              }
            }}
          >
            <AssistantIcon fontSize="small" />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
} 