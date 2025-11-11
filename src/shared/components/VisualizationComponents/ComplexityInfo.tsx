import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../theme';

interface ComplexityInfoProps {
  timeComplexity: string;
  spaceComplexity: string;
}

export const ComplexityInfo = ({ timeComplexity, spaceComplexity }: ComplexityInfoProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        backgroundColor: themeColors.inputBgDark,
        px: 3,
        py: 2,
        borderRadius: 2,
        border: `1px solid ${themeColors.borderLight}`,
        width: '100%',
        maxWidth: '500px',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: themeColors.textSecondary,
            mb: 0.5,
          }}
        >
          Time Complexity
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: themeColors.primary,
            fontFamily: 'monospace',
          }}
        >
          {timeComplexity}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '1px',
          backgroundColor: themeColors.borderLight,
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: themeColors.textSecondary,
            mb: 0.5,
          }}
        >
          Space Complexity
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: themeColors.primary,
            fontFamily: 'monospace',
          }}
        >
          {spaceComplexity}
        </Typography>
      </Box>
    </Box>
  );
};

