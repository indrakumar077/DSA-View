# 🎨 Theme Configuration Guide

## Centralized Theme System

Sab kuch ek jagah se manage karo! Colors, fonts, logos - sab `src/config/theme.config.ts` me hai.

## 📍 Location

**Main Config File:** `src/config/theme.config.ts`

## 🎨 Colors Change Karne Ke Liye

```typescript
// src/config/theme.config.ts me jao
export const themeColors = {
  primary: '#13b6ec',  // Yaha se primary color change karo
  backgroundDark: '#101d22',  // Background color change karo
  // ... sab colors yaha hai
};
```

### Available Color Categories:

1. **Primary Colors** - Main brand colors
2. **Background Colors** - Page backgrounds
3. **Text Colors** - Text colors
4. **Border Colors** - Border colors
5. **Input Colors** - Form input colors
6. **State Colors** - Visualization states (current, solution, etc.)
7. **Gray Scale** - Gray shades
8. **Difficulty Colors** - Easy/Medium/Hard
9. **Status Colors** - Solved/Attempted/Not Started

## 🔤 Fonts Change Karne Ke Liye

```typescript
// src/config/theme.config.ts me jao
export const themeFonts = {
  primary: '"Space Grotesk", "Roboto", ...',  // Main font change karo
  mono: '"Fira Code", "Consolas", ...',  // Code font change karo
  
  sizes: {
    base: '0.875rem',  // Base font size change karo
    // ... sab sizes yaha hai
  },
  
  weights: {
    bold: 700,  // Font weight change karo
    // ... sab weights yaha hai
  },
};
```

### Available Font Settings:

- **Font Families** - primary, secondary, mono
- **Font Sizes** - xs to 5xl
- **Font Weights** - light to black
- **Line Heights** - tight to loose
- **Letter Spacing** - tighter to widest

## 🖼️ Logos Change Karne Ke Liye

```typescript
// src/config/theme.config.ts me jao
export const themeLogos = {
  main: '/logos/dsa-logo.svg',  // Logo path change karo
  icon: '/logos/dsa-icon.svg',  // Icon path change karo
  
  sizes: {
    md: 32,  // Logo size change karo
    // ... sab sizes yaha hai
  },
  
  colors: {
    primary: '#13b6ec',  // Logo color change karo
    // ... sab colors yaha hai
  },
};
```

### Logo Usage:

```tsx
import { DSALogoIcon } from '@/shared/ui';
import { themeLogos } from '@/config';

// Logo with different colors
<DSALogoIcon color="primary" />
<DSALogoIcon color="white" />
<DSALogoIcon color="dark" />

// Logo with custom size
<DSALogoIcon sx={{ fontSize: themeLogos.sizes.lg }} />
```

## 📐 Spacing, Borders, Shadows

```typescript
// src/config/theme.config.ts me jao

// Spacing
export const themeSpacing = {
  md: '1rem',  // Spacing change karo
  // ...
};

// Borders
export const themeBorders = {
  radius: {
    md: '0.5rem',  // Border radius change karo
    // ...
  },
};

// Shadows
export const themeShadows = {
  lg: '0 10px 15px ...',  // Shadow change karo
  // ...
};
```

## 💻 Usage in Code

### Import Theme Config:

```typescript
import { themeConfig, themeColors, themeFonts, themeLogos } from '@/config';
// OR
import { themeColors } from '@/theme';  // Already exported from theme.ts
```

### Use in Components:

```tsx
import { Box, Typography } from '@mui/material';
import { themeColors, themeFonts } from '@/config';

function MyComponent() {
  return (
    <Box
      sx={{
        backgroundColor: themeColors.backgroundDark,
        color: themeColors.textWhite,
        fontFamily: themeFonts.primary,
        fontSize: themeFonts.sizes.lg,
        padding: themeSpacing.md,
        borderRadius: themeBorders.radius.md,
        boxShadow: themeShadows.lg,
      }}
    >
      <Typography sx={{ color: themeColors.primary }}>
        Hello World
      </Typography>
    </Box>
  );
}
```

## 🔄 Quick Change Examples

### Primary Color Change:

```typescript
// src/config/theme.config.ts
export const themeColors = {
  primary: '#ff6b6b',  // Red color
  // ... rest
};
```

### Font Change:

```typescript
// src/config/theme.config.ts
export const themeFonts = {
  primary: '"Inter", "Roboto", ...',  // Inter font
  // ... rest
};
```

### Logo Change:

```typescript
// src/config/theme.config.ts
export const themeLogos = {
  main: '/logos/new-logo.svg',  // New logo
  // ... rest
};
```

## ✅ Benefits

1. **Single Source of Truth** - Sab kuch ek jagah
2. **Easy Updates** - Ek file me change, sab jagah apply
3. **Type Safe** - TypeScript support
4. **Consistent** - Sab components same colors use karte hain
5. **Maintainable** - Easy to update

## 📝 Notes

- Theme config file ko directly edit karo
- Changes automatically sab jagah apply honge
- TypeScript types automatically available hain
- No need to search for colors in multiple files

---

**Happy Theming! 🎨**

