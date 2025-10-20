import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  TextField,
  Slide,
  useTheme,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Send as SendIcon, 
  Close as CloseIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { DESIGN_TOKENS } from '../theme';

export default function ChatBot() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  // Add a message to the chat
  const addMessage = (text, sender = 'bot') => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    setIsLoading(true);
    setInputValue('');

    try {
      // Fetch response from backend
      const response = await fetch('/api/chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputValue,
          securityEnabled: securityEnabled 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 403) {
          // Show the actual blocked message from the API
          addMessage(`⚠️ ${data.response}`, 'bot');
        } else {
          addMessage('Sorry, I encountered an error. Could you try again?', 'bot');
        }
        return;
      }
      
      // Add bot response
      addMessage(data.response);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Could you try again?', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen) {
      const initialGreeting = "Hi there! I'm the Boring Paper Company AI assistant. How can I help you today?";
      addMessage(initialGreeting);
    }
  }, [isOpen]);

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: DESIGN_TOKENS.spacing.lg, 
        right: DESIGN_TOKENS.spacing.lg, 
        zIndex: 1000 
      }}
    >
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            width: 350,
            height: 500,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(15px)',
            border: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)`,
            borderRadius: `${DESIGN_TOKENS.borderRadius.lg}px`,
            display: 'flex',
            flexDirection: 'column',
            mb: theme.spacing(1),
            boxShadow: theme.shadows[3]
          }}
        >
          {/* Chat Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: theme.spacing(0.5),
              borderBottom: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BotIcon sx={{ mr: theme.spacing(0.5), color: theme.palette.text.secondary }} />
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                BPC Chat Assistant
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)}
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.text.primary }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Security Toggle */}
          <Box sx={{ p: theme.spacing(0.5), borderBottom: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)` }}>
            <FormControlLabel
              control={
                <Switch
                  checked={securityEnabled}
                  onChange={(e) => setSecurityEnabled(e.target.checked)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4caf50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                />
              }
              label={
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  AI Guard Protection
                </Typography>
              }
            />
          </Box>

          {/* Messages Container */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: theme.spacing(0.5),
              display: 'flex',
              flexDirection: 'column',
              '&::-webkit-scrollbar': {
                display: 'none'  // Hide scrollbar
              }
            }}
          >
            {messages.map((msg, index) => (
              <Box 
                key={index}
                sx={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  mb: theme.spacing(0.5)
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    p: theme.spacing(0.5),
                    borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`,
                    background: msg.sender === 'user' 
                      ? 'rgba(255,255,255,0.2)' 
                      : theme.palette.background.default,
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[1]
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {isLoading && (
              <Box 
                sx={{ 
                  alignSelf: 'flex-start',
                  maxWidth: '80%',
                  mb: theme.spacing(0.5)
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    p: theme.spacing(0.5),
                    borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`,
                    background: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[1]
                  }}
                >
                  Thinking...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: theme.spacing(0.5),
              borderTop: `1px solid rgba(${theme.palette.mode === 'dark' ? '255,255,255' : '0,0,0'},0.1)`
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                mr: theme.spacing(0.5),
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.1)',
                  color: theme.palette.text.primary,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.4)'
                  }
                }
              }}
              InputProps={{
                sx: {
                  color: theme.palette.text.primary
                }
              }}
            />
            <IconButton 
              onClick={handleSendMessage}
              disabled={isLoading}
              sx={{
                background: 'rgba(255,255,255,0.1)',
                color: theme.palette.text.primary,
                borderRadius: `${DESIGN_TOKENS.borderRadius.md}px`,
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                },
                '&.Mui-disabled': {
                  background: 'rgba(255,255,255,0.05)',
                  color: theme.palette.text.secondary
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* Floating Chat Button */}
      <IconButton 
        onClick={() => setIsOpen(prev => !prev)}
        sx={{
          background: 'rgba(255,255,255,0.1)',
          color: theme.palette.text.primary,
          '&:hover': {
            background: 'rgba(255,255,255,0.2)'
          }
        }}
      >
        <ChatIcon />
      </IconButton>
    </Box>
  );
} 