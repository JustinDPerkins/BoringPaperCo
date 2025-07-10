// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DESIGN_TOKENS } from '../theme';

function Home() {
  // Typewriter effect for main heading
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'The Boring Paper Company';
  
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 120); // Typewriter speed

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%),
          radial-gradient(circle at 25% 25%, rgba(245, 241, 232, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(245, 241, 232, 0.03) 0%, transparent 50%)
        `,
        backgroundBlendMode: 'overlay',
        position: 'relative',
        py: DESIGN_TOKENS.spacing.xl,
        // Subtle paper texture overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(245, 241, 232, 0.15) 1px, transparent 0),
            radial-gradient(circle at 3px 7px, rgba(245, 241, 232, 0.08) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px',
          opacity: 0.6,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        {/* ────── 1960s Space Age Letterhead Header ─────────────────────────── */}
        <Box
          sx={{
            background: 'linear-gradient(145deg, rgba(245, 241, 232, 0.95), rgba(233, 228, 218, 0.95))',
            border: '3px solid #8B4513',
            borderRadius: '20px 2px 20px 2px', // Asymmetrical 60s style
            p: DESIGN_TOKENS.spacing.xl,
            mb: DESIGN_TOKENS.spacing['2xl'],
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            overflow: 'hidden',
            
            // Atomic Age Corner Starbursts
            '&::before': {
              content: '"✦"',
              position: 'absolute',
              top: '15px',
              left: '15px',
              fontSize: '20px',
              color: '#8B4513',
              animation: 'pulse 3s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' }
              }
            },
            
            // Space Age Atomic Symbol
            '&::after': {
              content: '"⚛"',
              position: 'absolute',
              bottom: '15px',
              right: '15px',
              fontSize: '18px',
              color: '#8B4513',
              animation: 'rotate 8s linear infinite',
              '@keyframes rotate': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }
          }}
        >
          {/* Company Name with 1960s Space Age Effect */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              fontWeight: 700,
              color: '#1a1a1a !important',
              letterSpacing: '3px', // More spaced out for 60s feel
              textShadow: '2px 2px 0px rgba(139, 69, 19, 0.3), 4px 4px 0px rgba(139, 69, 19, 0.1)', // Chrome effect
              mb: 1,
              minHeight: '60px',
              position: 'relative',
              background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a, #1a1a1a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 4s ease-in-out infinite',
              '@keyframes shimmer': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
              }
            }}
          >
            {displayedText}
            <Box 
              component="span" 
              sx={{ 
                borderRight: '3px solid #1a1a1a',
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 }
                }
              }}
            />
          </Typography>

          {/* Company Logo with Subtle 1960s Design */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              my: 2,
              position: 'relative',
            }}
          >
            <Box sx={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #8B4513, transparent)', position: 'relative' }}>
              {/* Subtle atomic dots along the line */}
              <Box sx={{ position: 'absolute', left: '30%', top: '-2px', width: '6px', height: '6px', background: '#8B4513', borderRadius: '50%', opacity: 0.7 }} />
              <Box sx={{ position: 'absolute', left: '70%', top: '-2px', width: '4px', height: '4px', background: '#8B4513', borderRadius: '50%', opacity: 0.5 }} />
            </Box>
            
            <Box sx={{ mx: 3 }}>
              <img 
                src="/images/bpclogo.png" 
                alt="Boring Paper Company Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  filter: 'sepia(0.3) brightness(0.8)',
                  opacity: 0.9,
                  borderRadius: '8px', // Subtle rounded corners
                  boxShadow: '0 4px 12px rgba(139, 69, 19, 0.2)'
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #8B4513, transparent)', position: 'relative' }}>
              {/* Subtle atomic dots along the line */}
              <Box sx={{ position: 'absolute', right: '30%', top: '-2px', width: '6px', height: '6px', background: '#8B4513', borderRadius: '50%', opacity: 0.7 }} />
              <Box sx={{ position: 'absolute', right: '70%', top: '-2px', width: '4px', height: '4px', background: '#8B4513', borderRadius: '50%', opacity: 0.5 }} />
            </Box>
          </Box>

          {/* Vintage Business Details */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              color: '#1a1a1a !important', // Force dark charcoal text
              fontWeight: 600,
              mb: 1,
            }}
          >
            Premium Paper Solutions Since the Dawn of Trees
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              color: '#2a2a2a !important', // Force lighter charcoal text
              fontStyle: 'italic',
              mb: 2,
            }}
          >
            Established in the Great Forest • Scranton, Pennsylvania
          </Typography>
        </Box>

        {/* ────── Vintage Department Cards ─────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: DESIGN_TOKENS.spacing.xl }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              fontWeight: 700,
              color: DESIGN_TOKENS.colors.primary.contrastText,
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Our Departments
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(245, 241, 232, 0.5), transparent)', maxWidth: '200px' }} />
            <Box sx={{ mx: 3, fontSize: '20px', color: '#D4AF37' }}>✦</Box>
            <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(245, 241, 232, 0.5), transparent)', maxWidth: '200px' }} />
          </Box>
          
          {/* Service Description */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              color: DESIGN_TOKENS.colors.primary.contrastText,
              fontStyle: 'italic',
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            "Where Every Sheet Tells a Story"
            <br />
            For generations, we have been the trusted provider of premium paper products 
            to businesses across Pennsylvania and beyond. Our commitment to quality 
            remains unwavering in these modern times.
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{
            justifyContent: 'center',
          }}
        >
          {/* Products Department */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              component={RouterLink}
              to="/products"
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(145deg, rgba(245, 241, 232, 0.08), rgba(233, 228, 218, 0.04))',
                border: '1px solid rgba(139, 69, 19, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                },
                // 1960s Space Age Stamp Effect
                '&::before': {
                  content: '"PREMIUM QUALITY"',
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.8), rgba(160, 82, 45, 0.8))',
                  color: '#f5f1e8',
                  padding: '6px 10px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '50% 10% 50% 10%', // Atomic age asymmetrical shape
                  transform: 'rotate(15deg)',
                  opacity: 0,
                  transition: 'all 0.4s ease',
                  boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)',
                },
                '&:hover::before': {
                  opacity: 1,
                  transform: 'rotate(15deg) scale(1.1)',
                },
                
                // Atomic orbital decoration
                '&::after': {
                  content: '"⚛"',
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  fontSize: '16px',
                  color: 'rgba(139, 69, 19, 0.6)',
                  opacity: 0,
                  transition: 'all 0.4s ease',
                  animation: 'atomicSpin 3s linear infinite',
                  '@keyframes atomicSpin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                },
                '&:hover::after': {
                  opacity: 1,
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image="/images/threat_level_midnight.png"
                alt="Premium Paper Products"
                sx={{ 
                  objectFit: 'cover',
                  filter: 'sepia(0.2) brightness(0.9) contrast(1.1)',
                }}
              />
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Crimson Text", Georgia, serif',
                    fontWeight: 700,
                    color: DESIGN_TOKENS.colors.primary.contrastText,
                    mb: 1,
                  }}
                >
                  Premium Products
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(245, 241, 232, 0.8)',
                    fontStyle: 'italic',
                  }}
                >
                  Our finest paper selections
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Delivery Department */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              component={RouterLink}
              to="/upload"
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(145deg, rgba(245, 241, 232, 0.08), rgba(233, 228, 218, 0.04))',
                border: '1px solid rgba(139, 69, 19, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                },
                '&::before': {
                  content: '"EXPRESS SERVICE"',
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(139, 69, 19, 0.8)',
                  color: '#f5f1e8',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                  transform: 'rotate(15deg)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image="/images/camino.png"
                alt="Express Delivery Service"
                sx={{ 
                  objectFit: 'cover',
                  filter: 'sepia(0.2) brightness(0.9) contrast(1.1)',
                }}
              />
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Crimson Text", Georgia, serif',
                    fontWeight: 700,
                    color: DESIGN_TOKENS.colors.primary.contrastText,
                    mb: 1,
                  }}
                >
                  Express Delivery
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(245, 241, 232, 0.8)',
                    fontStyle: 'italic',
                  }}
                >
                  Swift & reliable service
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* About Department */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              component={RouterLink}
              to="/about"
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(145deg, rgba(245, 241, 232, 0.08), rgba(233, 228, 218, 0.04))',
                border: '1px solid rgba(139, 69, 19, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                },
                '&::before': {
                  content: '"EST. 1925"',
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(139, 69, 19, 0.8)',
                  color: '#f5f1e8',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                  transform: 'rotate(15deg)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::before': {
                  opacity: 1,
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image="/images/people_office.jpg"
                alt="Our Heritage"
                sx={{ 
                  objectFit: 'cover',
                  filter: 'sepia(0.2) brightness(0.9) contrast(1.1)',
                }}
              />
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Crimson Text", Georgia, serif',
                    fontWeight: 700,
                    color: DESIGN_TOKENS.colors.primary.contrastText,
                    mb: 1,
                  }}
                >
                  Our Heritage
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(245, 241, 232, 0.8)',
                    fontStyle: 'italic',
                  }}
                >
                  A century of excellence
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ────── Vintage Footer Quote ─────────────────────────────── */}
        <Box
          sx={{
            textAlign: 'center',
            mt: DESIGN_TOKENS.spacing['2xl'],
            py: DESIGN_TOKENS.spacing.xl,
            borderTop: '2px solid rgba(139, 69, 19, 0.3)',
            borderBottom: '1px solid rgba(139, 69, 19, 0.3)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Crimson Text", Georgia, serif',
              fontStyle: 'italic',
              color: '#D4AF37',
              fontWeight: 500,
              mb: 1,
            }}
          >
            "In paper we trust, in quality we deliver"
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(245, 241, 232, 0.7)',
              fontFamily: '"Crimson Text", Georgia, serif',
            }}
          >
            — Company Motto, Established 1925
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
