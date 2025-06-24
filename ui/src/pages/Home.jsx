// src/pages/Home.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DESIGN_TOKENS } from '../theme';

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.primary.main}, ${DESIGN_TOKENS.colors.primary.dark})`,
        py: DESIGN_TOKENS.spacing.xl,
      }}
    >
      <Container maxWidth="md">
        {/* ────── Hero card ─────────────────────────────────────────── */}
        <Card
          sx={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: DESIGN_TOKENS.borderRadius.lg,
            overflow: 'hidden',
            color: 'white',
            boxShadow: DESIGN_TOKENS.shadows.xl,
          }}
        >
          <CardMedia
            component="img"
            image="/images/the-boring-paper-company-high-resolution-logo.png"
            alt="The Boring Paper Company Logo"
            sx={{
              height: { xs: 280, sm: 340, md: 420 },
              width: '100%',
              objectFit: 'cover',
              p: DESIGN_TOKENS.spacing.lg,
              background: 'linear-gradient(135deg,#ffffff 0%,#eeeeee 100%)',
            }}
          />

          <CardContent
            sx={{
              textAlign: 'center',
              px: DESIGN_TOKENS.spacing.xl,
              pb: DESIGN_TOKENS.spacing.xl,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
                color: DESIGN_TOKENS.colors.primary.contrastText,
              }}
            >
              Welcome to The Boring Paper Company
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                opacity: 0.8,
                maxWidth: 520,
                mx: 'auto',
                color: DESIGN_TOKENS.colors.primary.contrastText,
              }}
            >
              Precision Paper Solutions Since the Trees
            </Typography>
          </CardContent>
        </Card>

        {/* ────── Quick-link cards (locked to one row) ─────────────── */}
        <Grid
          container
          spacing={0}                     /* no internal padding */
          sx={{
            mt: DESIGN_TOKENS.spacing.xl,
            gap: DESIGN_TOKENS.spacing.lg, /* visual gap between cards */
            flexWrap: 'nowrap',            /* keep on one line */
            justifyContent: 'space-between',
          }}
        >
          {/* 1. Threat Level Midnight → /products */}
          <Grid item xs={4}>
            <Card
              component={RouterLink}
              to="/products"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: DESIGN_TOKENS.shadows.lg,
                },
                transition: 'transform 0.2s',
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image="/images/threat_level_midnight.jpg"
                alt="Threat Level Midnight"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Threat Level Midnight
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. Fast Paper Delivery → /upload */}
          <Grid item xs={4}>
            <Card
              component={RouterLink}
              to="/upload"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: DESIGN_TOKENS.shadows.lg,
                },
                transition: 'transform 0.2s',
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image="/images/scooter.png"
                alt="Fast Paper Delivery"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Fast Paper Delivery
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. About → /about */}
          <Grid item xs={4}>
            <Card
              component={RouterLink}
              to="/about"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: DESIGN_TOKENS.shadows.lg,
                },
                transition: 'transform 0.2s',
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image="/images/people_office.jpg"
                alt="About BPC"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  About Us
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
