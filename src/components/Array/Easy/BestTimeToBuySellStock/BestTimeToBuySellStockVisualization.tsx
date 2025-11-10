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
  minPrice?: number;
  maxProfit?: number;
  variables: Record<string, any>;
  description: string;
  isSolution?: boolean;
  result?: number;
  buyDay?: number;
  sellDay?: number;
}

const BestTimeToBuySellStockVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 2;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [prices, setPrices] = useState([7, 1, 5, 3, 6, 4]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPrices, setCustomPrices] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Generate animation steps
  const generateSteps = (prices: number[]): Step[] => {
    const steps: Step[] = [];
    let minPrice = Infinity;
    let maxProfit = 0;
    let buyDay = -1;
    let sellDay = -1;

    // Initial state
    steps.push({
      line: 1,
      variables: {},
      description: 'Initialize: minPrice = Infinity, maxProfit = 0',
    });

    for (let i = 0; i < prices.length; i++) {
      // Update min price
      if (prices[i] < minPrice) {
        minPrice = prices[i];
        buyDay = i;
        steps.push({
          line: 2,
          i,
          minPrice,
          maxProfit,
          variables: { i, price: prices[i], minPrice, maxProfit },
          description: `Day ${i}: Price = ${prices[i]}. Update minPrice = ${minPrice} (buy on day ${i})`,
          buyDay,
        });
      } else {
        steps.push({
          line: 2,
          i,
          minPrice,
          maxProfit,
          variables: { i, price: prices[i], minPrice, maxProfit },
          description: `Day ${i}: Price = ${prices[i]}. minPrice = ${minPrice} (no update)`,
          buyDay,
        });
      }

      // Calculate profit
      const profit = prices[i] - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;
        sellDay = i;
        steps.push({
          line: 3,
          i,
          minPrice,
          maxProfit,
          variables: { i, price: prices[i], minPrice, maxProfit, profit },
          description: `Day ${i}: Profit = ${prices[i]} - ${minPrice} = ${profit}. Update maxProfit = ${maxProfit}`,
          buyDay,
          sellDay,
        });
      } else {
        steps.push({
          line: 3,
          i,
          minPrice,
          maxProfit,
          variables: { i, price: prices[i], minPrice, maxProfit, profit },
          description: `Day ${i}: Profit = ${prices[i]} - ${minPrice} = ${profit}. maxProfit = ${maxProfit} (no update)`,
          buyDay,
          sellDay: sellDay >= 0 ? sellDay : undefined,
        });
      }
    }

    // Final solution
    steps.push({
      line: 4,
      minPrice,
      maxProfit,
      variables: { minPrice, maxProfit },
      description: `Maximum profit: ${maxProfit}`,
      isSolution: true,
      result: maxProfit,
      buyDay,
      sellDay,
    });

    return steps;
  };

  const [steps, setSteps] = useState<Step[]>(() => generateSteps(prices));

  useEffect(() => {
    setSteps(generateSteps(prices));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [prices]);

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
      const priceArray = customPrices
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (priceArray.length >= 1) {
        setPrices(priceArray);
        setShowCustomInput(false);
        setCustomPrices('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  // Get code from questionsData and split into lines
  const code = question?.codes?.[language as keyof typeof question.codes] || question?.codes?.Python || '';
  const codeLines = useMemo(() => {
    return code.split('\n');
  }, [code, language]);

  // Dynamic function to get line number for a logical step by parsing code patterns
  const getHighlightedLine = (stepLine: number, lang: string): number => {
    const currentCode = question?.codes?.[lang as keyof typeof question.codes] || question?.codes?.Python || '';
    if (!currentCode) return -1;
    const lines = currentCode.split('\n');
    
    // Step 1: Initialize minPrice and maxProfit
    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: min_price = float('inf')
        if (lang === 'Python' && /min_price\s*=\s*float\(/.test(line)) {
          return i + 1;
        }
        // Java: int minPrice = Integer.MAX_VALUE;
        if (lang === 'Java' && /int\s+minPrice\s*=\s*Integer\.MAX_VALUE/.test(line)) {
          return i + 1;
        }
        // C++: int minPrice = INT_MAX;
        if (lang === 'C++' && /int\s+minPrice\s*=\s*INT_MAX/.test(line)) {
          return i + 1;
        }
        // JavaScript: let minPrice = Infinity;
        if (lang === 'JavaScript' && /let\s+minPrice\s*=\s*Infinity/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 2: Update minPrice (inside for loop)
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: min_price = min(min_price, price)
        if (lang === 'Python' && /min_price\s*=\s*min\(min_price/.test(line)) {
          return i + 1;
        }
        // Java: minPrice = Math.min(minPrice, price);
        if (lang === 'Java' && /minPrice\s*=\s*Math\.min\(minPrice/.test(line)) {
          return i + 1;
        }
        // C++: minPrice = min(minPrice, price);
        if (lang === 'C++' && /minPrice\s*=\s*min\(minPrice/.test(line)) {
          return i + 1;
        }
        // JavaScript: minPrice = Math.min(minPrice, price);
        if (lang === 'JavaScript' && /minPrice\s*=\s*Math\.min\(minPrice/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 3: Update maxProfit (inside for loop)
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: max_profit = max(max_profit, price - min_price)
        if (lang === 'Python' && /max_profit\s*=\s*max\(max_profit/.test(line)) {
          return i + 1;
        }
        // Java: maxProfit = Math.max(maxProfit, price - minPrice);
        if (lang === 'Java' && /maxProfit\s*=\s*Math\.max\(maxProfit/.test(line)) {
          return i + 1;
        }
        // C++: maxProfit = max(maxProfit, price - minPrice);
        if (lang === 'C++' && /maxProfit\s*=\s*max\(maxProfit/.test(line)) {
          return i + 1;
        }
        // JavaScript: maxProfit = Math.max(maxProfit, price - minPrice);
        if (lang === 'JavaScript' && /maxProfit\s*=\s*Math\.max\(maxProfit/.test(line)) {
          return i + 1;
        }
      }
    }
    
    // Step 4: Return maxProfit
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Python: return max_profit
        if (lang === 'Python' && /^return\s+max_profit/.test(line)) {
          return i + 1;
        }
        // Java: return maxProfit;
        if (lang === 'Java' && /^return\s+maxProfit/.test(line)) {
          return i + 1;
        }
        // C++: return maxProfit;
        if (lang === 'C++' && /^return\s+maxProfit/.test(line)) {
          return i + 1;
        }
        // JavaScript: return maxProfit;
        if (lang === 'JavaScript' && /^return\s+maxProfit/.test(line)) {
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
            Best Time to Buy and Sell Stock
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
          {/* Price Chart Visualization */}
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
            {/* Success Message */}
            {currentStepData.isSolution && (
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
                    animation: 'pulse 0.8s ease infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  🎉 Maximum Profit: {currentStepData.result}
                  {currentStepData.buyDay !== undefined && currentStepData.sellDay !== undefined && (
                    <Typography sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                      Buy on Day {currentStepData.buyDay}, Sell on Day {currentStepData.sellDay}
                    </Typography>
                  )}
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

            {/* Price Array */}
            <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: themeColors.textSecondary,
                  mb: 2,
                }}
              >
                Stock Prices
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end' }}>
                {prices.map((price, idx) => {
                  const isCurrent = currentStepData.i === idx;
                  const isBuyDay = currentStepData.buyDay === idx;
                  const isSellDay = currentStepData.sellDay === idx;
                  const maxPrice = Math.max(...prices);
                  const height = (price / maxPrice) * 200;

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
                          height: `${Math.max(height, 30)}px`,
                          minHeight: '30px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          borderRadius: '4px 4px 0 0',
                          backgroundColor: isBuyDay
                            ? '#10b981'
                            : isSellDay
                            ? '#ef4444'
                            : isCurrent
                            ? `${themeColors.primary}66`
                            : `${themeColors.primary}33`,
                          border: isBuyDay
                            ? '3px solid #10b981'
                            : isSellDay
                            ? '3px solid #ef4444'
                            : isCurrent
                            ? `2px solid ${themeColors.primary}`
                            : `1px solid ${themeColors.borderLight}`,
                          transition: 'all 0.3s ease',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: themeColors.white,
                            mb: 0.5,
                          }}
                        >
                          {price}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: '0.75rem',
                          color: themeColors.textSecondary,
                        }}
                      >
                        Day {idx}
                      </Typography>
                      {isBuyDay && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#10b981',
                          }}
                        >
                          BUY
                        </Typography>
                      )}
                      {isSellDay && (
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#ef4444',
                          }}
                        >
                          SELL
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
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
            label="Prices (comma-separated)"
            value={customPrices}
            onChange={(e) => setCustomPrices(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="7, 1, 5, 3, 6, 4"
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

export default BestTimeToBuySellStockVisualization;

