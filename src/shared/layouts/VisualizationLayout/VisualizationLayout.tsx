import { ReactNode } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import { ArrowBack, Code, Article, Search } from '@mui/icons-material';
import { themeColors } from '../../../theme';
import { ROUTES } from '../../../constants/routes';
import { VisualizationControlBar } from '../../components/VisualizationControlBar';
import { ResizableSplitPane } from '../../components/ResizableSplitPane';
import { VisualizationControls } from '../../../types';
import { useQuestionData } from '../../../core/hooks/useQuestionData';

interface VisualizationLayoutProps {
  title: string;
  questionId: number;
  activeTab: number;
  onTabChange: (tab: number) => void;
  visualizationContent: ReactNode;
  explanationContent?: ReactNode;
  codeContent: ReactNode;
  controls?: VisualizationControls;
}

export const VisualizationLayout = ({
  title,
  questionId,
  activeTab,
  onTabChange,
  visualizationContent,
  explanationContent,
  codeContent,
  controls,
}: VisualizationLayoutProps) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const question = useQuestionData();
  const location = useLocation();
  const isOnQuestionsPage = location.pathname === ROUTES.QUESTIONS;

  const handleSearchClick = (e?: React.MouseEvent) => {
    if (!isOnQuestionsPage) {
      e?.preventDefault();
      e?.stopPropagation();
      navigate(`${ROUTES.QUESTIONS}?focusSearch=true`);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: themeColors.backgroundDark,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${themeColors.borderLight}`,
          backgroundColor: themeColors.inputBgDark,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => {
              const questionSlug = slug || question?.slug;
              if (questionSlug) {
                navigate(ROUTES.PROBLEM_DESCRIPTION(questionSlug));
              } else {
                navigate(ROUTES.QUESTIONS);
              }
            }}
            sx={{
              color: themeColors.white,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: `${themeColors.white}1a`,
              },
            }}
          >
            Back
          </Button>
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: themeColors.white,
            }}
          >
            DSA View
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => {
              navigate(`${ROUTES.QUESTIONS}?focusSearch=true`);
            }}
            sx={{
              display: { xs: 'none', md: 'flex' },
              maxWidth: 320,
              width: '100%',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              padding: 0,
              margin: 0,
              textTransform: 'none',
              minWidth: 'auto',
              '&:hover': {
                background: 'transparent',
              },
            }}
          >
            <TextField
              placeholder="Search questions..."
              readOnly
              sx={{
                width: '100%',
                pointerEvents: 'none',
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  backgroundColor: `${themeColors.white}0d`,
                  color: themeColors.white,
                  cursor: 'pointer',
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
          </Button>
          <Button
            onClick={() => navigate(ROUTES.QUESTIONS)}
            sx={{
              color: themeColors.primary,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          minHeight: 48,
          display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${themeColors.borderLight}`,
        }}
      >
        <Box
          sx={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: themeColors.white,
              }}
            >
              {title}
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(_e, newValue) => onTabChange(newValue)}
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  color: themeColors.textSecondary,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  minHeight: 48,
                  padding: '0 16px',
                  '&.Mui-selected': {
                    color: themeColors.primary,
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: themeColors.primary,
                },
              }}
            >
              <Tab icon={<Code />} iconPosition="start" label="Visualization" />
              <Tab icon={<Article />} iconPosition="start" label="Explanation" />
            </Tabs>
          </Box>
        </Box>
        {activeTab === 0 && controls && (
          <VisualizationControlBar {...controls} />
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ResizableSplitPane
          defaultLeftWidth={50}
          minLeftWidth={20}
          minRightWidth={20}
          left={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
              }}
            >
              {activeTab === 0 ? visualizationContent : explanationContent || visualizationContent}
            </Box>
          }
          right={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {codeContent}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

