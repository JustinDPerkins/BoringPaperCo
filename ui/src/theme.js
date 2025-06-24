// src/theme.js
import { createTheme } from '@mui/material/styles';

/* ------------------------------------------------------------------ */
/*  Design Tokens — NAVY FOCUSED                                       */
/* ------------------------------------------------------------------ */
const DESIGN_TOKENS = {
  /* Colors */
  colors: {
    /* Deep-navy primary */
    primary: {
      light: '#3358b8',   // muted royal
      main:  '#0d2c6b',   // rich navy (default)
      dark:  '#030e26',   // almost-black navy
      contrastText: '#ffffff'
    },

    /* Neutral greys for secondary */
    secondary: {
      light: '#eceff4',
      main:  '#9ea4ad',
      dark:  '#43484f',
      contrastText: '#000000'
    },

    /* Backgrounds */
    background: {
      default: '#070b14',  // page background
      paper:   '#101620'   // cards/dialogs
    },

    text: {
      primary: '#e6e9f0',
      secondary: '#9aa1b2'
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
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
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

  /* Shadows tuned for dark UI */
  shadows: {
    sm:  '0 1px 3px rgba(0,0,0,0.24)',
    md:  '0 4px 8px rgba(0,0,0,0.28)',
    lg:  '0 10px 20px rgba(0,0,0,0.32)',
    xl:  '0 20px 32px rgba(0,0,0,0.38)',
    '2xl':'0 32px 48px rgba(0,0,0,0.45)'
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
    fontFamily: DESIGN_TOKENS.typography.fontFamily,
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
    /* Lifted cards on hover */
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.04)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: DESIGN_TOKENS.shadows.lg
          }
        }
      }
    },

    /* Rounded, weight-balanced buttons */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.borderRadius.md,
          textTransform: 'none',
          fontWeight: DESIGN_TOKENS.typography.fontWeights.medium
        }
      }
    },

    /* Gradient AppBar matching new navy palette */
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg,#030e26 0%,#0d2c6b 100%)',
          boxShadow: DESIGN_TOKENS.shadows.md,
          backdropFilter: 'blur(10px)'
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
