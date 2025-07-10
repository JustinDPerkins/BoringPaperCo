// src/theme.js
import { createTheme } from '@mui/material/styles';

/* ------------------------------------------------------------------ */
/*  Design Tokens — VINTAGE PAPER COMPANY AESTHETIC                   */
/* ------------------------------------------------------------------ */
const DESIGN_TOKENS = {
  /* Colors */
  colors: {
    /* Rich charcoal primary (matching background gradient) */
    primary: {
      light: '#2a2a2a',   // lighter charcoal (gradient start)
      main:  '#1a1a1a',   // darker charcoal (gradient end)
      dark:  '#0f0f0f',   // deepest charcoal
      contrastText: '#f5f1e8'
    },

    /* Warm beige/cream for secondary */
    secondary: {
      light: '#f9f6f0',
      main:  '#e6ddd1',
      dark:  '#d4c7b8',
      contrastText: '#3a3632'
    },

    /* Dark charcoal backgrounds */
    background: {
      default: '#1a1a1a',  // rich charcoal black (main page)
      paper:   '#2a2a2a'   // slightly lighter charcoal (cards)
    },

    text: {
      primary: '#f5f1e8',   // warm cream text
      secondary: '#d4c7b8'  // lighter cream text
    },

    /* Greys (unchanged) */
    grey: {
      50:'#fafafa',100:'#f5f5f5',200:'#eeeeee',300:'#e0e0e0',400:'#bdbdbd',
      500:'#9e9e9e',600:'#757575',700:'#616161',800:'#424242',900:'#212121'
    },

    /* Status colors */
    error:   { light:'#ef9a9a', main:'#f44336', dark:'#b71c1c', contrastText:'#fff' },
    success: { light:'#81c784', main:'#4caf50', dark:'#1b5e20', contrastText:'#fff' }
  },

  /* Typography */
  typography: {
    fontFamily: '"Crimson Text", "Vollkorn", "Bitter", "Rokkitt", Georgia, serif',
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },

  /* Spacing (rem-based scale) */
  spacing: {
    xs: 0.25,
    sm: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2,
    '2xl': 3
  },

  /* Border radius */
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },

  /* Shadows with subtle glow for dark UI */
  shadows: {
    sm:  '0 2px 8px rgba(0,0,0,0.3), 0 0 4px rgba(245,241,232,0.05)',
    md:  '0 4px 16px rgba(0,0,0,0.4), 0 0 8px rgba(245,241,232,0.1)',
    lg:  '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(245,241,232,0.15)',
    xl:  '0 16px 48px rgba(0,0,0,0.6), 0 0 24px rgba(245,241,232,0.2)',
    '2xl':'0 24px 64px rgba(0,0,0,0.7), 0 0 32px rgba(245,241,232,0.25)'
  }
};

/* ------------------------------------------------------------------ */
/*  MUI Theme                                                         */
/* ------------------------------------------------------------------ */
const theme = createTheme({
  palette: {
    mode: 'dark',

    /* Core palette */
    primary:    DESIGN_TOKENS.colors.primary,
    secondary:  DESIGN_TOKENS.colors.secondary,
    error:      DESIGN_TOKENS.colors.error,
    success:    DESIGN_TOKENS.colors.success,

    background: DESIGN_TOKENS.colors.background,
    text:       DESIGN_TOKENS.colors.text
  },

  /* Typography scale mapped to tokens */
  typography: {
    fontFamily: '"Crimson Text", "Vollkorn", "Bitter", "Rokkitt", Georgia, serif',
    h1: {
      fontSize: DESIGN_TOKENS.typography.fontSize['4xl'],
      fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
      letterSpacing: '-0.5px'
    },
    h2: {
      fontSize: DESIGN_TOKENS.typography.fontSize['3xl'],
      fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
      letterSpacing: '-0.5px'
    },
    h3: {
      fontSize: DESIGN_TOKENS.typography.fontSize['2xl'],
      fontWeight: DESIGN_TOKENS.typography.fontWeights.bold
    },
    h4: {
      fontSize: DESIGN_TOKENS.typography.fontSize.xl,
      fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
      letterSpacing: '-0.5px'
    },
    body1: {
      fontSize: DESIGN_TOKENS.typography.fontSize.base,
      lineHeight: 1.6,
      fontWeight: DESIGN_TOKENS.typography.fontWeights.regular
    },
    body2: {
      fontSize: DESIGN_TOKENS.typography.fontSize.sm,
      lineHeight: 1.5,
      fontWeight: DESIGN_TOKENS.typography.fontWeights.regular
    }
  },

  shape: {
    borderRadius: DESIGN_TOKENS.borderRadius.md
  },

  /* Elevation array for theme.shadows[n] access */
  shadows: [
    'none',
    DESIGN_TOKENS.shadows.sm,
    DESIGN_TOKENS.shadows.md,
    DESIGN_TOKENS.shadows.lg,
    DESIGN_TOKENS.shadows.xl,
    DESIGN_TOKENS.shadows['2xl']
  ],

  /* Component tweaks */
  components: {
    /* Dark modern cards with glow */
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #2a2a2a, #1f1f1f)',
          border: '1px solid rgba(245, 241, 232, 0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 30px rgba(245, 241, 232, 0.15), 0 0 20px rgba(245, 241, 232, 0.1)',
            border: '1px solid rgba(245, 241, 232, 0.2)'
          }
        }
      }
    },

    /* Classic, rounded buttons */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
          textTransform: 'none',
          fontWeight: DESIGN_TOKENS.typography.fontWeights.medium,
          fontFamily: '"Crimson Text", "Vollkorn", "Bitter", "Rokkitt", Georgia, serif',
          color: '#f5f1e8'
        }
      }
    },

    /* Glowing white AppBar */
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #f9f6f0 0%, #f5f1e8 100%) !important',
          color: '#3a3632 !important',
          boxShadow: '0 4px 20px rgba(245, 241, 232, 0.4), 0 0 40px rgba(245, 241, 232, 0.6)',
          borderBottom: '1px solid rgba(58, 54, 50, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
            zIndex: -1
          },
          '& .MuiToolbar-root': {
            backgroundColor: 'transparent !important'
          },
          '& .MuiButton-root': {
            color: '#3a3632 !important'
          }
        }
      }
    }
  },

  /* Spacing helper to use tokens e.g. theme.spacing(2) === '0.5rem' */
  spacing: (factor) => `${DESIGN_TOKENS.spacing.md * factor}rem`
});

/* ------------------------------------------------------------------ */
/*  Exports                                                           */
/* ------------------------------------------------------------------ */
export { DESIGN_TOKENS, theme };
export default theme;