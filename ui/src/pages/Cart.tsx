import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCartCheckout as CheckoutIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ textAlign: 'center', p: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#f5f1e8' }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(245, 241, 232, 0.7)', mb: 4 }}>
            Start shopping to add items to your cart.
          </Typography>
          <Button 
            variant="contained" 
            href="/products"
            sx={{
              background: 'rgba(76, 175, 80, 0.3)',
              color: 'white',
              '&:hover': {
                background: 'rgba(76, 175, 80, 0.5)',
              },
            }}
          >
            Browse Products
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        py: 6,
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: '#f5f1e8',
          }}
        >
          Shopping Cart
        </Typography>

        {/* Layout: Cart Items (left) and Summary (right) */}
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={2}>
              {items.map((item) => (
                <Card 
                  key={item.product.id}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, height: 120, objectFit: 'contain', p: 1 }}
                      image={item.product.image}
                      alt={item.product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#f5f1e8' }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)', mb: 1 }}>
                        {item.product.description}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        ${item.product.price.toFixed(2)} each
                      </Typography>
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <IconButton
                        onClick={() => removeFromCart(item.product.id)}
                        sx={{ color: 'rgba(244, 67, 54, 0.7)', '&:hover': { color: '#ef5350' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          sx={{ 
                            color: '#f5f1e8',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: '#f5f1e8', minWidth: '2rem', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          sx={{ 
                            color: '#f5f1e8',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                      <Typography variant="h5" sx={{ mt: 2, textAlign: 'right', color: '#4caf50', fontWeight: 700 }}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', md: '400px' }, flexShrink: 0 }}>
            <Paper 
              sx={{ 
                p: 3, 
                position: { md: 'sticky' }, 
                top: 80,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#f5f1e8' }}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {items.map((item) => (
                  <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.7)' }}>
                      {item.product.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#f5f1e8' }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#f5f1e8' }}>Total</Typography>
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<CheckoutIcon />}
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.3)',
                  color: '#f5f1e8',
                  mb: 2,
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 0.5)',
                  },
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearCart}
                sx={{ 
                  borderColor: 'rgba(244, 67, 54, 0.3)', 
                  color: 'rgba(244, 67, 54, 0.7)',
                  '&:hover': {
                    borderColor: '#ef5350',
                    color: '#ef5350',
                    background: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                Clear Cart
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;