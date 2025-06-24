import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  ThemeProvider, 
  CssBaseline,
  Box
} from '@mui/material';
import { 
  Home as HomeIcon, 
  ShoppingCart as CartIcon, 
  Info as AboutIcon, 
  Upload as UploadIcon,
  Terminal as TerminalIcon
} from '@mui/icons-material';
import './App.css';

// Import the new theme
import theme from './theme';

// Import the new components from pages directory
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Upload from './pages/Upload';

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1 
            }}>
              <img 
                src="/images/boring_paper_logo.png" 
                alt="Boring Paper Company Logo" 
                style={{ 
                  height: '40px', 
                  marginRight: '10px',
                  borderRadius: '8px'
                }} 
              />
            </Box>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;


