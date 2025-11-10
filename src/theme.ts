import { createTheme } from '@mui/material/styles';

// Centralized color configuration - can be changed from here
export const themeColors = {
  primary: '#13b6ec',
  backgroundLight: '#f6f8f8',
  backgroundDark: '#101d22',
  textPrimary: '#111e22',
  textSecondary: '#92bbc9',
  borderLight: '#325a67',
  inputBgLight: '#f6f8f8',
  inputBgDark: '#192d33',
  gray50: '#f9fafb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
  gray200: '#e5e7eb',
};

export const theme = createTheme({
  palette: {
    mode: 'dark', // Default to dark mode
    primary: {
      main: themeColors.primary,
      contrastText: themeColors.textPrimary,
    },
    background: {
      default: themeColors.backgroundDark,
      paper: themeColors.backgroundDark,
    },
    text: {
      primary: themeColors.white,
      secondary: themeColors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 900,
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: '"Space Grotesk", sans-serif',
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.015em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '12px 20px',
          fontSize: '1rem',
          fontWeight: 700,
        },
        contained: {
          backgroundColor: themeColors.primary,
          color: themeColors.textPrimary,
          '&:hover': {
            backgroundColor: 'rgba(19, 182, 236, 0.9)',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px rgba(19, 182, 236, 0.5)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
            backgroundColor: themeColors.inputBgDark,
            color: themeColors.white,
            '& fieldset': {
              borderColor: themeColors.borderLight,
            },
            '&:hover fieldset': {
              borderColor: themeColors.borderLight,
            },
            '&.Mui-focused fieldset': {
              borderColor: themeColors.primary,
              borderWidth: '2px',
              boxShadow: `0 0 0 2px rgba(19, 182, 236, 0.5)`,
            },
            '& input::placeholder': {
              color: themeColors.textSecondary,
              opacity: 1,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: themeColors.borderLight,
          '&.Mui-checked': {
            color: themeColors.primary,
            backgroundColor: themeColors.primary,
          },
          '&.Mui-focusVisible': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px rgba(19, 182, 236, 0.5)`,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
});

// Light theme variant (if needed)
export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary,
      contrastText: themeColors.textPrimary,
    },
    background: {
      default: themeColors.backgroundLight,
      paper: themeColors.backgroundLight,
    },
    text: {
      primary: themeColors.gray900,
      secondary: themeColors.gray600,
    },
  },
  components: {
    ...theme.components,
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: themeColors.gray50,
            color: themeColors.gray900,
            '& fieldset': {
              borderColor: themeColors.gray300,
            },
            '&:hover fieldset': {
              borderColor: themeColors.gray300,
            },
            '&.Mui-focused fieldset': {
              borderColor: themeColors.primary,
              borderWidth: '2px',
              boxShadow: `0 0 0 2px rgba(19, 182, 236, 0.5)`,
            },
            '& input::placeholder': {
              color: themeColors.gray400,
              opacity: 1,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: themeColors.gray300,
          '&.Mui-checked': {
            color: themeColors.primary,
            backgroundColor: themeColors.primary,
          },
          '&.Mui-focusVisible': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${themeColors.backgroundLight}, 0 0 0 4px rgba(19, 182, 236, 0.5)`,
          },
        },
      },
    },
  },
});

