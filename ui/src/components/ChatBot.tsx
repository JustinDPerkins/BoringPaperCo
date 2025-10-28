import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  Slide,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { chatApi } from '../services/api';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (text: string, sender: 'user' | 'bot' = 'bot') => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    addMessage(inputValue, 'user');
    setIsLoading(true);
    const messageToSend = inputValue;
    setInputValue('');

    try {
      const data = await chatApi.sendMessage(messageToSend, securityEnabled);
      addMessage(data.response);
    } catch (error) {
      console.error('Chat error:', error);
      addMessage(error instanceof Error ? error.message : 'Sorry, I encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage("Hi there! I'm the Boring Paper Company AI assistant. How can I help you today?");
    }
  }, [isOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            width: 350,
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            mb: 1,
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BotIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="h6">BPC Chat</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Security Toggle */}
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
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
                <Typography variant="caption">
                  {securityEnabled ? '🛡️ AI Guard Protection' : '⚠️ AI Guard Disabled'}
                </Typography>
              }
            />
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {isLoading && (
              <Typography variant="body2" sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
                Thinking...
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleSendMessage} disabled={isLoading}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      {/* Floating Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          bgcolor: 'rgba(245, 241, 232, 0.1)',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'rgba(245, 241, 232, 0.2)',
          },
        }}
      >
        <ChatIcon />
      </IconButton>
    </Box>
  );
}
