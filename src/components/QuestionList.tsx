import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { CheckCircle, Search } from '@mui/icons-material';
import { themeColors } from '../theme';
import Header from './Header';
import { questionsData } from '../data/questions';

const QuestionList = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [topic, setTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetFilters = () => {
    setDifficulty('all');
    setStatus('all');
    setTopic('all');
    setSearchQuery('');
  };

  // Generate questions list from questionsData - only questions with data
  const allQuestions = Object.values(questionsData).map((q) => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    topic: q.topic,
    status: q.id === 1 ? 'solved' : 'notStarted', // Two Sum is marked as solved
    tags: q.tags || [],
  }));

  // Apply filters
  const questions = allQuestions.filter((q) => {
    // Difficulty filter
    if (difficulty !== 'all' && q.difficulty.toLowerCase() !== difficulty) {
      return false;
    }

    // Status filter
    if (status !== 'all') {
      if (status === 'viewed' && q.status === 'notStarted') {
        return false;
      }
      if (status === 'notViewed' && q.status !== 'notStarted') {
        return false;
      }
    }

    // Topic filter
    if (topic !== 'all' && q.topic.toLowerCase() !== topic) {
      return false;
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesTitle = q.title.toLowerCase().includes(query);
      const matchesTags = q.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesTitle && !matchesTags) {
        return false;
      }
    }

    return true;
  });

  const STATUS_COLORS = {
    solved: '#10b981',
    attempted: '#f59e0b',
    notStarted: themeColors.gray400,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle sx={{ color: STATUS_COLORS.solved, fontSize: 20 }} />
          </Box>
        );
      case 'attempted':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid ${STATUS_COLORS.attempted}`,
              backgroundColor: 'transparent',
            }}
          />
        );
      default:
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: `2px solid ${STATUS_COLORS.notStarted}`,
              backgroundColor: 'transparent',
            }}
          />
        );
    }
  };

  const DIFFICULTY_COLORS = {
    Easy: { bg: '#10b98133', text: '#10b981' },
    Medium: { bg: '#f59e0b33', text: '#f59e0b' },
    Hard: { bg: '#ef444433', text: '#ef4444' },
  };

  const getDifficultyColor = (difficulty: string) => {
    return (
      DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || {
        bg: `${themeColors.gray400}33`,
        text: themeColors.gray400,
      }
    );
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: themeColors.backgroundDark,
        fontFamily: '"Inter", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Header
        showSearch={false}
        navigationItems={[
          {
            label: 'Dashboard',
            isActive: true,
          },
        ]}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '24px', md: '32px' },
          paddingTop: { xs: '16px', md: '24px' },
          paddingBottom: { xs: '16px', md: '24px' },
          paddingLeft: { xs: '16px', md: '16px' },
          paddingRight: { xs: '16px', md: '16px' },
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Sidebar Filters */}
        <Box
          sx={{
            width: { xs: '100%', md: '256px', lg: '288px' },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '8px',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: themeColors.white,
                marginBottom: '24px',
              }}
            >
              Filters
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Difficulty */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: themeColors.textSecondary,
                    marginBottom: 1.5,
                  }}
                >
                  Difficulty
                </Typography>
                <RadioGroup
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  sx={{
                    marginLeft: 0,
                  }}
                >
                  <FormControlLabel
                    value="all"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        All
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="easy"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        Easy
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="medium"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        Medium
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="hard"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        Hard
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>

              {/* Status */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: themeColors.textSecondary,
                    marginBottom: 1.5,
                  }}
                >
                  Status
                </Typography>
                <RadioGroup
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{
                    marginLeft: 0,
                  }}
                >
                  <FormControlLabel
                    value="all"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        All
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="viewed"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        Viewed
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="notViewed"
                    sx={{
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    control={
                      <Radio
                        sx={{
                          color: themeColors.borderLight,
                          padding: 1,
                          '&.Mui-checked': {
                            color: themeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.white,
                        }}
                      >
                        Not Viewed
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>

              {/* Topic */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: themeColors.textSecondary,
                    marginBottom: '12px',
                  }}
                >
                  Topic
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    sx={{
                      backgroundColor: `${themeColors.white}0d`,
                      color: themeColors.white,
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
                    <MenuItem value="all">All Topics</MenuItem>
                    <MenuItem value="arrays">Arrays</MenuItem>
                    <MenuItem value="strings">Strings</MenuItem>
                    <MenuItem value="trees">Trees</MenuItem>
                    <MenuItem value="graphs">Graphs</MenuItem>
                    <MenuItem value="dp">Dynamic Programming</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Reset Button */}
              <Button
                onClick={handleResetFilters}
                fullWidth
                sx={{
                  height: 40,
                  backgroundColor: `${themeColors.white}1a`,
                  color: themeColors.white,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${themeColors.white}33`,
                  },
                }}
              >
                Reset Filters
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Search Bar and Title Row */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '20px',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: '1.875rem',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.033em',
                flexShrink: 0,
              }}
            >
              Showing {questions.length} Question{questions.length !== 1 ? 's' : ''}
            </Typography>
            
            <TextField
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: '400px',
                width: { xs: '100%', md: '400px' },
                flexShrink: 0,
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  backgroundColor: `${themeColors.white}0d`,
                  color: themeColors.white,
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
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'rgba(17, 30, 34, 0.5)',
              overflow: 'auto',
              flex: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <TableCell
                    sx={{
                      width: '64px',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: themeColors.textSecondary,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '30%',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: themeColors.textSecondary,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '15%',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: themeColors.textSecondary,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Difficulty
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '15%',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: themeColors.textSecondary,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Topic
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '30%',
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: themeColors.textSecondary,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Tags
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => {
                  const difficultyColors = getDifficultyColor(question.difficulty);
                  return (
                    <TableRow
                      key={question.id}
                      onClick={() => navigate(`/dashboard/questions/${question.id}`)}
                      sx={{
                        height: '64px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          textAlign: 'center',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {getStatusIcon(question.status)}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'white',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {question.title}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '9999px',
                            backgroundColor: difficultyColors.bg,
                            padding: '2px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: difficultyColors.text,
                          }}
                        >
                          {question.difficulty}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {question.topic}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: '8px 16px',
                          fontSize: '0.875rem',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}
                        >
                          {question.tags && question.tags.length > 0 ? (
                            question.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  height: '24px',
                                  fontSize: '0.7rem',
                                  backgroundColor: `${themeColors.primary}33`,
                                  color: themeColors.primary,
                                  border: `1px solid ${themeColors.primary}66`,
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    padding: '0 8px',
                                  },
                                }}
                              />
                            ))
                          ) : (
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: themeColors.textSecondary,
                                fontStyle: 'italic',
                              }}
                            >
                              No tags
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionList;

