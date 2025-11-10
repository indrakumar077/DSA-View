import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  AppBar,
  Toolbar,
} from '@mui/material';
import DSALogoIcon from './DSALogoIcon';
import { themeColors } from '../theme';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match',
      });
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the Terms and Conditions');
      return;
    }

    console.log('Signup attempt:', formData);
    // Add your signup logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (name === 'confirmPassword' && errors.confirmPassword) {
      setErrors({});
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    // Check if passwords match when password changes
    if (formData.confirmPassword && e.target.value !== formData.confirmPassword) {
      setErrors({
        confirmPassword: 'Passwords do not match',
      });
    } else if (errors.confirmPassword) {
      setErrors({});
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        fontFamily: '"Space Grotesk", sans-serif',
        backgroundColor: themeColors.backgroundDark,
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${themeColors.borderLight}`,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingX: { xs: '24px', sm: '40px' },
            paddingY: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DSALogoIcon
              sx={{
                fontSize: 24,
                color: themeColors.primary,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: themeColors.white,
                letterSpacing: '-0.015em',
              }}
            >
              DSA View
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            sx={{
              minWidth: 84,
              height: 40,
              backgroundColor: themeColors.primary,
              color: themeColors.textPrimary,
              fontSize: '0.875rem',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: `${themeColors.primary}e6`,
              },
            }}
          >
            Log In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingY: '48px',
          paddingX: { xs: '16px', sm: '24px', lg: '32px' },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            width: '100%',
            maxWidth: '512px',
          }}
        >
          <Box sx={{ marginBottom: '32px', textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: '2.25rem',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.033em',
                color: themeColors.white,
                marginBottom: 1,
              }}
            >
              Create your DSA View account
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: themeColors.textSecondary,
              }}
            >
              See algorithms in action. Sign up to start learning.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: themeColors.inputBgDark,
              padding: 4,
              borderRadius: 1.5,
              border: `1px solid ${themeColors.borderLight}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Full Name Field */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.white,
                    marginBottom: 1,
                  }}
                >
                  Full Name
                </Typography>
                <TextField
                  name="fullName"
                  placeholder="e.g., Grace Hopper"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '48px',
                      backgroundColor: themeColors.inputBgDark,
                      color: 'white',
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
                  }}
                />
              </Box>

              {/* Email Field */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.white,
                    marginBottom: 1,
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 48,
                      backgroundColor: themeColors.backgroundDark,
                      color: themeColors.white,
                      '& fieldset': {
                        borderColor: themeColors.borderLight,
                      },
                      '&:hover fieldset': {
                        borderColor: themeColors.borderLight,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: themeColors.primary,
                        borderWidth: 2,
                        boxShadow: `0 0 0 2px ${themeColors.primary}80`,
                      },
                      '& input::placeholder': {
                        color: themeColors.textSecondary,
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.white,
                    marginBottom: 1,
                  }}
                >
                  Password
                </Typography>
                <TextField
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 48,
                      backgroundColor: themeColors.backgroundDark,
                      color: themeColors.white,
                      '& fieldset': {
                        borderColor: themeColors.borderLight,
                      },
                      '&:hover fieldset': {
                        borderColor: themeColors.borderLight,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: themeColors.primary,
                        borderWidth: 2,
                        boxShadow: `0 0 0 2px ${themeColors.primary}80`,
                      },
                      '& input::placeholder': {
                        color: themeColors.textSecondary,
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>

              {/* Confirm Password Field */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.white,
                    marginBottom: 1,
                  }}
                >
                  Confirm Password
                </Typography>
                <TextField
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 48,
                      backgroundColor: themeColors.backgroundDark,
                      color: themeColors.white,
                      '& fieldset': {
                        borderColor: errors.confirmPassword
                          ? 'error.main'
                          : themeColors.borderLight,
                      },
                      '&:hover fieldset': {
                        borderColor: errors.confirmPassword
                          ? 'error.main'
                          : themeColors.borderLight,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: errors.confirmPassword
                          ? 'error.main'
                          : themeColors.primary,
                        borderWidth: 2,
                        boxShadow: errors.confirmPassword
                          ? undefined
                          : `0 0 0 2px ${themeColors.primary}80`,
                      },
                      '& input::placeholder': {
                        color: themeColors.textSecondary,
                        opacity: 1,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'error.main',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Terms and Conditions */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                sx={{
                  color: themeColors.borderLight,
                  padding: 0.25,
                  marginTop: 0.25,
                  width: 16,
                  height: 16,
                  '&.Mui-checked': {
                    color: themeColors.primary,
                  },
                  '&.Mui-focusVisible': {
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px ${themeColors.primary}80`,
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: themeColors.textSecondary,
                  marginLeft: 1,
                  marginTop: 0.25,
                }}
              >
                I agree to the{' '}
                <Link
                  href="#"
                  sx={{
                    fontWeight: 500,
                    color: themeColors.primary,
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Terms and Conditions
                </Link>
                .
              </Typography>
            </Box>

            {/* Sign Up Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!termsAccepted}
              sx={{
                height: 48,
                backgroundColor: themeColors.primary,
                color: themeColors.textPrimary,
                fontSize: '0.875rem',
                fontWeight: 700,
                '&:hover': {
                  backgroundColor: `${themeColors.primary}e6`,
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px ${themeColors.primary}80`,
                },
                '&.Mui-disabled': {
                  backgroundColor: themeColors.gray400,
                  color: themeColors.white,
                },
              }}
            >
              Sign Up
            </Button>

            {/* Log In Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: themeColors.textSecondary,
                }}
              >
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontWeight: 700,
                    color: themeColors.primary,
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Signup;

