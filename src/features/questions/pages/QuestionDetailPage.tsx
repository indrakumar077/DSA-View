import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { GenericQuestionPage } from './GenericQuestionPage';
import { useQuestionData } from '../../../core/hooks/useQuestionData';
import { themeColors } from '../../../theme';
import { ROUTES } from '../../../constants';

export const QuestionDetailPage = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const question = useQuestionData();

  // Use GenericQuestionPage for questions that have data
  if (question) {
    return <GenericQuestionPage question={question} />;
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
          fontSize: '1rem',
          color: themeColors.textSecondary,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        The question {slug || id ? `"${slug || id}"` : ''} does not exist or hasn't been implemented yet.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={() => navigate(ROUTES.QUESTIONS)}
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


