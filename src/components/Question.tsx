import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import GenericQuestion from './GenericQuestion';
import { questionsData } from '../data/questions';
import { themeColors } from '../theme';

const Question = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionId = id ? parseInt(id, 10) : 1;

  // Use GenericQuestion for questions that have data
  if (questionsData[questionId]) {
    return <GenericQuestion question={questionsData[questionId]} />;
  }

  // For other questions - display proper error page
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: themeColors.backgroundDark,
        padding: 3,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2rem', sm: '3rem' },
          fontWeight: 700,
          color: themeColors.white,
          marginBottom: 2,
        }}
      >
        Question Not Found
      </Typography>
      <Typography
        sx={{
          fontSize: '1.125rem',
          color: themeColors.textSecondary,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        The question #{questionId} does not exist or hasn't been implemented yet.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={() => navigate('/dashboard/questions')}
        sx={{
          backgroundColor: themeColors.primary,
          color: themeColors.textPrimary,
          '&:hover': {
            backgroundColor: `${themeColors.primary}e6`,
          },
        }}
      >
        Back to Questions
      </Button>
    </Box>
  );
};

export default Question;

