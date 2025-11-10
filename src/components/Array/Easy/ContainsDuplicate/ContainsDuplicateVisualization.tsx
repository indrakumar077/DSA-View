import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  Code,
  Article,
} from '@mui/icons-material';
import { themeColors } from '../../../../theme';
import { questionsData } from '../../../../data/questions';
import { useVisualizationControls } from '../../../../contexts/VisualizationControlContext';

interface Step {
  line: number;
  i?: number;
  variables: Record<string, any>;
  seenSet: number[];
  description: string;
  isDuplicate?: boolean;
  result?: boolean;
}

const ContainsDuplicateVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 8;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([1, 2, 3, 1]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const generateSteps = (nums: number[]): Step[] => {
    const steps: Step[] = [];
    const seen = new Set<number>();

    steps.push({
      line: 1,
      variables: {},
      seenSet: [],
      description: 'Initialize empty set',
    });

    for (let i = 0; i < nums.length; i++) {
      steps.push({
        line: 2,
        i,
        variables: { i, 'nums[i]': nums[i] },
        seenSet: Array.from(seen),
        description: `Check element at index ${i}: ${nums[i]}`,
      });

      if (seen.has(nums[i])) {
        steps.push({
          line: 3,
          i,
          variables: { i, 'nums[i]': nums[i] },
          seenSet: Array.from(seen),
          description: `Duplicate found! ${nums[i]} already exists in set`,
          isDuplicate: true,
          result: true,
        });
        break;
      }

      steps.push({
        line: 4,
        i,
        variables: { i, 'nums[i]': nums[i] },
        seenSet: Array.from(seen),
        description: `${nums[i]} not in set, adding to set`,
      });

      seen.add(nums[i]);

      steps.push({
        line: 4,
        i,
        variables: { i, 'nums[i]': nums[i] },
        seenSet: Array.from(seen),
        description: `Set updated: {${Array.from(seen).join(', ')}}`,
      });
    }

    if (!steps[steps.length - 1].isDuplicate) {
      steps.push({
        line: 5,
        variables: {},
        seenSet: Array.from(seen),
        description: 'No duplicates found. All elements are distinct.',
        result: false,
      });
    }

    return steps;
  };

  const [steps, setSteps] = useState<Step[]>(() => generateSteps(nums));

  useEffect(() => {
    setSteps(generateSteps(nums));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return nextStep;
        });
      }, 1000 / speed) as unknown as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [currentStep, steps.length, isPlaying]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  }, [currentStep, steps.length]);

  const handleCustomInputClick = useCallback(() => {
    setShowCustomInput(true);
  }, []);

  useEffect(() => {
    registerControls({
      handlePlayPause,
      handlePrevious,
      handleNext,
      setSpeed,
      handleCustomInput: handleCustomInputClick,
      isPlaying,
      speed,
    });

    return () => {
      unregisterControls();
    };
  }, [isPlaying, speed, handlePlayPause, handlePrevious, handleNext, handleCustomInputClick, registerControls, unregisterControls]);

  const handleCustomInput = () => {
    try {
      const numArray = customNums
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (numArray.length >= 1) {
        setNums(numArray);
        setShowCustomInput(false);
        setCustomNums('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  const code = question?.codes?.[language as keyof typeof question.codes] || question?.codes?.Python || '';
  const codeLines = useMemo(() => {
    return code.split('\n');
  }, [code, language]);

  const getHighlightedLine = (stepLine: number, lang: string): number => {
    const currentCode = question?.codes?.[lang as keyof typeof question.codes] || question?.codes?.Python || '';
    if (!currentCode) return -1;
    const lines = currentCode.split('\n');
    
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /seen\s*=\s*set\(\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'Java' && /Set<.*>.*seen\s*=\s*new HashSet/.test(line)) {
          return i + 1;
        }
        if (lang === 'C++' && /unordered_set<.*>.*seen/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /const\s+seen\s*=\s*new Set\(\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /for\s+num\s+in\s+nums/.test(line)) {
          return i + 1;
        }
        if (lang === 'Java' && /for\s*\(int\s+num\s*:\s*nums\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'C++' && /for\s*\(int\s+num\s*:\s*nums\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /for\s*\(const\s+num\s+of\s+nums\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /if\s+num\s+in\s+seen/.test(line)) {
          return i + 1;
        }
        if (lang === 'Java' && /if\s*\(seen\.contains\(num\)\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'C++' && /if\s*\(seen\.find\(num\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /if\s*\(seen\.has\(num\)\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /seen\.add\(num\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'Java' && /seen\.add\(num\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'C++' && /seen\.insert\(num\)/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /seen\.add\(num\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /return\s+False/.test(line)) {
          return i + 1;
        }
        if (lang === 'Java' && /return\s+false/.test(line)) {
          return i + 1;
        }
        if (lang === 'C++' && /return\s+false/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /return\s+false/.test(line)) {
          return i + 1;
        }
      }
    }
    
    return -1;
  };

  const highlightedLine = getHighlightedLine(currentStepData.line, language);

  if (!steps || steps.length === 0 || !currentStepData) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#101d22',
          color: '#ffffff',
        }}
      >
        <h1>Loading visualization...</h1>
      </Box>
    );
  }

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
            onClick={() => navigate(`/dashboard/questions/${id}`)}
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
              fontSize: '1.25rem',
              fontWeight: 700,
              color: themeColors.white,
            }}
          >
            DSA View
          </Typography>
        </Box>
        <Button
          onClick={() => navigate('/dashboard/questions')}
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

      <Box
        sx={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${themeColors.borderLight}`,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            sx={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: themeColors.white,
            }}
          >
            Contains Duplicate
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => setActiveTab(newValue)}
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
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<PlayArrow />}
              onClick={() => setShowCustomInput(true)}
              sx={{
                color: themeColors.white,
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: `${themeColors.white}1a`,
                },
              }}
            >
              Test with Custom Input
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                onClick={handlePrevious}
                disabled={currentStep === 0}
                sx={{
                  color: themeColors.white,
                  '&:hover': {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                  '&.Mui-disabled': {
                    color: `${themeColors.white}4d`,
                  },
                }}
              >
                <SkipPrevious />
              </IconButton>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  color: themeColors.white,
                  '&:hover': {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentStep >= steps.length - 1}
                sx={{
                  color: themeColors.white,
                  '&:hover': {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                  '&.Mui-disabled': {
                    color: `${themeColors.white}4d`,
                  },
                }}
              >
                <SkipNext />
              </IconButton>
            </Box>
            <FormControl size="small">
              <Select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                sx={{
                  backgroundColor: themeColors.borderLight,
                  color: themeColors.white,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  minWidth: 90,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSvgIcon-root': {
                    color: themeColors.white,
                  },
                }}
              >
                <MenuItem value={0.5}>0.5x</MenuItem>
                <MenuItem value={1}>1x</MenuItem>
                <MenuItem value={1.5}>1.5x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {activeTab === 0 ? (
            <>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  p: 4,
                  position: 'relative',
                }}
              >
                {currentStepData.isDuplicate && currentStepData.result === true && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: '#ef4444',
                        color: themeColors.white,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                        textAlign: 'center',
                        animation: 'pulse 0.8s ease infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        },
                      }}
                    >
                      🎯 Duplicate Found! Return true
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 3,
                        backgroundColor: themeColors.inputBgDark,
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        border: `1px solid ${themeColors.borderLight}`,
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
                          O(n)
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
                          O(n)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {currentStepData.result === false && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: '#10b981',
                        color: themeColors.white,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      ✅ No Duplicates! Return false
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 3,
                        backgroundColor: themeColors.inputBgDark,
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        border: `1px solid ${themeColors.borderLight}`,
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
                          O(n)
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
                          O(n)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.textSecondary,
                      mb: 1,
                    }}
                  >
                    Array{' '}
                    <Box
                      component="code"
                      sx={{
                        backgroundColor: themeColors.inputBgDark,
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      nums
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {nums.map((num, idx) => {
                      const isCurrent = currentStepData.i === idx;
                      const isDuplicate = currentStepData.isDuplicate && isCurrent;
                      const inSet = currentStepData.seenSet.includes(num);
                      const isSolutionIndex = currentStepData.isDuplicate && isCurrent;

                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1.5,
                              border: isSolutionIndex
                                ? '3px solid #ef4444'
                                : isCurrent
                                ? `3px solid ${themeColors.primary}`
                                : inSet
                                ? `2px solid #10b981`
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isSolutionIndex
                                ? '#ef444433'
                                : isCurrent
                                ? `${themeColors.primary}33`
                                : inSet
                                ? '#10b9811a'
                                : 'transparent',
                              opacity: isCurrent || inSet || isSolutionIndex ? 1 : 0.3,
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: themeColors.white,
                              }}
                            >
                              {num}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: '0.75rem',
                              color: themeColors.textSecondary,
                            }}
                          >
                            {idx}
                          </Typography>
                          {isCurrent && (
                            <Typography
                              sx={{
                                mt: 1,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: isSolutionIndex ? '#ef4444' : themeColors.primary,
                              }}
                            >
                              i
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  borderTop: `1px solid ${themeColors.borderLight}`,
                  backgroundColor: themeColors.inputBgDark,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: currentStepData.isDuplicate 
                      ? '#ef444433' 
                      : currentStepData.result === false
                      ? '#10b98133'
                      : themeColors.backgroundDark,
                    borderLeft: currentStepData.isDuplicate 
                      ? '3px solid #ef4444' 
                      : currentStepData.result === false
                      ? '3px solid #10b981'
                      : `3px solid ${themeColors.primary}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: currentStepData.isDuplicate 
                        ? '#ef4444' 
                        : currentStepData.result === false
                        ? '#10b981'
                        : themeColors.white,
                      fontWeight: currentStepData.isDuplicate || currentStepData.result !== undefined ? 700 : 500,
                    }}
                  >
                    {currentStepData.description}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: themeColors.white,
                    mb: 1.5,
                  }}
                >
                  Variables
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        backgroundColor: themeColors.backgroundDark,
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        minHeight: 60,
                        maxHeight: 200,
                        overflow: 'auto',
                      }}
                    >
                      {Object.keys(currentStepData.variables).length > 0 ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            alignItems: 'center',
                          }}
                        >
                          {Object.entries(currentStepData.variables).map(([key, value]) => (
                            <Box
                              key={key}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: `${themeColors.primary}1a`,
                                padding: '4px 12px',
                                borderRadius: 1,
                                border: `1px solid ${themeColors.primary}33`,
                              }}
                            >
                              <Typography sx={{ color: themeColors.textSecondary }}>
                                {key}:
                              </Typography>
                              <Typography
                                sx={{
                                  color: themeColors.white,
                                  fontWeight: 600,
                                }}
                              >
                                {String(value)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            color: themeColors.textSecondary,
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                          }}
                        >
                          No variables yet
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: themeColors.white,
                    mb: 1.5,
                    mt: 2,
                  }}
                >
                  Hash Set (seen)
                </Typography>
                <Box
                  sx={{
                    backgroundColor: themeColors.backgroundDark,
                    p: 1.5,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    minHeight: 60,
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  {currentStepData.seenSet.length > 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        alignItems: 'center',
                      }}
                    >
                      {currentStepData.seenSet.map((num) => (
                        <Box
                          key={num}
                          sx={{
                            backgroundColor: '#10b9811a',
                            padding: '4px 12px',
                            borderRadius: 1,
                            border: '1px solid #10b98133',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#10b981',
                              fontWeight: 600,
                            }}
                          >
                            {num}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: themeColors.textSecondary,
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                      }}
                    >
                      Set is empty
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 4,
              }}
            >
              {question?.explanation && (
                <>
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 3,
                    }}
                  >
                    Approach
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: themeColors.textSecondary,
                      mb: 4,
                      lineHeight: 1.8,
                    }}
                  >
                    {question.explanation.approach}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 3,
                    }}
                  >
                    Steps
                  </Typography>
                  <Box component="ol" sx={{ pl: 3, mb: 4 }}>
                    {question.explanation.steps.map((step, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        sx={{
                          fontSize: '1rem',
                          color: themeColors.textSecondary,
                          mb: 2,
                          lineHeight: 1.8,
                        }}
                      >
                        {step}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 3,
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
                        {question.explanation.timeComplexity}
                      </Typography>
                    </Box>
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
                        {question.explanation.spaceComplexity}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {activeTab === 0 ? (
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${themeColors.borderLight}`,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${themeColors.borderLight}`,
                backgroundColor: themeColors.inputBgDark,
                px: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: themeColors.white,
                }}
              >
                Code
              </Typography>
              <FormControl size="small">
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    backgroundColor: themeColors.borderLight,
                    color: themeColors.white,
                    fontSize: '0.875rem',
                    minWidth: 100,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSvgIcon-root': {
                      color: themeColors.white,
                    },
                  }}
                >
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
              }}
            >
              <Box
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = highlightedLine === lineNum;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        backgroundColor: isHighlighted ? `${themeColors.primary}1a` : 'transparent',
                        borderLeft: isHighlighted ? `3px solid ${themeColors.primary}` : '3px solid transparent',
                        pl: isHighlighted ? 1 : 1.5,
                        py: 0.5,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          color: themeColors.textSecondary,
                          minWidth: 40,
                          fontSize: '0.75rem',
                          userSelect: 'none',
                        }}
                      >
                        {lineNum}
                      </Typography>
                      <Box
                        sx={{
                          color: isHighlighted ? themeColors.white : themeColors.textSecondary,
                          fontWeight: isHighlighted ? 600 : 400,
                          flex: 1,
                        }}
                      >
                        <code>{line}</code>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${themeColors.borderLight}`,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${themeColors.borderLight}`,
                backgroundColor: themeColors.inputBgDark,
                px: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: themeColors.white,
                }}
              >
                Code
              </Typography>
              <FormControl size="small">
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    backgroundColor: themeColors.borderLight,
                    color: themeColors.white,
                    fontSize: '0.875rem',
                    minWidth: 100,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSvgIcon-root': {
                      color: themeColors.white,
                    },
                  }}
                >
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
              }}
            >
              <Box
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = highlightedLine === lineNum;

                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        backgroundColor: isHighlighted ? `${themeColors.primary}1a` : 'transparent',
                        borderLeft: isHighlighted ? `3px solid ${themeColors.primary}` : '3px solid transparent',
                        pl: isHighlighted ? 1 : 1.5,
                        py: 0.5,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          color: themeColors.textSecondary,
                          minWidth: 40,
                          fontSize: '0.75rem',
                          userSelect: 'none',
                        }}
                      >
                        {lineNum}
                      </Typography>
                      <Box
                        sx={{
                          color: isHighlighted ? themeColors.white : themeColors.textSecondary,
                          fontWeight: isHighlighted ? 600 : 400,
                          flex: 1,
                        }}
                      >
                        <code>{line}</code>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Dialog open={showCustomInput} onClose={() => setShowCustomInput(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: themeColors.white, backgroundColor: themeColors.inputBgDark }}>
          Custom Input
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: themeColors.inputBgDark }}>
          <TextField
            fullWidth
            label="Array (comma-separated)"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            placeholder="1,2,3,1"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: themeColors.white,
                '& fieldset': {
                  borderColor: themeColors.borderLight,
                },
                '&:hover fieldset': {
                  borderColor: themeColors.primary,
                },
              },
              '& .MuiInputLabel-root': {
                color: themeColors.textSecondary,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeColors.inputBgDark }}>
          <Button onClick={() => setShowCustomInput(false)} sx={{ color: themeColors.textSecondary }}>
            Cancel
          </Button>
          <Button onClick={handleCustomInput} sx={{ color: themeColors.primary }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContainsDuplicateVisualization;
