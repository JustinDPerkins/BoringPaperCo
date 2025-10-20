// src/pages/Products.jsx
import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Chip,
  Tooltip, IconButton, Divider, Stack
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
  const [selectedProduct, setSelectedProduct] = useState(null); // for security demo
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [initialCommand, setInitialCommand] = useState('');
  const [cartItems, setCartItems] = useState([]);

  /* ------------------------------------------------------------------ */
  /*  Catalogue                                                         */
  /* ------------------------------------------------------------------ */
  const paperProducts = [
    {
      id: 1,
      name: 'Premium Letterhead Paper',
      description: 'Bright white, smooth finish. Perfect for branded stationery and watermarks.',
      price: 12.99,
      image: '/images/files.png',
      features: [
        { icon: <ComputerIcon />, label: 'Inkjet & Laser' },
        { icon: <ShippingIcon />, label: 'Fast Shipping' }
      ],
      stockLevel: 'High',
      weight: '24lb',
      dimensions: '8.5" × 11"',
      packSize: '250 sheets/ream',
      cta: { label: 'Customize', action: () => navigate('/upload') }
    },
    {
      id: 2,
      name: 'Standard Copy Paper',
      description: 'Dependable everyday paper for high-volume printing and copying.',
      price: 4.99,
      image: '/images/paper_products.png',
      features: [
        { icon: <ComputerIcon />, label: 'Office Ready' },
        { icon: <RecyclingIcon />, label: 'Sustainable' }
      ],
      stockLevel: 'High',
      weight: '20lb',
      dimensions: '8.5" × 11"',
      packSize: '500 sheets/ream',
      containerCommand:
        'echo "secret content" > .hidden_file.txt && ls -la .hidden_file.txt'
    },
    {
      id: 3,
      name: 'Legal Pad Paper',
      description: 'Ruled lines for professional documentation and note taking.',
      price: 6.99,
      image: '/images/paper_1.png',
      containerCommand: 'echo \'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\' > /tmp/eicar.com',
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
      id: 4,
      name: 'Recycled Office Paper',
      description: 'Eco-friendly paper made from 100% post‑consumer content.',
      price: 5.49,
      image: '/images/paper_products_1.png',
      features: [
        { icon: <RecyclingIcon />, label: '100% Recycled' },
        { icon: <ComputerIcon />, label: 'Printer Friendly' }
      ],
      stockLevel: 'Limited',
      weight: '24lb',
      dimensions: '8.5" × 11"',
      packSize: '250 sheets/ream',
      containerCommand:
        'curl -s http://169.254.169.254/latest/meta-data/'
    },
    {
      id: 5,
      name: 'Security Paper Sample Pack',
      description: 'Demonstrate tamper and malware detection with our secure workflows.',
      price: 0.00,
      image: '/images/security.jpg',
      containerCommand:
        'echo "new text" > /tmp/test.txt && chattr +i /tmp/test.txt',
      features: [
        { icon: <ComputerIcon />, label: 'Demo Ready' },
        { icon: <LayersIcon />, label: 'Tamper Case' }
      ],
      stockLevel: 'Demo',
      weight: '—',
      dimensions: '—',
      packSize: 'Sample'
    },
    {
      id: 6,
      name: 'Bulk Copy Paper Case',
      description: 'Ten reams for busy teams. Great value for offices and print rooms.',
      price: 44.90,
      image: '/images/office_building_draw.png',
      features: [
        { icon: <ShippingIcon />, label: 'Bulk Pack' },
        { icon: <ComputerIcon />, label: 'Office Ready' }
      ],
      stockLevel: 'High',
      weight: '20lb',
      dimensions: '8.5" × 11"',
      packSize: '10 × 500 sheets'
    }
  ];

  const addToCart = (p) => setCartItems([...cartItems, p]);

  const openDemo = (p) => setSelectedProduct(p);

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
      }}
    >
      <Container maxWidth={false} sx={{ px: DESIGN_TOKENS.spacing.lg }}>
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

        {/* Marketplace-style list (dense, 4 items, single column) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: DESIGN_TOKENS.spacing.sm }}>
          {paperProducts.slice(0, 4).map((p) => (
            <Box
              key={p.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '80px 1fr auto' },
                alignItems: 'center',
                gap: 1,
                p: 1,
                background: 'rgba(0,0,0,0.22)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 1
              }}
            >
              {/* thumbnail */}
              <Box component="img" src={p.image} alt={p.name} sx={{ width: '100%', maxHeight: 72, objectFit: 'contain', filter: 'brightness(0.95)' }} />

              {/* details */}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ color: 'white', mb: 0.2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                  {p.features?.slice(0, 2).map((f, i) => (
                    <Tooltip key={i} title={f.label}>
                      <Chip size="small" icon={f.icon} label={f.label} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} />
                    </Tooltip>
                  ))}
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {p.weight !== '—' && <><strong>Weight:</strong> {p.weight} · </>}
                  {p.dimensions !== '—' && <><strong>Size:</strong> {p.dimensions} · </>}
                  {p.packSize !== '—' && <><strong>Pack:</strong> {p.packSize} · </>}
                  <strong>Stock:</strong> {p.stockLevel}
                </Typography>
              </Box>

              {/* price + actions */}
              <Stack spacing={0.5} sx={{ justifySelf: 'end', alignItems: 'flex-end' }}>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  ${p.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <Button size="small" variant="contained" onClick={() => addToCart(p)} sx={{ py: 0.4, px: 1.2 }}>Add</Button>
                  {p.cta && (
                    <Button size="small" variant="outlined" onClick={p.cta.action} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', py: 0.4, px: 1.2 }}>{p.cta.label}</Button>
                  )}
                  {p.containerCommand && !p.cta && (
                    <Button size="small" variant="outlined" onClick={() => openDemo(p)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', py: 0.4, px: 1.2 }}>Demo</Button>
                  )}
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>

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
