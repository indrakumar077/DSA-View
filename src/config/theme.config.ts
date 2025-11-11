/**
 * CENTRALIZED THEME CONFIGURATION
 * 
 * Sab kuch yaha se change kar sakte ho:
 * - Colors (sab colors)
 * - Fonts (font families, sizes)
 * - Logos (logo paths, components)
 * - Spacing, borders, shadows, etc.
 * 
 * Ek jagah change karo, sab jagah apply ho jayega!
 */

// ============================================
// COLORS - Sab colors yaha se manage karo
// ============================================
export const themeColors = {
  // Primary Colors
  primary: '#13b6ec',
  primaryHover: 'rgba(19, 182, 236, 0.9)',
  primaryLight: 'rgba(19, 182, 236, 0.1)',
  primaryDark: '#0d8fb8',
  
  // Background Colors
  backgroundLight: '#f6f8f8',
  backgroundDark: '#101d22',
  backgroundDarker: '#0a1418',
  
  // Text Colors
  textPrimary: '#111e22',
  textSecondary: '#92bbc9',
  textWhite: '#ffffff',
  textMuted: '#9ca3af',
  
  // Border Colors
  borderLight: '#325a67',
  borderPrimary: '#13b6ec',
  borderSecondary: '#92bbc9',
  
  // Input Colors
  inputBgLight: '#f6f8f8',
  inputBgDark: '#192d33',
  inputBorder: '#325a67',
  inputBorderFocus: '#13b6ec',
  
  // State Colors (for visualizations)
  stateCurrent: '#13b6ec',
  stateSolution: '#10b981',
  stateVisited: '#9ca3af',
  stateError: '#ef4444',
  stateWarning: '#f59e0b',
  stateSuccess: '#10b981',
  
  // Gray Scale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Base Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Difficulty Colors
  difficultyEasy: '#10b981',
  difficultyMedium: '#f59e0b',
  difficultyHard: '#ef4444',
  
  // Status Colors
  statusSolved: '#10b981',
  statusAttempted: '#f59e0b',
  statusNotStarted: '#9ca3af',
} as const;

// ============================================
// FONTS - Sab fonts yaha se manage karo
// ============================================
export const themeFonts = {
  // Font Families
  primary: '"Space Grotesk", "Roboto", "Helvetica", "Arial", sans-serif',
  secondary: '"Roboto", "Helvetica", "Arial", sans-serif',
  mono: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
  
  // Font Sizes
  sizes: {
    xs: '0.65rem',      // 10.4px
    sm: '0.75rem',     // 12px
    base: '0.875rem',  // 14px
    md: '0.9375rem',   // 15px
    lg: '1rem',        // 16px
    xl: '1.125rem',    // 18px
    '2xl': '1.25rem',  // 20px
    '3xl': '1.5rem',   // 24px
    '4xl': '1.875rem', // 30px
    '5xl': '2.25rem',  // 36px
  },
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================
// LOGOS - Sab logos yaha se manage karo
// ============================================
export const themeLogos = {
  // Logo Paths (if using image files)
  main: '/logos/dsa-logo.svg',
  icon: '/logos/dsa-icon.svg',
  favicon: '/favicon.ico',
  
  // Logo Sizes
  sizes: {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    '2xl': 96,
  },
  
  // Logo Colors (for SVG logos)
  colors: {
    primary: themeColors.primary,
    white: themeColors.white,
    dark: themeColors.backgroundDark,
  },
} as const;

// ============================================
// SPACING - Consistent spacing values
// ============================================
export const themeSpacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// ============================================
// BORDERS - Border styles
// ============================================
export const themeBorders = {
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',  // Full circle
  },
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
} as const;

// ============================================
// SHADOWS - Box shadows
// ============================================
export const themeShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: `0 0 20px ${themeColors.primary}33`,
  glowStrong: `0 0 30px ${themeColors.primary}66`,
} as const;

// ============================================
// TRANSITIONS - Animation timings
// ============================================
export const themeTransitions = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
  slower: '0.75s ease',
  slowest: '1s ease',
} as const;

// ============================================
// Z-INDEX - Layer management
// ============================================
export const themeZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================
// BREAKPOINTS - Responsive breakpoints
// ============================================
export const themeBreakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// ============================================
// EXPORT ALL THEME CONFIG
// ============================================
export const themeConfig = {
  colors: themeColors,
  fonts: themeFonts,
  logos: themeLogos,
  spacing: themeSpacing,
  borders: themeBorders,
  shadows: themeShadows,
  transitions: themeTransitions,
  zIndex: themeZIndex,
  breakpoints: themeBreakpoints,
} as const;

// Type exports for TypeScript
export type ThemeColors = typeof themeColors;
export type ThemeFonts = typeof themeFonts;
export type ThemeLogos = typeof themeLogos;
export type ThemeConfig = typeof themeConfig;

