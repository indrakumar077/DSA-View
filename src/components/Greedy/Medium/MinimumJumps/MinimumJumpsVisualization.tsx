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
  jumps: number;
  currentEnd: number;
  farthest: number;
  variables: Record<string, any>;
  description: string;
  isSolution?: boolean;
  jumpPath?: number[];
}

const MinimumJumpsVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 19;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([2, 3, 1, 1, 4]);
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
    
    if (nums.length <= 1) {
      steps.push({
        line: 1,
        jumps: 0,
        currentEnd: 0,
        farthest: 0,
        variables: {},
        description: 'Array length is 1 or less, no jumps needed',
        isSolution: true,
        jumpPath: [],
      });
      return steps;
    }

    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    const jumpPath: number[] = [0];

    // Initial state
    steps.push({
      line: 1,
      jumps: 0,
      currentEnd: 0,
      farthest: 0,
      variables: { jumps: 0, currentEnd: 0, farthest: 0 },
      description: 'Initialize jumps = 0, currentEnd = 0, farthest = 0',
      jumpPath: [0],
    });

    for (let i = 0; i < nums.length - 1; i++) {
      // Update farthest
      const newFarthest = Math.max(farthest, i + nums[i]);
      
      steps.push({
        line: 2,
        i,
        jumps,
        currentEnd,
        farthest: newFarthest,
        variables: {
          i,
          'nums[i]': nums[i],
          jumps,
          currentEnd,
          farthest: newFarthest,
          'i + nums[i]': i + nums[i],
        },
        description: `At index ${i}, update farthest = max(${farthest}, ${i} + ${nums[i]}) = ${newFarthest}`,
        jumpPath: [...jumpPath],
      });

      farthest = newFarthest;

      // Check if we need to jump
      if (i === currentEnd) {
        jumps++;
        const oldCurrentEnd = currentEnd;
        currentEnd = farthest;
        jumpPath.push(i);

        steps.push({
          line: 3,
          i,
          jumps,
          currentEnd,
          farthest,
          variables: {
            i,
            jumps,
            currentEnd,
            farthest,
            'i === currentEnd': true,
          },
          description: `Reached end of current jump range (index ${i}). Make jump ${jumps}, update currentEnd = ${farthest}`,
          jumpPath: [...jumpPath],
        });

        if (currentEnd >= nums.length - 1) {
          steps.push({
            line: 4,
            i,
            jumps,
            currentEnd,
            farthest,
            variables: {
              jumps,
              currentEnd,
              farthest,
            },
            description: `Reached or exceeded last index. Minimum jumps = ${jumps}`,
            isSolution: true,
            jumpPath: [...jumpPath, nums.length - 1],
          });
          break;
        }
      } else {
        steps.push({
          line: 3,
          i,
          jumps,
          currentEnd,
          farthest,
          variables: {
            i,
            jumps,
            currentEnd,
            farthest,
            'i !== currentEnd': true,
          },
          description: `Index ${i} is within current jump range (0 to ${currentEnd}), no jump needed yet`,
          jumpPath: [...jumpPath],
        });
      }
    }

    // Final solution if not already set
    if (!steps[steps.length - 1].isSolution) {
      steps.push({
        line: 5,
        jumps,
        currentEnd,
        farthest,
        variables: { jumps, currentEnd, farthest },
        description: `Final result: Minimum jumps = ${jumps}`,
        isSolution: true,
        jumpPath: [...jumpPath, nums.length - 1],
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
        .filter((n) => !isNaN(n) && n >= 0);
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

  // Dynamic function to get line number for a logical step
  const getLineNumberForStep = (code: string, stepLine: number, lang: string): number => {
    const lines = code.split('\n');
    
    // Step 1: Initialize
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/jumps\s*=\s*0/.test(line) || /currentEnd\s*=\s*0/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 2: Update farthest
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/farthest\s*=\s*max\(/.test(line) || /farthest\s*=\s*Math\.max\(/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 3: Check if jump needed
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/if\s+i\s*==\s*currentEnd/.test(line) || /if\s*\(i\s*==\s*currentEnd\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 4: Break condition
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/if\s+currentEnd\s*>=\s*len\(nums\)/.test(line) || /if\s*\(currentEnd\s*>=\s*nums\.length/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 5: Return
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^return\s+jumps/.test(line)) {
          return i + 1;
        }
      }
    }
    
    return -1;
  };

  // Get code from questions.ts
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
            Minimum number of jumps
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
              {/* Success Message */}
              {currentStepData.isSolution && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3, 
                    alignItems: 'center',
                    width: '100%',
                    p: 3,
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
                    🎉 Minimum Jumps: {currentStepData.jumps}
                  </Box>
                </Box>
              )}

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
                {/* Array Display */}
                <Box sx={{ width: '100%', maxWidth: '800px' }}>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: themeColors.textSecondary,
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    Array Visualization
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {nums.map((num, idx) => {
                      const isCurrent = currentStepData.i === idx;
                      const isInJumpRange = idx <= currentStepData.currentEnd;
                      const isReachable = idx <= currentStepData.farthest;
                      const isInPath = currentStepData.jumpPath?.includes(idx);
                      const isLast = idx === nums.length - 1;

                      return (
                        <Box
                          key={idx}
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: isInPath
                                ? themeColors.primary
                                : isCurrent
                                ? '#f59e0b'
                                : isInJumpRange
                                ? '#3b82f6'
                                : isReachable
                                ? '#6366f1'
                                : themeColors.inputBgDark,
                              border: `2px solid ${
                                isCurrent
                                  ? '#f59e0b'
                                  : isInPath
                                  ? themeColors.primary
                                  : themeColors.borderLight
                              }`,
                              borderRadius: 2,
                              color: themeColors.white,
                              fontWeight: 700,
                              fontSize: '1rem',
                              transition: 'all 0.3s ease',
                              boxShadow: isCurrent
                                ? '0 0 20px rgba(245, 158, 11, 0.5)'
                                : isInPath
                                ? `0 0 20px ${themeColors.primary}80`
                                : 'none',
                            }}
                          >
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                              {num}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.625rem',
                                color: themeColors.textSecondary,
                                mt: -0.5,
                              }}
                            >
                              [{idx}]
                            </Typography>
                          </Box>
                          {isCurrent && (
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: '#f59e0b',
                                fontWeight: 600,
                              }}
                            >
                              Current
                            </Typography>
                          )}
                          {isInPath && !isCurrent && (
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: themeColors.primary,
                                fontWeight: 600,
                              }}
                            >
                              Jump {currentStepData.jumpPath?.indexOf(idx)! + 1}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Variables Display */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: themeColors.inputBgDark,
                    borderRadius: 2,
                    p: 3,
                    border: `1px solid ${themeColors.borderLight}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: themeColors.white,
                      mb: 2,
                    }}
                  >
                    Variables
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: themeColors.textSecondary }}>jumps:</Typography>
                      <Typography sx={{ color: themeColors.primary, fontWeight: 600 }}>
                        {currentStepData.jumps}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: themeColors.textSecondary }}>currentEnd:</Typography>
                      <Typography sx={{ color: '#3b82f6', fontWeight: 600 }}>
                        {currentStepData.currentEnd}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: themeColors.textSecondary }}>farthest:</Typography>
                      <Typography sx={{ color: '#6366f1', fontWeight: 600 }}>
                        {currentStepData.farthest}
                      </Typography>
                    </Box>
                    {currentStepData.i !== undefined && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ color: themeColors.textSecondary }}>i:</Typography>
                        <Typography sx={{ color: '#f59e0b', fontWeight: 600 }}>
                          {currentStepData.i}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Description */}
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: themeColors.inputBgDark,
                    borderRadius: 2,
                    p: 3,
                    border: `1px solid ${themeColors.borderLight}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {currentStepData.description}
                  </Typography>
                </Box>

                {/* Step Counter */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: themeColors.textSecondary,
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography>
                    Step {currentStep + 1} of {steps.length}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            /* Explanation View */
            <Box sx={{ p: 4 }}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {question.explanation.steps.map((step, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 2,
                          backgroundColor: themeColors.inputBgDark,
                          borderRadius: 2,
                          border: `1px solid ${themeColors.borderLight}`,
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
                        <Typography sx={{ color: themeColors.textSecondary, lineHeight: 1.6 }}>
                          {step}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ mt: 4, display: 'flex', gap: 4 }}>
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
                          fontSize: '1rem',
                          color: themeColors.primary,
                          fontWeight: 600,
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
                          fontSize: '1rem',
                          color: themeColors.primary,
                          fontWeight: 600,
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
                  backgroundColor: themeColors.borderLight,
                  color: themeColors.white,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  minWidth: 120,
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
              component="pre"
              sx={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: themeColors.white,
              }}
            >
              {codeLines.map((line, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor:
                      highlightedLine === idx + 1
                        ? `${themeColors.primary}33`
                        : 'transparent',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    borderLeft:
                      highlightedLine === idx + 1
                        ? `3px solid ${themeColors.primary}`
                        : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: highlightedLine === idx + 1 ? themeColors.primary : themeColors.white,
                      fontWeight: highlightedLine === idx + 1 ? 600 : 400,
                      fontFamily: 'monospace',
                    }}
                  >
                    {line || ' '}
                  </Typography>
                </Box>
              ))}
            </Box>
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
        <DialogTitle sx={{ color: themeColors.white }}>Custom Input</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Array (comma-separated)"
            type="text"
            fullWidth
            variant="outlined"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            placeholder="2,3,1,1,4"
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
            onClick={() => {
              setShowCustomInput(false);
              setCustomNums('');
            }}
            sx={{ color: themeColors.textSecondary }}
          >
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

export default MinimumJumpsVisualization;

