import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../theme';

interface StepDescriptionProps {
  description: string;
  isSolution?: boolean;
}

export const StepDescription = ({ description, isSolution = false }: StepDescriptionProps) => {
  const lines = description.split('\n');
  
  return (
    <Box
      sx={{
        mb: 1.5,
        p: 1,
        borderRadius: 1,
        backgroundColor: isSolution ? '#10b98133' : themeColors.backgroundDark,
        borderLeft: isSolution ? '3px solid #10b981' : `3px solid ${themeColors.primary}`,
      }}
    >
      {lines.map((line, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: '0.75rem',
            color: isSolution ? '#10b981' : themeColors.white,
            fontWeight: isSolution ? 700 : line.startsWith('Condition:') ? 600 : 500,
            mb: index < lines.length - 1 ? 0.4 : 0,
          }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

