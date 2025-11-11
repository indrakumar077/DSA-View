import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { themeColors } from '../../../theme';
import { ROUTES } from '../../../constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Add your login logic here
    // After successful login, navigate to questions page
    navigate(ROUTES.QUESTIONS);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {/* Left Side - Hero Section */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '50%',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSqpbZqcl_-hiipvnt_rt9TbYCZPnkE63y_34VYoQIUBmaErlOPzwt_SER8fj0DdaolSYjqZefrfL-J6Mu2id2JopOL2DxeW4QIUHbVhULElkKEwmKR91zH_x4EzQ6etxHsOf3bfHIEx1Ndh3CEtivx3oZZgTt3pp4KpFPqOqXNdJEISZXIQyJusAawlHiAIY1LdzM52QyyfCpACrYhUwsI92Y33x8GOTYsgJr5bJ-4CEg7ALfqVSDZb0Vm_SUCANOipTaDt_O7Pc')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `${themeColors.backgroundDark}cc`,
            backdropFilter: 'blur(4px)',
            zIndex: 1,
          }}
        />
        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <Visibility
              sx={{
                fontSize: '48px',
                color: themeColors.primary,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: '2.25rem',
                fontWeight: 700,
                color: themeColors.white,
              }}
            >
              DSA View
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: '3rem',
                fontWeight: 900,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Animate Your Algorithms.
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 400,
                color: `${themeColors.white}b3`,
              }}
            >
              View DSA questions, your code, and see a line-by-line animated
              execution.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', lg: '50%' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColors.backgroundDark,
          padding: { xs: '24px', sm: '24px' },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            width: '100%',
            maxWidth: '448px',
            padding: { xs: '16px', sm: '16px' },
          }}
        >
          <Box sx={{ marginBottom: 4, textAlign: { xs: 'center', lg: 'left' } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: themeColors.white,
                marginBottom: 1,
              }}
            >
              Sign in to DSA View
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: themeColors.textSecondary,
              }}
            >
              Enter your details to access your account.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Email/Username Field */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: themeColors.white,
                  marginBottom: 1,
                }}
              >
                Email or Username
              </Typography>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
                <Box
                  sx={{
                    display: 'flex',
                    border: `1px solid ${themeColors.borderLight}`,
                    borderRight: 'none',
                    backgroundColor: themeColors.inputBgDark,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingX: 2,
                    borderTopLeftRadius: 1,
                    borderBottomLeftRadius: 1,
                    color: themeColors.textSecondary,
                    height: 56,
                  }}
                >
                  <Person />
                </Box>
                <TextField
                  name="email"
                  placeholder="Enter your email or username"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 56,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeft: 'none',
                      backgroundColor: themeColors.inputBgDark,
                      color: themeColors.white,
                      '& fieldset': {
                        borderLeft: 'none',
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
            </Box>

            {/* Password Field */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: themeColors.white,
                  marginBottom: 1,
                }}
              >
                Password
              </Typography>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
                <Box
                  sx={{
                    display: 'flex',
                    border: `1px solid ${themeColors.borderLight}`,
                    borderRight: 'none',
                    backgroundColor: themeColors.inputBgDark,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingX: 2,
                    borderTopLeftRadius: 1,
                    borderBottomLeftRadius: 1,
                    color: themeColors.textSecondary,
                    height: 56,
                  }}
                >
                  <Lock />
                </Box>
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 56,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeft: 'none',
                      borderRight: 'none',
                      backgroundColor: themeColors.inputBgDark,
                      color: themeColors.white,
                      '& fieldset': {
                        borderLeft: 'none',
                        borderRight: 'none',
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
                <IconButton
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                  sx={{
                    border: `1px solid ${themeColors.borderLight}`,
                    borderLeft: 'none',
                    backgroundColor: themeColors.inputBgDark,
                    borderRadius: 0,
                    borderTopRightRadius: 1,
                    borderBottomRightRadius: 1,
                    color: themeColors.textSecondary,
                    paddingX: 2,
                    height: 56,
                    '&:hover': {
                      backgroundColor: `${themeColors.inputBgDark}e6`,
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: themeColors.borderLight,
                      padding: '4px',
                      '&.Mui-checked': {
                        color: themeColors.primary,
                        backgroundColor: themeColors.primary,
                      },
                      '&.Mui-focusVisible': {
                        outline: 'none',
                        boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px rgba(19, 182, 236, 0.5)`,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 400,
                      color: themeColors.white,
                      marginLeft: 1.5,
                    }}
                  >
                    Remember Me
                  </Typography>
                }
              />
              <Link
                href="#"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: themeColors.primary,
                  textDecoration: 'underline',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: `${themeColors.primary}cc`,
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Sign In Button */}
            <Box sx={{ width: '100%', paddingTop: 1 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  minWidth: 84,
                  height: 48,
                  backgroundColor: themeColors.primary,
                  color: themeColors.textPrimary,
                  fontSize: '1rem',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: `${themeColors.primary}e6`,
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: `0 0 0 2px ${themeColors.backgroundDark}, 0 0 0 4px ${themeColors.primary}80`,
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: themeColors.textSecondary,
              }}
            >
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  fontWeight: 700,
                  color: themeColors.primary,
                  textDecoration: 'underline',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: `${themeColors.primary}cc`,
                  },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};


