import { createTheme } from '@mui/material/styles';
import { themeConfig } from './config/theme.config';

// Re-export theme config for easy access
export const themeColors = themeConfig.colors;
export const themeFonts = themeConfig.fonts;
export const themeLogos = themeConfig.logos;

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
    fontFamily: themeFonts.primary,
    h1: {
      fontFamily: themeFonts.primary,
      fontWeight: themeFonts.weights.bold,
    },
    h2: {
      fontFamily: themeFonts.primary,
      fontWeight: themeFonts.weights.black,
    },
    h3: {
      fontFamily: themeFonts.primary,
      fontWeight: themeFonts.weights.bold,
    },
    body1: {
      fontFamily: themeFonts.primary,
    },
    button: {
      fontFamily: themeFonts.primary,
      fontWeight: themeFonts.weights.bold,
      textTransform: 'none',
      letterSpacing: themeFonts.letterSpacing.wide,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          padding: '12px 20px',
          fontSize: '0.875rem',
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

