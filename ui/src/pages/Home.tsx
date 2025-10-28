import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  CloudUpload as UploadIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Browse Products',
      description: 'Explore our premium paper products and find the perfect solution for your needs.',
      icon: <ProductsIcon sx={{ fontSize: 48 }} />,
      action: () => navigate('/products'),
      actionText: 'View Products',
      color: '#4caf50',
    },
    {
      title: 'Custom Watermarking',
      description: 'Plain Paper? Spruce it up with a custom watermark.',
      icon: <UploadIcon sx={{ fontSize: 48 }} />,
      action: () => navigate('/watermarking'),
      actionText: 'Watermark Files',
      color: '#2196f3',
    },
    {
      title: 'Shopping Cart',
      description: 'Review your selected items and complete your order.',
      icon: <CartIcon sx={{ fontSize: 48 }} />,
      action: () => navigate('/cart'),
      actionText: 'View Cart',
      color: '#ff9800',
    },
  ];

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(45deg, #f5f1e8, #d4c7b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            The Boring Paper Company
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(245, 241, 232, 0.8)', 
              fontStyle: 'italic',
              mb: 2,
            }}
          >
            Delivering Excellence One Sheet at a Time
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              color: 'rgba(245, 241, 232, 0.6)', 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            Founded in Scranton, Pennsylvania. We've been providing premium paper products
            with unwavering consistency and quality for generations.
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              onClick={feature.action}
              sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: `${feature.color}66`,
                  boxShadow: `0 12px 24px ${feature.color}40`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: feature.color,
                  opacity: 0.6,
                },
              }}
            >
              <Box 
                sx={{ 
                  color: feature.color,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {feature.icon}
              </Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  color: '#f5f1e8',
                  mb: 2,
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(245, 241, 232, 0.7)', 
                  mb: 3,
                  lineHeight: 1.6,
                  minHeight: '3rem',
                }}
              >
                {feature.description}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: feature.color,
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  '&:hover': {
                    background: feature.color,
                    filter: 'brightness(0.9)',
                  },
                }}
              >
                {feature.actionText}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;