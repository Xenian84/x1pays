import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E5FF',
      light: '#6EFFFF',
      dark: '#00B2CC',
      contrastText: '#0A1929',
    },
    secondary: {
      main: '#76FF03',
      light: '#B2FF59',
      dark: '#64DD17',
      contrastText: '#0A1929',
    },
    background: {
      default: '#0A1929',
      paper: '#132F4C',
    },
    text: {
      primary: '#E7EBF0',
      secondary: '#B2BAC2',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFB74D',
    },
    info: {
      main: '#00E5FF',
    },
    success: {
      main: '#76FF03',
    },
  },
  typography: {
    fontFamily: '"Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 229, 255, 0.1)',
    '0px 4px 8px rgba(0, 229, 255, 0.12)',
    '0px 8px 16px rgba(0, 229, 255, 0.14)',
    '0px 12px 24px rgba(0, 229, 255, 0.16)',
    '0px 16px 32px rgba(0, 229, 255, 0.18)',
    '0px 20px 40px rgba(0, 229, 255, 0.2)',
    '0px 24px 48px rgba(0, 229, 255, 0.22)',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 16px 32px rgba(0, 0, 0, 0.18)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '0px 24px 48px rgba(0, 0, 0, 0.22)',
    '0px 32px 64px rgba(0, 0, 0, 0.24)',
    '0px 40px 80px rgba(0, 0, 0, 0.26)',
    '0px 48px 96px rgba(0, 0, 0, 0.28)',
    '0px 56px 112px rgba(0, 0, 0, 0.3)',
    '0px 64px 128px rgba(0, 0, 0, 0.32)',
    '0px 72px 144px rgba(0, 0, 0, 0.34)',
    '0px 80px 160px rgba(0, 0, 0, 0.36)',
    '0px 88px 176px rgba(0, 0, 0, 0.38)',
    '0px 96px 192px rgba(0, 0, 0, 0.4)',
    '0px 104px 208px rgba(0, 0, 0, 0.42)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(0, 229, 255, 0.3)',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 229, 255, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#132F4C',
          borderRadius: 16,
          border: '1px solid rgba(0, 229, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10, 25, 41, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
        },
      },
    },
  },
});

export default theme;
