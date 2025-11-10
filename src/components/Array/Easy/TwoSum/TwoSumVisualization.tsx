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
  j?: number;
  complement?: number;
  variables: Record<string, any>;
  hashMap: Record<number, number>;
  description: string;
  isSolution?: boolean;
  result?: number[];
}

const TwoSumVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 1;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [customTarget, setCustomTarget] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Generate animation steps
  const generateSteps = (nums: number[], target: number): Step[] => {
    const steps: Step[] = [];
    const map: Record<number, number> = {};

    // Initial state
    steps.push({
      line: 1,
      variables: {},
      hashMap: {},
      description: 'Initialize empty hash map',
    });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];

      // Current iteration
      steps.push({
        line: 2,
        i,
        variables: { i, 'nums[i]': nums[i] },
        hashMap: { ...map },
        description: `Check element at index ${i}: ${nums[i]}`,
      });

      // Calculate complement
      steps.push({
        line: 3,
        i,
        complement,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Calculate complement: ${target} - ${nums[i]} = ${complement}`,
      });

      // Check if complement exists
      if (map[complement] !== undefined) {
        steps.push({
          line: 4,
          i,
          j: map[complement],
          variables: { i, 'nums[i]': nums[i], complement },
          hashMap: { ...map },
          description: `Found! nums[${map[complement]}] + nums[${i}] = ${target}`,
          isSolution: true,
          result: [map[complement], i],
        });
        break;
      }

      // Add to map
      steps.push({
        line: 5,
        i,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Add ${nums[i]} to map with index ${i}`,
      });

      map[nums[i]] = i;

      // Updated map state
      steps.push({
        line: 5,
        i,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Map updated: {${Object.entries(map)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}}`,
      });
    }

    return steps;
  };

  const [steps, setSteps] = useState<Step[]>(() => generateSteps(nums, target));

  useEffect(() => {
    setSteps(generateSteps(nums, target));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums, target]);

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
      const targetNum = parseInt(customTarget);
      if (numArray.length >= 2 && !isNaN(targetNum)) {
        setNums(numArray);
        setTarget(targetNum);
        setShowCustomInput(false);
        setCustomNums('');
        setCustomTarget('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  // Dynamic function to get line number for a logical step by parsing code patterns
  const getLineNumberForStep = (code: string, stepLine: number, lang: string): number => {
    const lines = code.split('\n');
    
    // Step 1: Initialize map
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: numMap = {} or map = {} (dictionary initialization)
        if (lang === 'Python' && /^\w+\s*=\s*\{\}\s*$/.test(line)) {
          return i + 1;
        }
        // Java: Map<...> ... = new HashMap<>()
        if (lang === 'Java' && /Map<.*>.*=.*new HashMap/.test(line)) {
          return i + 1;
        }
        // C++: unordered_map<...> (with or without initialization)
        if (lang === 'C++' && /unordered_map<.*>/.test(line)) {
          return i + 1;
        }
        // JavaScript: const ... = new Map()
        if (lang === 'JavaScript' && /const\s+\w+\s*=\s*new Map\(\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 2: For loop
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: for i in range(...)
        if (lang === 'Python' && /^for\s+\w+\s+in\s+range/.test(line)) {
          return i + 1;
        }
        // Java/C++: for (int i = ...
        if ((lang === 'Java' || lang === 'C++') && /^for\s*\(int\s+i\s*=/.test(line)) {
          return i + 1;
        }
        // JavaScript: for (let i = ...
        if (lang === 'JavaScript' && /^for\s*\(let\s+i\s*=/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 3: Calculate complement
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/complement\s*=\s*target\s*-\s*nums\[i\]/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 4: Check if complement exists
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: if complement in numMap
        if (lang === 'Python' && /^if\s+complement\s+in\s+\w+/.test(line)) {
          return i + 1;
        }
        // Java: if (numMap.containsKey(complement))
        if (lang === 'Java' && /if\s*\(.*\.containsKey\(complement\)/.test(line)) {
          return i + 1;
        }
        // C++: if (numMap.find(complement) != numMap.end())
        if (lang === 'C++' && /if\s*\(.*\.find\(complement\)/.test(line)) {
          return i + 1;
        }
        // JavaScript: if (numMap.has(complement))
        if (lang === 'JavaScript' && /if\s*\(.*\.has\(complement\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 5: Add to map
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: numMap[nums[i]] = i or map[nums[i]] = i
        if (lang === 'Python' && /\w+\[nums\[i\]\]\s*=\s*i\s*$/.test(line)) {
          return i + 1;
        }
        // Java: numMap.put(nums[i], i) or map.put(nums[i], i)
        if (lang === 'Java' && /\w+\.put\(nums\[i\],\s*i\)/.test(line)) {
          return i + 1;
        }
        // C++: numMap[nums[i]] = i or map[nums[i]] = i
        if (lang === 'C++' && /\w+\[nums\[i\]\]\s*=\s*i\s*;?\s*$/.test(line)) {
          return i + 1;
        }
        // JavaScript: numMap.set(nums[i], i) or map.set(nums[i], i)
        if (lang === 'JavaScript' && /\w+\.set\(nums\[i\],\s*i\)/.test(line)) {
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
            2 Sum
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
                  🎉 Solution Found! Indices: [{currentStepData.result?.join(', ')}]
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
                      O(n)
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
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {nums.map((num, idx) => (
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
                          currentStepData.isSolution && (currentStepData.i === idx || currentStepData.j === idx)
                            ? '3px solid #10b981'
                            : currentStepData.i === idx || currentStepData.j === idx
                            ? `2px solid ${themeColors.primary}`
                            : `1px solid ${themeColors.borderLight}`,
                        backgroundColor:
                          currentStepData.isSolution && (currentStepData.i === idx || currentStepData.j === idx)
                            ? '#10b98133'
                            : currentStepData.i === idx || currentStepData.j === idx
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
                    {currentStepData.i === idx && (
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
                    {currentStepData.j === idx && (
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: currentStepData.isSolution ? '#10b981' : themeColors.primary,
                        }}
                      >
                        j
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Target */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: themeColors.textSecondary,
                }}
              >
                Target ={' '}
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
                  {target}
                </Box>
              </Typography>
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
              Data Structures
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Variables */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.textSecondary,
                    mb: 1,
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

              {/* Hash Map */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: themeColors.textSecondary,
                    mb: 1,
                  }}
                >
                  Hash Map
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
                  <Typography sx={{ color: themeColors.white }}>
                    {Object.keys(currentStepData.hashMap).length > 0
                      ? `{${Object.entries(currentStepData.hashMap)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}}`
                      : '{}'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
            </>
          ) : (
            /* Explanation View */
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 4,
              }}
            >
              {question?.explanation ? (
                <>
                  {/* Approach */}
                  <Box sx={{ mb: 4 }}>
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
                    <Paper
                      sx={{
                        backgroundColor: themeColors.inputBgDark,
                        p: 3,
                        borderLeft: `4px solid ${themeColors.primary}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          color: themeColors.textSecondary,
                          lineHeight: 1.8,
                        }}
                      >
                        {question.explanation.approach}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Step-by-Step Solution */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: themeColors.white,
                        mb: 2,
                      }}
                    >
                      Step-by-Step Solution
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {question.explanation.steps.map((step, index) => (
                        <Paper
                          key={index}
                          sx={{
                            backgroundColor: themeColors.inputBgDark,
                            p: 2.5,
                            borderLeft: `4px solid ${themeColors.primary}`,
                            display: 'flex',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: themeColors.primary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: themeColors.textPrimary,
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '0.9375rem',
                              color: themeColors.textSecondary,
                              lineHeight: 1.7,
                              flex: 1,
                            }}
                          >
                            {step}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>

                  {/* Complexity Analysis */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: themeColors.white,
                        mb: 2,
                      }}
                    >
                      Complexity Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Paper
                        sx={{
                          flex: 1,
                          backgroundColor: themeColors.inputBgDark,
                          p: 3,
                          borderLeft: `4px solid ${themeColors.primary}`,
                        }}
                      >
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
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: themeColors.primary,
                            fontFamily: 'monospace',
                          }}
                        >
                          {question.explanation.timeComplexity}
                        </Typography>
                      </Paper>
                      <Paper
                        sx={{
                          flex: 1,
                          backgroundColor: themeColors.inputBgDark,
                          p: 3,
                          borderLeft: `4px solid ${themeColors.primary}`,
                        }}
                      >
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
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: themeColors.primary,
                            fontFamily: 'monospace',
                          }}
                        >
                          {question.explanation.spaceComplexity}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: themeColors.textSecondary,
                    }}
                  >
                    Explanation not available for this problem.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Right Side - Code */}
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
          {/* Code Header */}
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

          {/* Code Display */}
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
        ) : (
          /* Code view for Explanation tab */
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${themeColors.borderLight}`,
              overflow: 'hidden',
            }}
          >
            {/* Code Header */}
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

            {/* Code Display */}
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
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        py: 0.25,
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
        )}
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
            label="Array (comma-separated)"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="2, 7, 11, 15"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: themeColors.white,
                '& fieldset': {
                  borderColor: themeColors.borderLight,
                },
              },
              '& label': {
                color: themeColors.textSecondary,
              },
            }}
          />
          <TextField
            label="Target"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="9"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: themeColors.white,
                '& fieldset': {
                  borderColor: themeColors.borderLight,
                },
              },
              '& label': {
                color: themeColors.textSecondary,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowCustomInput(false)}
            sx={{ color: themeColors.white }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCustomInput}
            variant="contained"
            sx={{
              backgroundColor: themeColors.primary,
              color: themeColors.textPrimary,
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TwoSumVisualization;

