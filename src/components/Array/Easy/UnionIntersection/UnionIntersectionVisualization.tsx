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
  arr1: number[];
  arr2: number[];
  union: number[];
  intersection: number[];
  variables: Record<string, any>;
  description: string;
  isComplete?: boolean;
  mode?: 'union' | 'intersection';
}

const UnionIntersectionVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 14;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [arr1, setArr1] = useState([1, 3, 4, 5, 7]);
  const [arr2, setArr2] = useState([2, 3, 5, 6]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customArr1, setCustomArr1] = useState('');
  const [customArr2, setCustomArr2] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Generate steps for Union
  const generateUnionSteps = (arr1: number[], arr2: number[]): Step[] => {
    const steps: Step[] = [];
    const union: number[] = [];
    let i = 0;
    let j = 0;

    steps.push({
      line: 1,
      i: 0,
      j: 0,
      arr1: [...arr1],
      arr2: [...arr2],
      union: [],
      intersection: [],
      variables: { i: 0, j: 0 },
      description: 'Initialize pointers i = 0, j = 0 for both arrays',
      mode: 'union',
    });

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] < arr2[j]) {
        if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
          union.push(arr1[i]);
          steps.push({
            line: 2,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = ${arr1[i]} < arr2[${j}] = ${arr2[j]}. Add ${arr1[i]} to union`,
            mode: 'union',
          });
        } else {
          steps.push({
            line: 2,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = ${arr1[i]} is duplicate, skip`,
            mode: 'union',
          });
        }
        i++;
      } else if (arr2[j] < arr1[i]) {
        if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
          union.push(arr2[j]);
          steps.push({
            line: 3,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr2[${j}] = ${arr2[j]} < arr1[${i}] = ${arr1[i]}. Add ${arr2[j]} to union`,
            mode: 'union',
          });
        } else {
          steps.push({
            line: 3,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr2[${j}] = ${arr2[j]} is duplicate, skip`,
            mode: 'union',
          });
        }
        j++;
      } else {
        // Equal elements
        if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
          union.push(arr1[i]);
          steps.push({
            line: 4,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = arr2[${j}] = ${arr1[i]}. Add ${arr1[i]} to union (once)`,
            mode: 'union',
          });
        } else {
          steps.push({
            line: 4,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [...union],
            intersection: [],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = arr2[${j}] = ${arr1[i]} is duplicate, skip`,
            mode: 'union',
          });
        }
        i++;
        j++;
      }
    }

    // Add remaining elements from arr1
    while (i < arr1.length) {
      if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
        union.push(arr1[i]);
        steps.push({
          line: 5,
          i,
          j,
          arr1: [...arr1],
          arr2: [...arr2],
          union: [...union],
          intersection: [],
          variables: { i, j, 'arr1[i]': arr1[i] },
          description: `Add remaining element arr1[${i}] = ${arr1[i]} to union`,
          mode: 'union',
        });
      }
      i++;
    }

    // Add remaining elements from arr2
    while (j < arr2.length) {
      if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
        union.push(arr2[j]);
        steps.push({
          line: 6,
          i,
          j,
          arr1: [...arr1],
          arr2: [...arr2],
          union: [...union],
          intersection: [],
          variables: { i, j, 'arr2[j]': arr2[j] },
          description: `Add remaining element arr2[${j}] = ${arr2[j]} to union`,
          mode: 'union',
        });
      }
      j++;
    }

    steps.push({
      line: 7,
      i,
      j,
      arr1: [...arr1],
      arr2: [...arr2],
      union: [...union],
      intersection: [],
      variables: {},
      description: `Union complete! Result: [${union.join(', ')}]`,
      mode: 'union',
      isComplete: true,
    });

    return steps;
  };

  // Generate steps for Intersection
  const generateIntersectionSteps = (arr1: number[], arr2: number[]): Step[] => {
    const steps: Step[] = [];
    const intersection: number[] = [];
    let i = 0;
    let j = 0;

    steps.push({
      line: 1,
      i: 0,
      j: 0,
      arr1: [...arr1],
      arr2: [...arr2],
      union: [],
      intersection: [],
      variables: { i: 0, j: 0 },
      description: 'Initialize pointers i = 0, j = 0 for both arrays',
      mode: 'intersection',
    });

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] < arr2[j]) {
        steps.push({
          line: 2,
          i,
          j,
          arr1: [...arr1],
          arr2: [...arr2],
          union: [],
          intersection: [...intersection],
          variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
          description: `arr1[${i}] = ${arr1[i]} < arr2[${j}] = ${arr2[j]}. Increment i`,
          mode: 'intersection',
        });
        i++;
      } else if (arr2[j] < arr1[i]) {
        steps.push({
          line: 3,
          i,
          j,
          arr1: [...arr1],
          arr2: [...arr2],
          union: [],
          intersection: [...intersection],
          variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
          description: `arr2[${j}] = ${arr2[j]} < arr1[${i}] = ${arr1[i]}. Increment j`,
          mode: 'intersection',
        });
        j++;
      } else {
        // Equal elements - found intersection
        if (intersection.length === 0 || intersection[intersection.length - 1] !== arr1[i]) {
          intersection.push(arr1[i]);
          steps.push({
            line: 4,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [],
            intersection: [...intersection],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = arr2[${j}] = ${arr1[i]}. Found common element! Add ${arr1[i]} to intersection`,
            mode: 'intersection',
          });
        } else {
          steps.push({
            line: 4,
            i,
            j,
            arr1: [...arr1],
            arr2: [...arr2],
            union: [],
            intersection: [...intersection],
            variables: { i, j, 'arr1[i]': arr1[i], 'arr2[j]': arr2[j] },
            description: `arr1[${i}] = arr2[${j}] = ${arr1[i]} is duplicate, skip`,
            mode: 'intersection',
          });
        }
        i++;
        j++;
      }
    }

    steps.push({
      line: 5,
      i,
      j,
      arr1: [...arr1],
      arr2: [...arr2],
      union: [],
      intersection: [...intersection],
      variables: {},
      description: `Intersection complete! Result: [${intersection.join(', ')}]`,
      mode: 'intersection',
      isComplete: true,
    });

    return steps;
  };

  // Generate combined steps (union first, then intersection)
  const generateSteps = (arr1: number[], arr2: number[]): Step[] => {
    const unionSteps = generateUnionSteps(arr1, arr2);
    const intersectionSteps = generateIntersectionSteps(arr1, arr2);
    
    // Get final union and intersection results
    const finalUnion = unionSteps[unionSteps.length - 1]?.union || [];
    const finalIntersection = intersectionSteps[intersectionSteps.length - 1]?.intersection || [];
    
    // Add final step showing return statement
    const finalStep: Step = {
      line: 8, // Special line number for return statement
      i: arr1.length,
      j: arr2.length,
      arr1: [...arr1],
      arr2: [...arr2],
      union: [...finalUnion],
      intersection: [...finalIntersection],
      variables: {},
      description: `Return union: [${finalUnion.join(', ')}] and intersection: [${finalIntersection.join(', ')}]`,
      mode: 'union', // Use union mode for display
      isComplete: true,
    };
    
    return [...unionSteps, ...intersectionSteps, finalStep];
  };

  const [steps, setSteps] = useState<Step[]>(() => generateSteps(arr1, arr2));

  useEffect(() => {
    setSteps(generateSteps(arr1, arr2));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arr1, arr2]);

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
      const numArray1 = customArr1
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);
      const numArray2 = customArr2
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);
      if (numArray1.length >= 1 && numArray2.length >= 1) {
        setArr1(numArray1);
        setArr2(numArray2);
        setShowCustomInput(false);
        setCustomArr1('');
        setCustomArr2('');
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
        if (/i\s*=\s*0|int\s+i\s*=\s*0|let\s+i\s*=\s*0/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/if.*arr1\[i\]\s*<\s*arr2\[j\]/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/elif|else\s+if.*arr2\[j\]\s*<\s*arr1\[i\]/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/else|elif.*arr1\[i\]\s*==\s*arr2\[j\]/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 5 || stepLine === 6) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/while.*i\s*<\s*arr1\.length|while\s+i\s*<\s*len\(arr1\)/.test(line)) {
          return i + 1;
        }
      }
    }
    
    if (stepLine === 7 || stepLine === 5) {
      return lines.length;
    }
    
    // Return statement (line 8)
    if (stepLine === 8) {
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (/return.*union|return.*intersection|return\s+\[/.test(line)) {
          return i + 1;
        }
      }
      // If return not found, return last line
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
            Union & Intersection of Two Sorted Arrays
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
                      ✅ {currentStepData.line === 8 ? 'Algorithm Complete!' : currentStepData.mode === 'union' ? 'Union' : 'Intersection'} Complete!
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
                          O(m + n)
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
                          O(m + n)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Array 1 */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.textSecondary,
                      mb: 1,
                    }}
                  >
                    Array 1{' '}
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
                      arr1
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {currentStepData.arr1.map((num, idx) => {
                      const isActive = currentStepData.i === idx;
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
                              border: isActive
                                ? `2px solid ${themeColors.primary}`
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isActive
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
                          {isActive && (
                            <Typography
                              sx={{
                                mt: 1,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: themeColors.primary,
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

                {/* Array 2 */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: themeColors.textSecondary,
                      mb: 1,
                    }}
                  >
                    Array 2{' '}
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
                      arr2
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {currentStepData.arr2.map((num, idx) => {
                      const isActive = currentStepData.j === idx;
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
                              border: isActive
                                ? `2px solid ${themeColors.primary}`
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isActive
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
                          {isActive && (
                            <Typography
                              sx={{
                                mt: 1,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: themeColors.primary,
                              }}
                            >
                              j
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Union Result */}
                {(currentStepData.mode === 'union' || currentStepData.line === 8) && (
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Union{' '}
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
                        union
                      </Box>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center', flexWrap: 'wrap', minHeight: 60 }}>
                      {currentStepData.union.length > 0 ? (
                        currentStepData.union.map((num, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1.5,
                              border: `2px solid #10b981`,
                              backgroundColor: '#10b98133',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: '#10b981',
                              }}
                            >
                              {num}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem' }}>
                          Empty
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Intersection Result */}
                {(currentStepData.mode === 'intersection' || currentStepData.line === 8) && (
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Intersection{' '}
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
                        intersection
                      </Box>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center', flexWrap: 'wrap', minHeight: 60 }}>
                      {currentStepData.intersection.length > 0 ? (
                        currentStepData.intersection.map((num, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1.5,
                              border: `2px solid #f59e0b`,
                              backgroundColor: '#f59e0b33',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: '#f59e0b',
                              }}
                            >
                              {num}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem' }}>
                          Empty
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
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
                flex: 1,
                overflow: 'auto',
                p: 4,
              }}
            >
              {question?.explanation ? (
                <>
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
            label="Array 1 (comma-separated, will be sorted)"
            value={customArr1}
            onChange={(e) => setCustomArr1(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="1, 3, 4, 5, 7"
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
            label="Array 2 (comma-separated, will be sorted)"
            value={customArr2}
            onChange={(e) => setCustomArr2(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="2, 3, 5, 6"
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

export default UnionIntersectionVisualization;

