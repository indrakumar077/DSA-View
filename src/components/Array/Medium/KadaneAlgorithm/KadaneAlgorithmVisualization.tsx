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
  currentSum: number;
  maxSum: number;
  variables: Record<string, any>;
  description: string;
  isSolution?: boolean;
  subarrayStart?: number;
  subarrayEnd?: number;
}

const KadaneAlgorithmVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 16;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Generate animation steps
  const generateSteps = (nums: number[]): Step[] => {
    const steps: Step[] = [];
    let currentSum = nums[0];
    let maxSum = nums[0];
    let subarrayStart = 0;
    let subarrayEnd = 0;
    let tempStart = 0;

    // Initial state
    steps.push({
      line: 1,
      i: 0,
      currentSum: nums[0],
      maxSum: nums[0],
      variables: { currentSum: nums[0], maxSum: nums[0] },
      description: `Initialize maxSum = ${nums[0]} and currentSum = ${nums[0]}`,
      subarrayStart: 0,
      subarrayEnd: 0,
    });

    for (let i = 1; i < nums.length; i++) {
      // Check current element
      steps.push({
        line: 2,
        i,
        currentSum,
        maxSum,
        variables: { i, 'nums[i]': nums[i], currentSum, maxSum },
        description: `Processing element at index ${i}: ${nums[i]}`,
        subarrayStart: tempStart,
        subarrayEnd: i - 1,
      });

      // Decide: extend subarray or start new
      const newSum = currentSum + nums[i];
      const shouldStartNew = nums[i] > newSum;

      steps.push({
        line: 3,
        i,
        currentSum,
        maxSum,
        variables: {
          i,
          'nums[i]': nums[i],
          currentSum,
          maxSum,
          'currentSum + nums[i]': newSum,
        },
        description: `Compare: nums[${i}] = ${nums[i]} vs currentSum + nums[${i}] = ${newSum}`,
        subarrayStart: tempStart,
        subarrayEnd: i - 1,
      });

      // Update currentSum
      if (shouldStartNew) {
        currentSum = nums[i];
        tempStart = i;
        steps.push({
          line: 3,
          i,
          currentSum,
          maxSum,
          variables: {
            i,
            'nums[i]': nums[i],
            currentSum,
            maxSum,
          },
          description: `Start new subarray from index ${i} (${nums[i]} > ${newSum})`,
          subarrayStart: i,
          subarrayEnd: i,
        });
      } else {
        currentSum = newSum;
        steps.push({
          line: 3,
          i,
          currentSum,
          maxSum,
          variables: {
            i,
            'nums[i]': nums[i],
            currentSum,
            maxSum,
          },
          description: `Extend subarray (${newSum} >= ${nums[i]})`,
          subarrayStart: tempStart,
          subarrayEnd: i,
        });
      }

      // Update maxSum
      if (currentSum > maxSum) {
        maxSum = currentSum;
        subarrayStart = tempStart;
        subarrayEnd = i;
        steps.push({
          line: 4,
          i,
          currentSum,
          maxSum,
          variables: {
            i,
            currentSum,
            maxSum,
          },
          description: `Update maxSum = ${maxSum} (new maximum found)`,
          subarrayStart,
          subarrayEnd,
        });
      } else {
        steps.push({
          line: 4,
          i,
          currentSum,
          maxSum,
          variables: {
            i,
            currentSum,
            maxSum,
          },
          description: `Keep maxSum = ${maxSum} (currentSum ${currentSum} <= maxSum)`,
          subarrayStart: tempStart,
          subarrayEnd: i,
        });
      }
    }

    // Final solution
    steps.push({
      line: 5,
      i: nums.length - 1,
      currentSum,
      maxSum,
      variables: { maxSum },
      description: `Final result: Maximum sum = ${maxSum}`,
      isSolution: true,
      subarrayStart,
      subarrayEnd,
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

  // Register controls with context
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

  // Dynamic function to get line number for a logical step by parsing code patterns
  const getLineNumberForStep = (code: string, stepLine: number, lang: string): number => {
    const lines = code.split('\n');
    
    // Step 1: Initialize
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/maxSum\s*=\s*nums\[0\]/.test(line) || /maxSum\s*=\s*nums\.get\(0\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 2: For loop
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^for\s+.*in\s+range\(1/.test(line) || /^for\s*\(int\s+i\s*=\s*1/.test(line) || /^for\s*\(let\s+i\s*=\s*1/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 3: Update currentSum
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/currentSum\s*=\s*max\(/.test(line) || /currentSum\s*=\s*Math\.max\(/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 4: Update maxSum
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/maxSum\s*=\s*max\(/.test(line) || /maxSum\s*=\s*Math\.max\(/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 5: Return
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^return\s+maxSum/.test(line)) {
          return i + 1;
        }
      }
    }
    
    return -1;
  };

  // Get code from questions.ts - memoized to avoid recalculation
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

  // Safety check
  if (!steps || steps.length === 0) {
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
        <div>
          <h1>Loading visualization...</h1>
          <p>Steps: {steps?.length || 0}</p>
        </div>
      </Box>
    );
  }

  if (!currentStepData) {
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
        <h1>Error: No step data available</h1>
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

      {/* Toolbar */}
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
            Kadane's Algorithm
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

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Side - Visualization or Explanation */}
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {activeTab === 0 ? (
            /* Visualization View */
            <>
          {/* Array Visualization */}
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
            {/* Success Message */}
            {currentStepData.isSolution && (
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
                  🎉 Maximum Sum: {currentStepData.maxSum}
                </Box>
                {/* Complexity Info */}
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

            {/* Array */}
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
                {nums.map((num, idx) => {
                  const isInSubarray = currentStepData.subarrayStart !== undefined && 
                                       currentStepData.subarrayEnd !== undefined &&
                                       idx >= currentStepData.subarrayStart && 
                                       idx <= currentStepData.subarrayEnd;
                  const isCurrent = currentStepData.i === idx;
                  
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
                          border:
                            currentStepData.isSolution && isInSubarray
                              ? '3px solid #10b981'
                              : isInSubarray
                              ? `2px solid ${themeColors.primary}`
                              : isCurrent
                              ? `2px solid ${themeColors.primary}`
                              : `1px solid ${themeColors.borderLight}`,
                          backgroundColor:
                            currentStepData.isSolution && isInSubarray
                              ? '#10b98133'
                              : isInSubarray
                              ? `${themeColors.primary}1a`
                              : isCurrent
                              ? `${themeColors.primary}1a`
                              : 'transparent',
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
                            color: currentStepData.isSolution ? '#10b981' : themeColors.primary,
                          }}
                        >
                          i
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
              {currentStepData.subarrayStart !== undefined && currentStepData.subarrayEnd !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.textSecondary,
                      mb: 1,
                    }}
                  >
                    Current Subarray: [{nums.slice(currentStepData.subarrayStart, currentStepData.subarrayEnd + 1).join(', ')}]
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.primary,
                      fontWeight: 600,
                    }}
                  >
                    Sum: {nums.slice(currentStepData.subarrayStart, currentStepData.subarrayEnd + 1).reduce((a, b) => a + b, 0)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Data Structures */}
          <Box
            sx={{
              flexShrink: 0,
              borderTop: `1px solid ${themeColors.borderLight}`,
              backgroundColor: themeColors.inputBgDark,
              p: 2,
            }}
          >
            {/* Current Step Description */}
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: currentStepData.isSolution 
                  ? '#10b98133' 
                  : themeColors.backgroundDark,
                borderLeft: currentStepData.isSolution 
                  ? '3px solid #10b981' 
                  : `3px solid ${themeColors.primary}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: currentStepData.isSolution ? '#10b981' : themeColors.white,
                  fontWeight: currentStepData.isSolution ? 700 : 500,
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
            /* Explanation View */
            <Box sx={{ p: 4, overflow: 'auto' }}>
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
                      lineHeight: 1.8,
                      mb: 4,
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
                  <Box sx={{ mb: 4 }}>
                    {question.explanation.steps.map((step, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          mb: 2,
                          p: 2,
                          backgroundColor: themeColors.inputBgDark,
                          borderRadius: 1,
                          borderLeft: `3px solid ${themeColors.primary}`,
                        }}
                      >
                        <Typography
                          sx={{
                            color: themeColors.primary,
                            fontWeight: 700,
                            minWidth: 24,
                          }}
                        >
                          {idx + 1}.
                        </Typography>
                        <Typography
                          sx={{
                            color: themeColors.white,
                            lineHeight: 1.6,
                          }}
                        >
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 4,
                      mt: 4,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: themeColors.textSecondary,
                          mb: 1,
                        }}
                      >
                        Time Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
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
                          mb: 1,
                        }}
                      >
                        Space Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '1.25rem',
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

        {/* Right Side - Code */}
        <Box
          sx={{
            width: '50%',
            borderLeft: `1px solid ${themeColors.borderLight}`,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: themeColors.inputBgDark,
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
            <Typography
              sx={{
                fontSize: '0.875rem',
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
                  backgroundColor: themeColors.backgroundDark,
                  color: themeColors.white,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  minWidth: 120,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: `1px solid ${themeColors.borderLight}`,
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
            <Paper
              sx={{
                backgroundColor: themeColors.backgroundDark,
                p: 2,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.8,
              }}
            >
              {codeLines.map((line, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    backgroundColor:
                      highlightedLine === idx + 1
                        ? `${themeColors.primary}33`
                        : 'transparent',
                    px: 1,
                    py: 0.5,
                    borderRadius: 0.5,
                    borderLeft:
                      highlightedLine === idx + 1
                        ? `3px solid ${themeColors.primary}`
                        : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography
                    sx={{
                      color: themeColors.textSecondary,
                      minWidth: 40,
                      textAlign: 'right',
                      mr: 2,
                      fontSize: '0.75rem',
                    }}
                  >
                    {idx + 1}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        highlightedLine === idx + 1
                          ? themeColors.white
                          : themeColors.textSecondary,
                      fontWeight: highlightedLine === idx + 1 ? 600 : 400,
                      whiteSpace: 'pre',
                      flex: 1,
                    }}
                  >
                    {line || ' '}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Custom Input Dialog */}
      <Dialog
        open={showCustomInput}
        onClose={() => setShowCustomInput(false)}
        PaperProps={{
          sx: {
            backgroundColor: themeColors.inputBgDark,
            color: themeColors.white,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>Test with Custom Input</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Array (comma-separated)"
            fullWidth
            variant="outlined"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            placeholder="e.g., -2, 1, -3, 4, -1, 2, 1, -5, 4"
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
            onClick={() => setShowCustomInput(false)}
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
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KadaneAlgorithmVisualization;

