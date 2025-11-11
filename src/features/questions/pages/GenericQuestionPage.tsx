import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Button,
} from '@mui/material';
import { Description, Code, Article } from '@mui/icons-material';
import { themeColors } from '../../../theme';
import { Header } from '../../../shared/ui';
import { ResizableSplitPane } from '../../../shared/components/ResizableSplitPane';
import { QuestionData, Language } from '../../../types';
import { VisualizationControlProvider, useVisualizationControls } from '../../../core/contexts/VisualizationControlContext';
import { TwoSumVisualizationPage } from '../visualizations/TwoSum/TwoSumVisualizationPage';
import { BestTimeToBuyAndSellStockVisualizationPage } from '../visualizations/BestTimeToBuyAndSellStock/BestTimeToBuyAndSellStockVisualizationPage';
import { TrappingRainWaterVisualizationPage } from '../visualizations/TrappingRainWater/TrappingRainWaterVisualizationPage';
import { ROUTES } from '../../../constants';

interface GenericQuestionPageProps {
  question: QuestionData;
}

const GenericQuestionPageContent = ({ question }: GenericQuestionPageProps) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [language, setLanguage] = useState<Language>(Language.PYTHON);
  const { controls } = useVisualizationControls();

  // Sync active tab with URL
  useEffect(() => {
    if (location.pathname.includes('/visualization')) {
      setActiveTab(1);
    } else if (location.pathname.includes('/explanation')) {
      setActiveTab(2);
    } else {
      setActiveTab(0);
    }
  }, [location.pathname]);

  // Get visualization component based on question ID (LeetCode number)
  const getVisualizationComponent = () => {
    switch (question.id) { // question.id === question.leetcodeNumber
      case 1: // LeetCode #1
        return <TwoSumVisualizationPage />;
      case 121: // LeetCode #121
        return <BestTimeToBuyAndSellStockVisualizationPage />;
      case 42: // LeetCode #42
        return <TrappingRainWaterVisualizationPage />;
      default:
        return null;
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: themeColors.backgroundDark,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <Header
        showSearch={true}
        navigationItems={[
          {
            label: 'Dashboard',
            isActive: false,
            onClick: () => navigate(ROUTES.QUESTIONS),
          },
        ]}
      />

      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: themeColors.backgroundDark,
            width: '100%',
          }}
        >
              {/* Tabs */}
              <Box
                sx={{
                  borderBottom: `1px solid ${themeColors.borderLight}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_e, newValue) => {
                    setActiveTab(newValue);
                    const questionSlug = slug || question.slug;
                    if (newValue === 0) {
                      navigate(ROUTES.PROBLEM_DESCRIPTION(questionSlug));
                    } else if (newValue === 1) {
                      navigate(ROUTES.PROBLEM_VISUALIZATION(questionSlug));
                    } else if (newValue === 2) {
                      navigate(ROUTES.PROBLEM_EXPLANATION(questionSlug));
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    flex: 1,
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
                  <Tab icon={<Description />} iconPosition="start" label="Description" />
                  {question.hasVisualization && (
                    <Tab icon={<Code />} iconPosition="start" label="Visualization" />
                  )}
                  {question.explanation && (
                    <Tab icon={<Article />} iconPosition="start" label="Explanation" />
                  )}
                </Tabs>
                
              </Box>

              {/* Tab Content */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {activeTab === 0 && (
                  <ResizableSplitPane
                    defaultLeftWidth={60}
                    minLeftWidth={30}
                    minRightWidth={30}
                    left={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '24px',
                          padding: '24px',
                          height: '100%',
                          overflow: 'auto',
                        }}
                      >
                        {/* Description */}
                        <Box
                          sx={{
                            color: themeColors.textSecondary,
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            '& p': {
                              marginBottom: '12px',
                            },
                            '& code': {
                              backgroundColor: `${themeColors.white}1a`,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                            },
                          }}
                        >
                          {question.description.split('\n').map((para, idx) => (
                            <p key={idx}>{para}</p>
                          ))}
                        </Box>

                        {/* Examples */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: themeColors.white,
                            }}
                          >
                            Examples
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {question.examples.map((example, idx) => (
                              <Box key={idx}>
                                <Typography
                                  sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: themeColors.textSecondary,
                                    marginBottom: '8px',
                                  }}
                                >
                                  Example {idx + 1}:
                                </Typography>
                                <Paper
                                  sx={{
                                    backgroundColor: `${themeColors.inputBgDark}80`,
                                    padding: '12px',
                                    borderRadius: '0.5rem',
                                    border: `1px solid ${themeColors.borderLight}`,
                                  }}
                                >
                                  <Typography
                                    component="pre"
                                    sx={{
                                      fontSize: '0.875rem',
                                      color: themeColors.white,
                                      fontFamily: 'monospace',
                                      whiteSpace: 'pre-wrap',
                                      margin: 0,
                                      '& strong': {
                                        fontWeight: 600,
                                      },
                                    }}
                                  >
                                    <strong>Input:</strong> {example.input}
                                    {'\n'}
                                    <strong>Output:</strong> {example.output}
                                    {example.explanation && (
                                      <>
                                        {'\n'}
                                        <strong>Explanation:</strong> {example.explanation}
                                      </>
                                    )}
                                  </Typography>
                                </Paper>
                              </Box>
                            ))}
                          </Box>
                        </Box>

                        {/* Constraints */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: themeColors.white,
                            }}
                          >
                            Constraints
                          </Typography>
                          <Box
                            component="ul"
                            sx={{
                              listStyle: 'disc',
                              paddingLeft: '20px',
                              color: themeColors.textSecondary,
                              fontSize: '0.875rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              '& li': {
                                '& code': {
                                  backgroundColor: `${themeColors.white}1a`,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.875rem',
                                  fontFamily: 'monospace',
                                },
                              },
                            }}
                          >
                            {question.constraints.map((constraint, idx) => (
                              <li key={idx}>{constraint}</li>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    }
                    right={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          padding: '24px',
                        }}
                      >
                        <Paper
                          sx={{
                            borderRadius: '0.75rem',
                            border: `1px solid ${themeColors.borderLight}`,
                            backgroundColor: `${themeColors.inputBgDark}80`,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                          }}
                        >
                          {/* Code Editor Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '12px',
                              borderBottom: `1px solid ${themeColors.borderLight}`,
                            }}
                          >
                            <FormControl size="small">
                              <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                sx={{
                                  backgroundColor: `${themeColors.white}0d`,
                                  color: themeColors.white,
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  minWidth: '120px',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: themeColors.borderLight,
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: themeColors.borderLight,
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: themeColors.primary,
                                  },
                                  '& .MuiSvgIcon-root': {
                                    color: themeColors.white,
                                  },
                                }}
                              >
                                <MenuItem value={Language.PYTHON}>Python</MenuItem>
                                <MenuItem value={Language.JAVA}>Java</MenuItem>
                                <MenuItem value={Language.CPP}>C++</MenuItem>
                                <MenuItem value={Language.JAVASCRIPT}>JavaScript</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          {/* Code Display */}
                          <Box
                            sx={{
                              flex: 1,
                              backgroundColor: themeColors.backgroundDark,
                              padding: '16px',
                              overflow: 'auto',
                              minHeight: 0,
                            }}
                          >
                            <Typography
                              component="pre"
                              sx={{
                                fontSize: '0.875rem',
                                color: themeColors.white,
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                margin: 0,
                                lineHeight: 1.6,
                              }}
                            >
                              <code>
                                {question.codes[language as keyof typeof question.codes] ||
                                  question.codes.Python}
                              </code>
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    }
                  />
                )}

                {activeTab === 1 && question.hasVisualization && (
                  <Box
                    sx={{
                      flex: 1,
                      overflow: 'hidden',
                      position: 'relative',
                      '& > div': {
                        height: '100% !important',
                        display: 'flex !important',
                        flexDirection: 'column !important',
                        '& > div:first-of-type': {
                          // Hide the header section (Back button, DSA View, Dashboard)
                          display: 'none !important',
                        },
                        '& > div:nth-of-type(2)': {
                          // Hide the entire toolbar section (title, tabs, and controls)
                          display: 'none !important',
                        },
                        '& > div:nth-of-type(3)': {
                          // Make the main content area take full height with scrolling
                          flex: '1 1 auto !important',
                          height: '100% !important',
                          overflow: 'hidden !important',
                          '& > div': {
                            height: '100% !important',
                            overflow: 'auto !important',
                          },
                        },
                      },
                    }}
                  >
                    {getVisualizationComponent()}
                  </Box>
                )}

                {activeTab === (question.hasVisualization ? 2 : 1) && question.explanation && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      overflow: 'auto',
                      padding: '24px',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: themeColors.white,
                          marginBottom: '16px',
                        }}
                      >
                        Approach
                      </Typography>
                      <Typography
                        sx={{
                          color: themeColors.textSecondary,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {question.explanation.approach}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: themeColors.white,
                          marginBottom: '16px',
                        }}
                      >
                        Steps
                      </Typography>
                      <Box
                        component="ol"
                        sx={{
                          listStyle: 'decimal',
                          paddingLeft: '20px',
                          color: themeColors.textSecondary,
                          fontSize: '0.875rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                        }}
                      >
                        {question.explanation.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: themeColors.white,
                            marginBottom: '8px',
                          }}
                        >
                          Time Complexity
                        </Typography>
                        <Typography
                          sx={{
                            color: themeColors.textSecondary,
                            fontSize: '0.875rem',
                          }}
                        >
                          {question.explanation.timeComplexity}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: themeColors.white,
                            marginBottom: '8px',
                          }}
                        >
                          Space Complexity
                        </Typography>
                        <Typography
                          sx={{
                            color: themeColors.textSecondary,
                            fontSize: '0.875rem',
                          }}
                        >
                          {question.explanation.spaceComplexity}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
      </Box>
    </Box>
  );
};

export const GenericQuestionPage = ({ question }: GenericQuestionPageProps) => {
  return (
    <VisualizationControlProvider>
      <GenericQuestionPageContent question={question} />
    </VisualizationControlProvider>
  );
};

