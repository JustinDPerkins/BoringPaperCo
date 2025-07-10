import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  CssBaseline 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  ShoppingCart as CartIcon, 
  Info as AboutIcon, 
  Upload as UploadIcon,
} from '@mui/icons-material';

import { theme } from './theme';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Upload from './pages/Upload';
import ChatBot from './components/ChatBot';

import './App.css';

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar 
          position="sticky" 
          sx={{ 
            background: 'linear-gradient(135deg, #f9f6f0 0%, #f5f1e8 100%) !important',
            color: '#3a3632 !important',
            boxShadow: '0 4px 20px rgba(245, 241, 232, 0.4), 0 0 40px rgba(245, 241, 232, 0.6)',
            '& .MuiButton-root': {
              color: '#3a3632 !important',
              fontWeight: 600,
              borderRadius: '20px 5px 20px 5px', // Asymmetrical 60s style
              padding: '12px 28px',
              margin: '0 6px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: '"Crimson Text", Georgia, serif',
              fontSize: '15px',
              letterSpacing: '1px', // Space age letter spacing
              textTransform: 'uppercase',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(245, 241, 232, 0.9))',
              border: '2px solid rgba(139, 69, 19, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(139, 69, 19, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
              
              // Atomic orbital ring effect
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '80%',
                height: '80%',
                border: '1px solid rgba(139, 69, 19, 0.2)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                transition: 'all 0.4s ease',
                animation: 'orbit 8s linear infinite',
                '@keyframes orbit': {
                  '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                  '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                }
              },
              
              // Chrome shimmer effect
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.1), transparent)',
                transition: 'left 0.6s ease',
              },
              
              '&:hover': {
                backgroundColor: 'rgba(245, 241, 232, 0.95)',
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 12px 30px rgba(139, 69, 19, 0.25), 0 0 20px rgba(139, 69, 19, 0.1)',
                color: '#2F1B14 !important',
                border: '2px solid rgba(139, 69, 19, 0.5)',
                letterSpacing: '1.5px', // Extra spacing on hover
                
                '&::before': {
                  opacity: 1,
                },
                
                '&::after': {
                  left: '100%',
                }
              },
              
              // Active state with atomic energy
              '&:active': {
                transform: 'translateY(-1px) scale(1.01)',
                boxShadow: '0 8px 20px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(139, 69, 19, 0.1)',
                backgroundColor: 'rgba(233, 228, 218, 0.9)',
              },
              
              // Focus state with atomic glow
              '&:focus': {
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(139, 69, 19, 0.3), 0 4px 15px rgba(139, 69, 19, 0.2)',
              }
            }
          }}
        >
          <Toolbar sx={{ paddingLeft: '0px !important', paddingRight: '16px !important', justifyContent: 'space-between', alignItems: 'center' }}>
            <img 
              src="/images/bpclogo.png" 
              alt="Boring Paper Company Logo" 
              style={{ 
                height: '100px',
                width: '180px',
                objectFit: 'contain',
                marginLeft: '0px',
                borderRadius: '8px'
              }} 
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
                Home
              </Button>
              <Button color="inherit" component={Link} to="/products" startIcon={<CartIcon />}>
                Products
              </Button>
              <Button color="inherit" component={Link} to="/upload" startIcon={<UploadIcon />}>
                Upload
              </Button>
              <Button color="inherit" component={Link} to="/about" startIcon={<AboutIcon />}>
                About
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
        
        <ChatBot />
      </Router>
    </ThemeProvider>
  );
}

export default App;


