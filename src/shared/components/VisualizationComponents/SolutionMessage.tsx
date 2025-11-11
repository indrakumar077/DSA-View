import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../theme';
import { ComplexityInfo } from './ComplexityInfo';

interface SolutionMessageProps {
  result: number | number[] | any;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export const SolutionMessage = ({
  result,
  timeComplexity = 'O(n)',
  spaceComplexity = 'O(n)',
}: SolutionMessageProps) => {
  // Format result based on its type
  const formatResult = () => {
    if (Array.isArray(result)) {
      return `Indices: [${result.join(', ')}]`;
    } else if (typeof result === 'number') {
      return `Max Profit: ${result}`;
    } else {
      return `Result: ${JSON.stringify(result)}`;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#10b981',
          color: themeColors.white,
          px: 3,
          py: 1.5,
          borderRadius: 2,
          fontSize: '0.9375rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
          animation: 'pulse 0.8s ease infinite',
          width: '100%',
          maxWidth: '500px',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
          },
        }}
      >
        🎉 Solution Found! {formatResult()}
      </Box>
      <ComplexityInfo timeComplexity={timeComplexity} spaceComplexity={spaceComplexity} />
    </Box>
  );
};

