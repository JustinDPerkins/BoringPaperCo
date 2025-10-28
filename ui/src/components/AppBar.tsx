import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  CloudUpload as UploadIcon,
  Inventory as ProductsIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import logo from '../assets/bpclogo.png';

const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Products', path: '/products', icon: ProductsIcon },
    { label: 'Watermarking', path: '/watermarking', icon: UploadIcon },
    {
      label: 'Cart',
      path: '/cart',
      icon: CartIcon,
      badge: itemCount,
    },
  ];

  return (
    <MuiAppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={logo}
            alt="Boring Paper Company Logo"
            style={{ height: '60px', width: 'auto', filter: 'brightness(0.9)' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '1px' }}>
            THE BORING PAPER COMPANY
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map(({ label, path, icon: Icon, badge }) => {
            const isActive = location.pathname === path;
            return (
              <Button
                key={path}
                startIcon={
                  badge ? (
                    <Badge badgeContent={badge} color="error">
                      <Icon />
                    </Badge>
                  ) : (
                    <Icon />
                  )
                }
                onClick={() => navigate(path)}
                variant={isActive ? 'contained' : 'text'}
                sx={{
                  color: isActive ? '#1a1a1a' : '#3a3632',
                  bgcolor: isActive ? 'rgba(245, 241, 232, 0.9)' : 'transparent',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(245, 241, 232, 0.7)',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
