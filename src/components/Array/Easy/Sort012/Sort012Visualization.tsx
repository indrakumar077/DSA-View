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
  low?: number;
  mid?: number;
  high?: number;
  variables: Record<string, any>;
  array: number[];
  description: string;
  isComplete?: boolean;
}

const Sort012Visualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 12;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([2, 0, 2, 1, 1, 0]);
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
    const arr = [...nums];
    let low = 0;
    let mid = 0;
    let high = arr.length - 1;

    // Validate array contains only 0s, 1s, and 2s
    const valid = arr.every(n => n === 0 || n === 1 || n === 2);
    if (!valid) {
      steps.push({
        line: 0,
        variables: {},
        array: [...arr],
        description: 'Invalid input: Array must contain only 0s, 1s, and 2s',
        isComplete: true,
      });
      return steps;
    }

    steps.push({
      line: 1,
      low,
      mid,
      high,
      variables: { low, mid, high },
      array: [...arr],
      description: `Initialize pointers: low = ${low}, mid = ${mid}, high = ${high}`,
    });

    while (mid <= high) {
      steps.push({
        line: 2,
        low,
        mid,
        high,
        variables: { low, mid, high, 'nums[mid]': arr[mid] },
        array: [...arr],
        description: `Check nums[${mid}] = ${arr[mid]}`,
      });

      if (arr[mid] === 0) {
        // Swap with low
        steps.push({
          line: 3,
          low,
          mid,
          high,
          variables: { low, mid, high, 'nums[mid]': arr[mid], 'nums[low]': arr[low] },
          array: [...arr],
          description: `nums[${mid}] = 0. Swap with nums[${low}]`,
        });

        const temp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = temp;

        steps.push({
          line: 4,
          low,
          mid,
          high,
          variables: { low, mid, high },
          array: [...arr],
          description: `Swapped. Increment low and mid: low = ${low + 1}, mid = ${mid + 1}`,
        });

        low++;
        mid++;
      } else if (arr[mid] === 1) {
        steps.push({
          line: 5,
          low,
          mid,
          high,
          variables: { low, mid, high, 'nums[mid]': arr[mid] },
          array: [...arr],
          description: `nums[${mid}] = 1. Leave in place. Increment mid: mid = ${mid + 1}`,
        });
        mid++;
      } else {
        // arr[mid] === 2, swap with high
        steps.push({
          line: 6,
          low,
          mid,
          high,
          variables: { low, mid, high, 'nums[mid]': arr[mid], 'nums[high]': arr[high] },
          array: [...arr],
          description: `nums[${mid}] = 2. Swap with nums[${high}]`,
        });

        const temp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = temp;

        steps.push({
          line: 7,
          low,
          mid,
          high,
          variables: { low, mid, high },
          array: [...arr],
          description: `Swapped. Decrement high: high = ${high - 1}`,
        });

        high--;
      }
    }

    steps.push({
      line: 8,
      variables: {},
      array: [...arr],
      description: 'Sorting complete! Array is now sorted: all 0s, then 1s, then 2s.',
      isComplete: true,
    });

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
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / speed) as unknown as number;

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
    setIsPlaying(false);
  }, [steps.length]);

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
        .filter((n) => !isNaN(n) && (n === 0 || n === 1 || n === 2));
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

  const getLineNumberForStep = (code: string, stepLine: number, lang: string): number => {
    const lines = code.split('\n');
    
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === 'Python' && /low\s*=\s*0/.test(line) && /mid\s*=\s*0/.test(line)) {
          return i + 1;
        }
        if ((lang === 'Java' || lang === 'C++') && /int\s+low\s*=\s*0/.test(line)) {
          return i + 1;
        }
        if (lang === 'JavaScript' && /let\s+low\s*=\s*0/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/while\s*\(mid\s*<=\s*high\)/.test(line) || /while\s+mid\s*<=\s*high/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 3 || stepLine === 6) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/if\s*\(nums\[mid\]\s*==\s*0\)/.test(line) || /if\s+nums\[mid\]\s*==\s*0/.test(line)) {
          if (stepLine === 3) return i + 1;
        }
        if (/if\s*\(nums\[mid\]\s*==\s*2\)/.test(line) || /else/.test(line)) {
          if (stepLine === 6) return i + 1;
        }
      }
    }
    
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/low\+\+|low\s*\+\s*=\s*1/.test(line) && /mid\+\+|mid\s*\+\s*=\s*1/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/elif\s*\(nums\[mid\]\s*==\s*1\)/.test(line) || /else\s+if\s*\(nums\[mid\]\s*==\s*1\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 7) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/high--|high\s*-\s*=\s*1/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 8) {
      return lines.length;
    }
    
    return -1;
  };

  const codeLines = useMemo(() => {
    if (!question?.codes) return [];
    const code = question.codes[language as keyof typeof question.codes] || question.codes.Python;
    return code.split('\n');
  }, [question?.codes, language]);

  const getHighlightedLine = (stepLine: number, lang: string): number => {
    if (!question?.codes) return -1;
    const code = question.codes[lang as keyof typeof question.codes] || question.codes.Python;
    return getLineNumberForStep(code, stepLine, lang);
  };

  const highlightedLine = getHighlightedLine(currentStepData.line, language);

  const currentArray = currentStepData.array || nums;

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
            Sort an array of 0s, 1s and 2s
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 4,
                  p: 4,
                  minHeight: '50vh',
                }}
              >
                {currentStepData.isComplete && (
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
                        fontSize: '1.125rem',
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
                      ✅ Array Sorted Successfully!
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
                          O(1)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box sx={{ textAlign: 'center' }}>
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
                    {currentArray.map((num, idx) => {
                      const isLow = currentStepData.low === idx;
                      const isMid = currentStepData.mid === idx;
                      const isHigh = currentStepData.high === idx;
                      const isSwapping = (currentStepData.line === 3 || currentStepData.line === 6) && (isLow || isMid || isHigh);
                      
                      const getColor = (val: number) => {
                        if (val === 0) return '#ef4444';
                        if (val === 1) return '#f59e0b';
                        return '#3b82f6';
                      };

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
                              width: 56,
                              height: 56,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1.5,
                              border: isSwapping
                                ? '3px solid #10b981'
                                : isLow || isMid || isHigh
                                ? `2px solid ${themeColors.primary}`
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isSwapping
                                ? '#10b98133'
                                : isLow || isMid || isHigh
                                ? `${themeColors.primary}1a`
                                : 'transparent',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: getColor(num),
                              }}
                            >
                              {num}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              color: themeColors.textSecondary,
                              mt: 0.5,
                              fontFamily: 'monospace',
                            }}
                          >
                            [{idx}]
                          </Typography>
                          {(isLow || isMid || isHigh) && (
                            <Typography
                              sx={{
                                fontSize: '0.625rem',
                                color: themeColors.primary,
                                mt: 0.25,
                                fontWeight: 600,
                              }}
                            >
                              {isLow ? 'low' : isMid ? 'mid' : 'high'}
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
                    backgroundColor: currentStepData.isComplete
                      ? '#10b98133'
                      : themeColors.backgroundDark,
                    borderLeft: currentStepData.isComplete
                      ? '3px solid #10b981'
                      : `3px solid ${themeColors.primary}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: currentStepData.isComplete ? '#10b981' : themeColors.white,
                      fontWeight: currentStepData.isComplete ? 700 : 500,
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
            </>
          ) : (
            <Box
              sx={{
                p: 4,
                overflow: 'auto',
                height: '100%',
              }}
            >
              {question && (
                <>
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 2,
                    }}
                  >
                    {question.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: themeColors.textSecondary,
                      mb: 3,
                      whiteSpace: 'pre-line',
                      lineHeight: 1.8,
                    }}
                  >
                    {question.description}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 2,
                    }}
                  >
                    Approach
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: themeColors.textSecondary,
                      mb: 3,
                      lineHeight: 1.8,
                    }}
                  >
                    {question.explanation.approach}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 2,
                    }}
                  >
                    Steps
                  </Typography>
                  <Box component="ol" sx={{ pl: 3, mb: 3 }}>
                    {question.explanation.steps.map((step, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        sx={{
                          fontSize: '1rem',
                          color: themeColors.textSecondary,
                          mb: 1.5,
                          lineHeight: 1.8,
                        }}
                      >
                        {step}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                          mb: 0.5,
                        }}
                      >
                        Time Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: themeColors.primary,
                          fontFamily: 'monospace',
                        }}
                      >
                        {question.explanation.timeComplexity}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                          mb: 0.5,
                        }}
                      >
                        Space Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.125rem',
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
                px: 2,
              }}
            >
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
                        backgroundColor: isHighlighted
                          ? `${themeColors.primary}33`
                          : 'transparent',
                        borderLeft: isHighlighted
                          ? `2px solid ${themeColors.primary}`
                          : 'none',
                        pl: isHighlighted ? 1 : 0,
                        py: 0.25,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          textAlign: 'right',
                          pr: 2,
                          color: themeColors.textSecondary,
                          flexShrink: 0,
                          fontSize: '0.75rem',
                        }}
                      >
                        {lineNum}
                      </Box>
                      <Box
                        component="pre"
                        sx={{
                          margin: 0,
                          color: themeColors.white,
                          whiteSpace: 'pre',
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
        ) : null}
      </Box>

      <Dialog
        open={showCustomInput}
        onClose={() => setShowCustomInput(false)}
        PaperProps={{
          sx: {
            backgroundColor: themeColors.inputBgDark,
            color: themeColors.white,
          },
        }}
      >
        <DialogTitle>Test with Custom Input</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Array (comma-separated, only 0s, 1s, and 2s)"
            fullWidth
            variant="outlined"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            placeholder="2,0,2,1,1,0"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                color: themeColors.white,
                '& fieldset': {
                  borderColor: themeColors.borderLight,
                },
                '&:hover fieldset': {
                  borderColor: themeColors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: themeColors.primary,
                },
              },
              '& .MuiInputLabel-root': {
                color: themeColors.textSecondary,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowCustomInput(false);
              setCustomNums('');
            }}
            sx={{ color: themeColors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCustomInput}
            sx={{
              color: themeColors.primary,
              '&:hover': {
                backgroundColor: `${themeColors.primary}1a`,
              },
            }}
          >
            Run
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sort012Visualization;

