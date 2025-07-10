// src/pages/Products.jsx
import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardActions, CardMedia, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Chip,
  Tooltip, Divider, IconButton
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Info as InfoIcon,
  Computer as ComputerIcon,
  LocalShipping as ShippingIcon,
  Recycling as RecyclingIcon,
  Layers as LayersIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DESIGN_TOKENS } from '../theme';
import WebTerminal from './WebTerminal';

function Products() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [initialCommand, setInitialCommand] = useState('');

  /* ------------------------------------------------------------------ */
  /*  Catalogue                                                         */
  /* ------------------------------------------------------------------ */
  const paperProducts = [
    {
      id: 1,
      name: 'Standard White Paper',
      description: 'Our flagship product. 99.9% brightness, 20lb weight.',
      price: 4.99,
      image: '/images/paper_products.png',
      containerCommand:
        'touch /tmp/standard_white_paper.txt && chmod 600 /tmp/standard_white_paper.txt && echo "Inventory: 10000 reams" > /tmp/standard_white_paper.txt && ls -l /tmp/standard_white_paper.txt && cat /tmp/standard_white_paper.txt',
      features: [
        { icon: <ComputerIcon />, label: 'Office Ready' },
        { icon: <ShippingIcon />, label: 'Fast Shipping' }
      ],
      stockLevel: 'High',
      weight: '20lb',
      dimensions: '8.5" × 11"',
      packSize: '500 sheets/ream'
    },
    {
      id: 2,
      name: 'Legal Pad Paper',
      description: 'Ruled lines for professional documentation.',
      price: 6.99,
      image: '/images/paper_1.png',
      containerCommand: 'whoami',
      features: [
        { icon: <LayersIcon />, label: 'Ruled Lines' },
        { icon: <RecyclingIcon />, label: 'Sustainable' }
      ],
      stockLevel: 'Medium',
      weight: '16lb',
      dimensions: '8.5" × 14"',
      packSize: '50 sheets/pad'
    },
    {
      id: 3,
      name: 'Recycled Office Paper',
      description: 'Eco-friendly option for conscious businesses.',
      price: 5.49,
      image: '/images/paper_products_1.png',
      containerCommand:
        'echo "#!/bin/bash\necho \\"Recycled Paper Inventory: 5000 reams\\"\necho \\"Sustainability Score: 95%\\"" > /tmp/recycled_paper_inventory.sh && chmod +x /tmp/recycled_paper_inventory.sh && chattr +i /tmp/recycled_paper_inventory.sh && ls -l /tmp/recycled_paper_inventory.sh && lsattr /tmp/recycled_paper_inventory.sh && /tmp/recycled_paper_inventory.sh',
      features: [
        { icon: <RecyclingIcon />, label: '100% Recycled' },
        { icon: <ComputerIcon />, label: 'Printer Friendly' }
      ],
      stockLevel: 'Limited',
      weight: '24lb',
      dimensions: '8.5" × 11"',
      packSize: '250 sheets/ream'
    }
  ];

  const addToCart = (p) => setSelectedProduct(p);

  const handleContainerInspect = () => {
    if (selectedProduct) {
      setInitialCommand(selectedProduct.containerCommand);
      setTerminalOpen(true);
      setSelectedProduct(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        py: DESIGN_TOKENS.spacing.xl
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: DESIGN_TOKENS.spacing.xl }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: DESIGN_TOKENS.typography.fontWeights.bold, 
              color: DESIGN_TOKENS.colors.primary.contrastText 
            }} 
            gutterBottom
          >
            The Boring Paper Company Products
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              opacity: 0.8, 
              color: DESIGN_TOKENS.colors.primary.contrastText 
            }}
          >
            Precision Paper Solutions for the Modern Office
          </Typography>
        </Box>

        {/* Product strip */}
        <Grid
          container
          spacing={4}
          sx={{
            flexWrap: 'nowrap',
            justifyContent: { xs: 'flex-start', md: 'center' },
            overflowX: { xs: 'auto', md: 'visible' },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {paperProducts.map((product) => (
            <Grid
              item
              key={product.id}
              sx={{
                flex: '0 0 320px',
                maxWidth: '33.333%'
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: DESIGN_TOKENS.shadows.xl
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'contain', p: DESIGN_TOKENS.spacing.md, filter: 'brightness(0.9)' }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>{product.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: DESIGN_TOKENS.spacing.md }}>
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: DESIGN_TOKENS.spacing.sm, flexWrap: 'wrap', mb: DESIGN_TOKENS.spacing.md }}>
                    {product.features.map((f, i) => (
                      <Tooltip key={i} title={f.label}>
                        <Chip
                          icon={f.icon}
                          label={f.label}
                          color="primary"
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: 'rgba(255,255,255,0.4)', 
                            color: 'inherit',
                            borderRadius: DESIGN_TOKENS.borderRadius.sm
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>

                  <Divider sx={{ mb: DESIGN_TOKENS.spacing.md, borderColor: 'rgba(255,255,255,0.15)' }} />

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Weight:</strong> {product.weight}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Dimensions:</strong> {product.dimensions}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Pack Size:</strong> {product.packSize}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        <strong>Stock:</strong> {product.stockLevel}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" sx={{ mt: DESIGN_TOKENS.spacing.md, opacity: 0.9 }}>
                    ${product.price.toFixed(2)} <span style={{ fontSize: 14 }}>per ream</span>
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: DESIGN_TOKENS.spacing.md, pb: DESIGN_TOKENS.spacing.md }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={() => addToCart(product)}
                    sx={{
                      borderRadius: DESIGN_TOKENS.borderRadius.md,
                      py: 1.3,
                      background: 'rgba(255,255,255,0.18)',
                      color: 'white',
                      '&:hover': { background: 'rgba(255,255,255,0.28)' }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Inspect dialog */}
        <Dialog
          open={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          PaperProps={{
            sx: {
              borderRadius: DESIGN_TOKENS.borderRadius.lg,
              p: DESIGN_TOKENS.spacing.md,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
              width: { xs: '90%', sm: 520 }
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: DESIGN_TOKENS.spacing.sm }}>
            <InfoIcon color="primary" />
            Container Inspection
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{ mb: 2 }}>
              Inspect container for <strong>{selectedProduct?.name}</strong>?<br />
              This will run a product-specific command to verify inventory and details.
            </DialogContentText>
            <Typography
              variant="body2"
              sx={{
                p: 2,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}
            >
              {selectedProduct?.containerCommand}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProduct(null)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleContainerInspect}
              variant="contained"
              color="primary"
              startIcon={<ComputerIcon />}
            >
              Inspect Container
            </Button>
          </DialogActions>
        </Dialog>

        {/* Terminal dialog */}
        <Dialog
          open={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              height: '80vh',
              borderRadius: DESIGN_TOKENS.borderRadius.lg,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white'
            }
          }}
        >
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Container Terminal</Typography>
            <IconButton
              onClick={() => setTerminalOpen(false)}
              sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0, height: '100%' }}>
            <WebTerminal initialCommand={initialCommand} onClose={() => setTerminalOpen(false)} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Products;
