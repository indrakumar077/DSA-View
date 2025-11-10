import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import { Search, Person, Code } from '@mui/icons-material';
import { themeColors } from '../theme';

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  navigationItems?: Array<{
    label: string;
    isActive?: boolean;
    onClick?: () => void;
  }>;
}

const Header = ({
  showSearch = true,
  searchValue = '',
  onSearchChange,
  navigationItems = [],
}: HeaderProps) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: `${themeColors.backgroundDark}cc`,
        backdropFilter: 'blur(4px)',
        borderBottom: `1px solid ${themeColors.borderLight}`,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingX: { xs: 2, sm: 4 },
          paddingY: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code
              sx={{
                fontSize: 24,
                color: themeColors.primary,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: themeColors.white,
                letterSpacing: '-0.015em',
              }}
            >
              DSA View
            </Typography>
          </Box>
          {navigationItems.length > 0 && (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 4.5,
              }}
            >
              {navigationItems.map((item, index) => (
                <Typography
                  key={index}
                  component={item.onClick ? 'button' : 'span'}
                  onClick={item.onClick}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: item.isActive ? 600 : 500,
                    color: item.isActive
                      ? themeColors.primary
                      : themeColors.textSecondary,
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: item.onClick ? 'pointer' : 'default',
                    padding: 0,
                    font: 'inherit',
                    transition: 'color 0.2s ease',
                    '&::after': item.isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: themeColors.primary,
                        }
                      : {},
                    '&:hover': item.onClick
                      ? {
                          color: item.isActive
                            ? themeColors.primary
                            : themeColors.white,
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {showSearch && (
            <TextField
              placeholder="Search questions..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              sx={{
                display: { xs: 'none', md: 'flex' },
                maxWidth: 320,
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  backgroundColor: `${themeColors.white}0d`,
                  color: themeColors.white,
                  '& fieldset': {
                    borderColor: `${themeColors.borderLight}80`,
                  },
                  '&:hover fieldset': {
                    borderColor: themeColors.borderLight,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: 2,
                    boxShadow: `0 0 0 2px ${themeColors.primary}33`,
                  },
                  '& input::placeholder': {
                    color: themeColors.textSecondary,
                    opacity: 1,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: themeColors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <IconButton
            aria-label="User profile"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: `${themeColors.white}1a`,
              color: themeColors.white,
              '&:hover': {
                backgroundColor: `${themeColors.white}33`,
              },
              transition: 'background-color 0.2s ease',
            }}
          >
            <Person />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

