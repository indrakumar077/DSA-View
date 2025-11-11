import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../theme';
import { ComplexityInfo } from './ComplexityInfo';

interface SolutionMessageProps {
  result: number[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export const SolutionMessage = ({
  result,
  timeComplexity = 'O(n)',
  spaceComplexity = 'O(n)',
}: SolutionMessageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        width: '100%',
        mb: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#10b981',
          color: themeColors.white,
          px: 4,
          py: 2,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
          animation: 'pulse 0.8s ease infinite',
          width: '100%',
          maxWidth: '500px',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
        }}
      >
        🎉 Solution Found! Indices: [{result.join(', ')}]
      </Box>
      <ComplexityInfo timeComplexity={timeComplexity} spaceComplexity={spaceComplexity} />
    </Box>
  );
};

