// src/pages/About.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Divider
} from '@mui/material';
import { 
  FormatQuote as QuoteIcon,
  Business as BusinessIcon,
  EmojiObjects as IdeaIcon,
  CloudUpload as UploadIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { DESIGN_TOKENS } from '../theme';

function About() {
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
        {/* ────── Page title ─────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: DESIGN_TOKENS.spacing['2xl'] }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: DESIGN_TOKENS.typography.fontWeights.bold, 
              mb: DESIGN_TOKENS.spacing.md,
              color: DESIGN_TOKENS.colors.primary.contrastText,
              letterSpacing: '-0.05em'
            }}
          >
            The Boring Paper Company
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontStyle: 'italic'
            }}
          >
            Where Every Sheet Tells a Story (Of Boredom)
          </Typography>
        </Box>

        {/* ────── Content cards ─────────────────────────────────── */}
        <Grid container spacing={4}>
          {/* Our Story ------------------------------------------------ */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: DESIGN_TOKENS.shadows.xl
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image="/images/office_building_draw.png"
                alt="Boring Paper Company Headquarters"
                sx={{ 
                  objectFit: 'contain', 
                  p: DESIGN_TOKENS.spacing.md,
                  filter: 'brightness(0.8) grayscale(0.2)'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: DESIGN_TOKENS.spacing.md }}>
                  <BusinessIcon 
                    sx={{ 
                      mr: DESIGN_TOKENS.spacing.md, 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: 40 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: DESIGN_TOKENS.typography.fontWeights.medium
                    }}
                  >
                    Our Story
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}
                >
                  Founded in the heart of Scranton, Pennsylvania, The Boring Paper Company 
                  has been delivering mind-numbingly consistent paper solutions since the trees 
                  first learned to grow. We’re not just a paper company; we’re a way of life.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Our Mission --------------------------------------------- */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: DESIGN_TOKENS.shadows.xl
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: DESIGN_TOKENS.spacing.md }}>
                  <IdeaIcon 
                    sx={{ 
                      mr: DESIGN_TOKENS.spacing.md, 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: 40 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: DESIGN_TOKENS.typography.fontWeights.medium
                    }}
                  >
                    Our Mission
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.6,
                    mb: DESIGN_TOKENS.spacing.md
                  }}
                >
                  To provide the most mundane, yet essential paper products 
                  that keep businesses running with the excitement of watching 
                  paint dry. We believe in the power of simplicity, consistency, 
                  and absolutely zero frills.
                </Typography>
                
                <Divider 
                  sx={{ 
                    my: DESIGN_TOKENS.spacing.md, 
                    borderColor: 'rgba(255,255,255,0.1)' 
                  }} 
                />

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'rgba(0,0,0,0.2)', 
                  p: DESIGN_TOKENS.spacing.md, 
                  borderRadius: DESIGN_TOKENS.borderRadius.md 
                }}>
                  <QuoteIcon 
                    sx={{ 
                      mr: DESIGN_TOKENS.spacing.md, 
                      color: 'rgba(255,255,255,0.5)', 
                      fontSize: 40 
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontStyle: 'italic', 
                      color: 'rgba(255,255,255,0.7)'
                    }}
                  >
                    "Paper: Because Digital is Just Too Exciting"
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* File Upload --------------------------------------------- */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: DESIGN_TOKENS.shadows.xl
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image="/images/paper_1.png"
                alt="File Upload Scanning"
                sx={{ 
                  objectFit: 'contain', 
                  p: DESIGN_TOKENS.spacing.md,
                  filter: 'brightness(0.85)'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: DESIGN_TOKENS.spacing.md }}>
                  <UploadIcon 
                    sx={{ 
                      mr: DESIGN_TOKENS.spacing.md, 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: 40 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: DESIGN_TOKENS.typography.fontWeights.medium
                    }}
                  >
                    File Upload Security
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}
                >
                  Every uploaded document can be a Trojan horse. Advanced malware and 
                  zero-day exploits often hide inside otherwise harmless PDFs, images, 
                  or spreadsheets. Scanning files at upload time keeps malicious content 
                  out of your environment — protecting employees, clients, and brand.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Container XDR ------------------------------------------- */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: DESIGN_TOKENS.shadows.xl
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image="/images/security.jpg"
                alt="Container Runtime Security"
                sx={{ 
                  objectFit: 'contain', 
                  p: DESIGN_TOKENS.spacing.md,
                  filter: 'brightness(0.85)'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: DESIGN_TOKENS.spacing.md }}>
                  <SecurityIcon 
                    sx={{ 
                      mr: DESIGN_TOKENS.spacing.md, 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: 40 
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: DESIGN_TOKENS.typography.fontWeights.medium
                    }}
                  >
                    Container XDR
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}
                >
                  Modern apps run in containers that spin up and down in seconds. Extended-Detection-and-Response 
                  (XDR) for containers gives real-time visibility into build vulnerabilities, drift, and runtime 
                  threats like crypto-mining or lateral movement — keeping your microservices safe from code 
                  to Kubernetes node.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default About;