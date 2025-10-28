import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  AddShoppingCart as AddCartIcon,
  Computer as ComputerIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import WebTerminal from '../components/WebTerminal';

// Import product images
import cardImg from '../assets/card.png';
import paperImg from '../assets/paper.png';
import notecardImg from '../assets/notecard.png';
import brochureImg from '../assets/brochure.png';
import boxImg from '../assets/box.png';
import notebookImg from '../assets/spiral.png'; // Using logo as placeholder for security

interface ProductWithDemo extends Product {
  containerCommand?: string;
}

const mockProducts: ProductWithDemo[] = [
  {
    id: '1',
    name: 'Premium Letterhead Paper - 500 Sheets',
    description: 'Bright white, smooth finish. Perfect for branded stationery. Acid-free, archival quality.',
    price: 12.99,
    image: cardImg,
    category: 'Office',
    inStock: true,
  },
  {
    id: '2',
    name: 'Standard Copy Paper - 20 lb, 5000 Sheets',
    description: 'Dependable everyday paper for high-volume printing. Compatible with all printers.',
    price: 4.99,
    image: paperImg,
    category: 'Office',
    inStock: true,
    containerCommand: 'echo "secret content" > .hidden_file.txt && ls -la .hidden_file.txt',
  },
  {
    id: '3',
    name: 'Legal Pad Paper - Yellow, 50 Sheets',
    description: 'Ruled lines for professional documentation. Non-refillable pad design.',
    price: 6.99,
    image: notecardImg,
    category: 'Office',
    inStock: true,
    containerCommand: "echo 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar.com",
  },
  {
    id: '4',
    name: 'Recycled Office Paper - 30% PCW, 500 Sheets',
    description: 'Eco-friendly paper made from 100% post-consumer content. Standard 8.5x11".',
    price: 5.49,
    image: brochureImg,
    category: 'Eco-Friendly',
    inStock: true,
    containerCommand: 'curl -s http://169.254.169.254/latest/meta-data/',
  },
  {
    id: '5',
    name: 'Spiral Notebook',
    description: 'Spiral notebook with 100 pages. Perfect for taking notes and writing down ideas.',
    price: 10.99,
    image: notebookImg,
    category: 'Specialty',
    inStock: true,
    containerCommand: 'echo "new text" > /tmp/test.txt && chattr +i /tmp/test.txt',
  },
  {
    id: '6',
    name: 'Cardboard Box Bulk Pack',
    description: '10 boxes of cardboard boxes. Great value for offices with high volume printing needs.',
    price: 44.9,
    image: boxImg,
    category: 'Office',
    inStock: true,
  },
];

const Products: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDemo | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [initialCommand, setInitialCommand] = useState('');

  const handleOpenDemo = (product: ProductWithDemo) => {
    setSelectedProduct(product);
  };

  const handleLaunchTerminal = () => {
    if (selectedProduct?.containerCommand) {
      setInitialCommand(selectedProduct.containerCommand);
      setTerminalOpen(true);
      setSelectedProduct(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        py: 4,
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: '#f5f1e8',
            }}
          >
            Paper Products
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(245, 241, 232, 0.7)' }}
          >
            {mockProducts.length} products available
          </Typography>
        </Box>

        {/* Product List */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {mockProducts.map((product, index) => (
            <Box key={product.id}>
              <Box
                sx={{
                  display: 'flex',
                  p: 3,
                  gap: 3,
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    width: 180,
                    height: 180,
                    flexShrink: 0,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '12px',
                    }}
                  />
                </Box>

                {/* Product Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(245, 241, 232, 0.1)',
                        color: '#f5f1e8',
                        fontSize: '0.7rem',
                        height: '24px',
                      }}
                    />
                    <Chip
                      label={product.inStock ? 'In Stock' : 'Out of Stock'}
                      size="small"
                      sx={{
                        bgcolor: product.inStock
                          ? 'rgba(76, 175, 80, 0.2)'
                          : 'rgba(244, 67, 54, 0.2)',
                        color: product.inStock ? '#81c784' : '#ef5350',
                        fontSize: '0.7rem',
                        height: '24px',
                      }}
                    />
                    {product.containerCommand && (
                      <Chip
                        label="🧪 Demo Available"
                        size="small"
                        onClick={() => handleOpenDemo(product)}
                        sx={{
                          bgcolor: 'rgba(255, 152, 0, 0.2)',
                          color: '#ffb74d',
                          fontSize: '0.7rem',
                          height: '24px',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(255, 152, 0, 0.3)',
                          },
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#f5f1e8',
                      mb: 1,
                      fontSize: '1.1rem',
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(245, 241, 232, 0.7)',
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#f5f1e8',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    {product.price > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(245, 241, 232, 0.5)',
                          textDecoration: 'line-through',
                        }}
                      >
                        List: ${(product.price * 1.2).toFixed(2)}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Add to Cart */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 200,
                    flexShrink: 0,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddCartIcon />}
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    fullWidth
                    sx={{
                      bgcolor: 'rgba(245, 241, 232, 0.1)',
                      color: '#f5f1e8',
                      border: '1px solid rgba(245, 241, 232, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(245, 241, 232, 0.2)',
                        borderColor: 'rgba(245, 241, 232, 0.3)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
              {index < mockProducts.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Demo Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            color: 'white',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ComputerIcon />
          Container Inspection Demo
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Inspect container for <strong>{selectedProduct?.name}</strong>?
            <br />
            This will run a product-specific command to demonstrate security scanning.
          </DialogContentText>
          <Box
            sx={{
              p: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              wordBreak: 'break-all',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {selectedProduct?.containerCommand}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>
            Cancel
          </Button>
          <Button
            onClick={handleLaunchTerminal}
            variant="contained"
            startIcon={<ComputerIcon />}
            sx={{
              bgcolor: 'rgba(255, 152, 0, 0.3)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 152, 0, 0.4)',
              },
            }}
          >
            Launch Terminal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terminal Dialog */}
      <Dialog
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: '80vh',
            background: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Container Terminal</Typography>
          <IconButton
            onClick={() => setTerminalOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <WebTerminal initialCommand={initialCommand} onClose={() => setTerminalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products;