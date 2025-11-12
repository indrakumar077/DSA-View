import { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../../../theme';
import { useVisualizationState } from '../../../../../core/hooks/useVisualizationState';
import { useQuestionData } from '../../../../../core/hooks/useQuestionData';
import { getHighlightedLine } from '../../../../../core/utils/codeHighlighting';
import { VisualizationLayout } from '../../../../../shared/layouts/VisualizationLayout';
import { CodeViewer } from '../../../../../shared/components/CodeViewer';
import { VisualizationControlBar } from '../../../../../shared/components/VisualizationControlBar';
import { CustomInputDialog } from '../../../../../shared/components/CustomInputDialog';
import { StepDescription, SolutionMessage } from '../../../../../shared/components/VisualizationComponents';
import { VisualizationStep, Language } from '../../../../../types';
import { DEFAULT_LANGUAGE } from '../../../../../constants';

interface StockStep extends VisualizationStep {
  i?: number;
  minPrice?: number;
  buyDay?: number; // Day index where we would buy (minPrice day)
  profit?: number;
  maxProfit?: number;
  isSolution?: boolean;
  result?: number;
}

export const BestTimeToBuyAndSellStockVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 121;
  
  // Get default input from question data
  const defaultPrices: number[] = (question?.defaultInput as any)?.prices || [7, 1, 5, 3, 6, 4];
  
  const [prices, setPrices] = useState<number[]>(defaultPrices);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPrices, setCustomPrices] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Update when question changes
  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.prices && Array.isArray(input.prices)) {
        setPrices(input.prices);
      }
    }
  }, [question]);

  // Generate animation steps
  const generateSteps = (prices: number[]): StockStep[] => {
    const steps: StockStep[] = [];
    let minPrice = Infinity;
    let maxProfit = 0;
    let buyDay = -1; // Track the day index where we would buy

    // Initial state
    steps.push({
      line: 1,
      variables: {},
      description: 'Initialize minPrice to infinity and maxProfit to 0',
      minPrice: Infinity,
      maxProfit: 0,
      buyDay: -1,
    });

    for (let i = 0; i < prices.length; i++) {
      // Current iteration
      steps.push({
        line: 3,
        i,
        minPrice,
        maxProfit,
        buyDay,
        variables: { i, 'prices[i]': prices[i] },
        description: `Day ${i}: Price = ${prices[i]}`,
      });

      // Check if current price is less than minPrice
      steps.push({
        line: 4,
        i,
        minPrice,
        maxProfit,
        buyDay,
        variables: { i, 'prices[i]': prices[i] },
        description: `Checking if prices[${i}] (${prices[i]}) < minPrice (${minPrice === Infinity ? 'infinity' : minPrice})...`,
      });

      // If current price is less than minPrice
      if (prices[i] < minPrice) {
        steps.push({
          line: 4,
          i,
          minPrice,
          maxProfit,
          buyDay,
          variables: { i, 'prices[i]': prices[i] },
          description: `Condition: TRUE ✓\nprices[${i}] (${prices[i]}) < minPrice (${minPrice === Infinity ? 'infinity' : minPrice})\nUpdate minPrice to ${prices[i]} (Buy on Day ${i})`,
        });
        
        minPrice = prices[i];
        buyDay = i;
        
        steps.push({
          line: 5,
          i,
          minPrice,
          maxProfit,
          buyDay,
          variables: { i, 'prices[i]': prices[i] },
          description: `minPrice updated to ${minPrice} (Best buy day: Day ${buyDay})`,
        });
      } else {
        steps.push({
          line: 4,
          i,
          minPrice,
          maxProfit,
          buyDay,
          variables: { i, 'prices[i]': prices[i] },
          description: `Condition: FALSE ✗\nprices[${i}] (${prices[i]}) >= minPrice (${minPrice})\nKeep minPrice as ${minPrice} (Buy on Day ${buyDay})`,
        });
      }

      // Calculate profit
      const profit = prices[i] - minPrice;
      steps.push({
        line: 6,
        i,
        minPrice,
        buyDay,
        profit,
        maxProfit,
        variables: { i, 'prices[i]': prices[i], profit },
        description: `Calculate profit: prices[${i}] - minPrice = ${prices[i]} - ${minPrice} = ${profit}`,
      });

      // Check if profit is greater than maxProfit
      steps.push({
        line: 7,
        i,
        minPrice,
        buyDay,
        profit,
        maxProfit,
        variables: { i, 'prices[i]': prices[i], profit },
        description: `Checking if profit (${profit}) > maxProfit (${maxProfit})...`,
      });

      // If profit is greater than maxProfit
      if (profit > maxProfit) {
        steps.push({
          line: 7,
          i,
          minPrice,
          buyDay,
          profit,
          maxProfit,
          variables: { i, 'prices[i]': prices[i], profit },
          description: `Condition: TRUE ✓\nprofit (${profit}) > maxProfit (${maxProfit})\nUpdate maxProfit to ${profit}\nBest strategy: Buy on Day ${buyDay} (price ${minPrice}), Sell on Day ${i} (price ${prices[i]})`,
        });
        
        maxProfit = profit;
        
        steps.push({
          line: 8,
          i,
          minPrice,
          buyDay,
          profit,
          maxProfit,
          variables: { i, 'prices[i]': prices[i], profit },
          description: `maxProfit updated to ${maxProfit}`,
        });
      } else {
        steps.push({
          line: 7,
          i,
          minPrice,
          buyDay,
          profit,
          maxProfit,
          variables: { i, 'prices[i]': prices[i], profit },
          description: `Condition: FALSE ✗\nprofit (${profit}) <= maxProfit (${maxProfit})\nKeep maxProfit as ${maxProfit}`,
        });
      }
    }

    // Final result
    steps.push({
      line: 9,
      minPrice,
      buyDay,
      maxProfit,
      variables: { maxProfit },
      description: `Return maxProfit: ${maxProfit}`,
      isSolution: true,
      result: maxProfit,
    });

    return steps;
  };

  const [steps, setSteps] = useState<StockStep[]>(() => generateSteps(prices));

  useEffect(() => {
    setSteps(generateSteps(prices));
  }, [prices]);

  const {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    handlePlayPause,
    handlePrevious,
    handleNext,
    currentStepData,
    reset,
  } = useVisualizationState({
    steps,
    onCustomInput: () => setShowCustomInput(true),
  });

  useEffect(() => {
    reset();
  }, [prices, reset]);

  const handleCustomInput = () => {
    try {
      const priceArray = customPrices
        .split(',')
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p) && p >= 0);
      if (priceArray.length >= 1) {
        setPrices(priceArray);
        setShowCustomInput(false);
        setCustomPrices('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Prices (comma-separated)',
      value: customPrices,
      onChange: setCustomPrices,
      placeholder: '7, 1, 5, 3, 6, 4',
    },
  ];

  const highlightedLine = useMemo(
    () => getHighlightedLine(currentStepData.line, language, questionId),
    [currentStepData.line, language, questionId]
  ) as number;

  // Safety check
  if (!steps || steps.length === 0 || !currentStepData) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColors.backgroundDark,
          color: themeColors.white,
        }}
      >
        <Typography>Loading visualization...</Typography>
      </Box>
    );
  }

  // Extract visualization content
  const visualizationContent = (
    <>
      {/* Success Message - Fixed at top - Only show at final step */}
      {currentStepData.isSolution && 
       currentStepData.result !== undefined && 
       currentStepData.line === 9 && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: themeColors.backgroundDark,
            pt: 2,
            pb: 1,
            px: 2,
          }}
        >
          <SolutionMessage
            result={currentStepData.result}
            timeComplexity="O(n)"
            spaceComplexity="O(1)"
          />
        </Box>
      )}

      {/* Prices Array Visualization */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
          p: 2,
          pt: 3,
          minHeight: '50vh',
        }}
      >
        {/* Bar Chart Visualization */}
        <Box sx={{ width: '100%', px: 2, mt: 2 }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 1.5,
              textAlign: 'center',
            }}
          >
            Stock Prices{' '}
            <Box
              component="code"
              sx={{
                backgroundColor: themeColors.inputBgDark,
                px: 0.75,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '0.65rem',
                fontFamily: 'monospace',
              }}
            >
              prices
            </Box>
          </Typography>
          
          {/* Bar Chart Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              gap: { xs: 0.5, sm: 1 },
              height: 180,
              position: 'relative',
              borderBottom: `2px solid ${themeColors.borderLight}`,
              borderLeft: `2px solid ${themeColors.borderLight}`,
              px: 1,
              pb: 0,
              pt: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: themeColors.inputBgDark,
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: themeColors.borderLight,
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: themeColors.primary,
                },
              },
            }}
          >
            {prices.map((price: number, idx: number) => {
              const maxPrice = Math.max(...prices);
              const minPrice = Math.min(...prices);
              const priceRange = maxPrice - minPrice || 1;
              // Clamp bar height to max 160px, min 20px (reduced from 180 to fit better)
              const barHeight = Math.min(Math.max(((price - minPrice) / priceRange) * 140 + 20, 20), 160);
              const isCurrentDay = currentStepData.i === idx;
              const isSolutionDay = currentStepData.isSolution && currentStepData.i === idx;
              
              // Check if this is the buy day or sell day
              const buyDayIndex = currentStepData.buyDay !== undefined ? currentStepData.buyDay : -1;
              const isBuyDay = buyDayIndex === idx && currentStepData.minPrice === price;
              const isSellDay = isSolutionDay && currentStepData.profit !== undefined && currentStepData.profit > 0 && buyDayIndex >= 0;

              // Dynamic sizing based on array length
              const arrayLength = prices.length;
              const isLargeArray = arrayLength > 20;
              const barWidth = isLargeArray ? 35 : arrayLength > 15 ? 40 : 45;
              const priceFontSize = isLargeArray ? '0.6rem' : '0.65rem';
              const dayFontSize = isLargeArray ? '0.6rem' : '0.65rem';

              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: barWidth,
                    maxWidth: barWidth,
                    flexShrink: 0,
                  }}
                >
                  {/* Price label above bar */}
                  <Typography
                    sx={{
                      fontSize: priceFontSize,
                      fontWeight: 700,
                      color: isCurrentDay || isBuyDay || isSellDay
                        ? themeColors.primary
                        : themeColors.textSecondary,
                      mb: 0.25,
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      lineHeight: 1.2,
                    }}
                  >
                    {price}
                  </Typography>
                  
                  {/* Bar */}
                  <Box
                    sx={{
                      width: '100%',
                      height: `${barHeight}px`,
                      minHeight: '20px',
                      backgroundColor: isSellDay
                        ? '#10b981'
                        : isBuyDay
                        ? '#f59e0b'
                        : isCurrentDay
                        ? themeColors.primary
                        : themeColors.borderLight,
                      borderRadius: '4px 4px 0 0',
                      border: isCurrentDay || isBuyDay || isSellDay
                        ? `2px solid ${isSellDay ? '#10b981' : isBuyDay ? '#f59e0b' : themeColors.primary}`
                        : 'none',
                      borderBottom: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      pb: 0,
                      boxShadow: isCurrentDay || isBuyDay || isSellDay
                        ? `0 0 12px ${isSellDay ? '#10b98166' : isBuyDay ? '#f59e0b66' : themeColors.primary + '66'}`
                        : 'none',
                    }}
                  />
                  
                  {/* Day label */}
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: dayFontSize,
                      color: isCurrentDay || isBuyDay || isSellDay
                        ? themeColors.primary
                        : themeColors.textSecondary,
                      fontWeight: isCurrentDay || isBuyDay || isSellDay ? 700 : 400,
                      lineHeight: 1.2,
                    }}
                  >
                    Day {idx}
                  </Typography>
                  
                  {/* Indicators */}
                  {isBuyDay && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: '0.55rem',
                        color: '#f59e0b',
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    >
                      BUY
                    </Typography>
                  )}
                  {isSellDay && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: '0.55rem',
                        color: '#10b981',
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    >
                      SELL
                    </Typography>
                  )}
                  {isCurrentDay && !isBuyDay && !isSellDay && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: '0.55rem',
                        color: themeColors.primary,
                        fontWeight: 700,
                        lineHeight: 1.2,
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

      {/* Variables and Info */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: `1px solid ${themeColors.borderLight}`,
          backgroundColor: themeColors.inputBgDark,
          p: 1.5,
        }}
      >
        {/* Current Step Description */}
        <StepDescription
          description={currentStepData.description}
          isSolution={currentStepData.isSolution}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
            mt: 1.5,
          }}
        >
          {/* Variables */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Variables
            </Typography>
            <Box
              sx={{
                backgroundColor: themeColors.backgroundDark,
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                minHeight: 50,
                maxHeight: 150,
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
                        gap: 0.75,
                        backgroundColor: `${themeColors.primary}1a`,
                        padding: '3px 8px',
                        borderRadius: 0.75,
                        border: `1px solid ${themeColors.primary}33`,
                      }}
                    >
                      <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.7rem' }}>
                        {key}:
                      </Typography>
                      <Typography
                        sx={{
                          color: themeColors.white,
                          fontWeight: 600,
                          fontSize: '0.7rem',
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

          {/* Tracking Values */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Tracking
            </Typography>
            <Box
              sx={{
                backgroundColor: themeColors.backgroundDark,
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                minHeight: 50,
                maxHeight: 150,
                overflow: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    backgroundColor: `${themeColors.primary}1a`,
                    padding: '3px 8px',
                    borderRadius: 0.75,
                    border: `1px solid ${themeColors.primary}33`,
                  }}
                >
                  <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.7rem' }}>
                    minPrice:
                  </Typography>
                  <Typography
                    sx={{
                      color: themeColors.white,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  >
                    {currentStepData.minPrice === Infinity ? '∞' : currentStepData.minPrice}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    backgroundColor: `${themeColors.primary}1a`,
                    padding: '3px 8px',
                    borderRadius: 0.75,
                    border: `1px solid ${themeColors.primary}33`,
                  }}
                >
                  <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.7rem' }}>
                    maxProfit:
                  </Typography>
                  <Typography
                    sx={{
                      color: currentStepData.isSolution ? '#10b981' : themeColors.white,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  >
                    {currentStepData.maxProfit ?? 0}
                  </Typography>
                </Box>
                {currentStepData.profit !== undefined && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      backgroundColor: `${themeColors.primary}1a`,
                      padding: '3px 8px',
                      borderRadius: 0.75,
                      border: `1px solid ${themeColors.primary}33`,
                    }}
                  >
                    <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.7rem' }}>
                      profit:
                    </Typography>
                    <Typography
                      sx={{
                        color: themeColors.white,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      {currentStepData.profit}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

  // Extract explanation content
  const explanationContent = question?.explanation ? (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 4,
      }}
    >
      {/* Approach */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: themeColors.white,
            mb: 2,
          }}
        >
          Approach
        </Typography>
        <Box
          sx={{
            backgroundColor: themeColors.inputBgDark,
            p: 3,
            borderLeft: `4px solid ${themeColors.primary}`,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9375rem',
              color: themeColors.textSecondary,
              lineHeight: 1.8,
            }}
          >
            {question.explanation.approach}
          </Typography>
        </Box>
      </Box>

      {/* Step-by-Step Solution */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: themeColors.white,
            mb: 2,
          }}
        >
          Step-by-Step Solution
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {question.explanation.steps.map((step: string, index: number) => (
            <Box
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
            </Box>
          ))}
        </Box>
      </Box>

      {/* Complexity Analysis */}
      <Box>
        <Typography
          sx={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: themeColors.white,
            mb: 2,
          }}
        >
          Complexity Analysis
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
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
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: themeColors.primary,
                fontFamily: 'monospace',
              }}
            >
              {question.explanation.timeComplexity}
            </Typography>
          </Box>
          <Box
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
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: themeColors.primary,
                fontFamily: 'monospace',
              }}
            >
              {question.explanation.spaceComplexity}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
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
  );

  const codeContent = (
    <CodeViewer
      questionId={questionId}
      language={language}
      onLanguageChange={setLanguage}
      highlightedLine={highlightedLine}
      controls={
        <VisualizationControlBar
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          speed={speed}
          onSpeedChange={setSpeed}
          onCustomInput={() => setShowCustomInput(true)}
        />
      }
    />
  );

  return (
    <>
      <VisualizationLayout
        title={question?.title || 'Best Time to Buy and Sell Stock'}
        questionId={questionId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visualizationContent={visualizationContent}
        explanationContent={explanationContent}
        codeContent={codeContent}
      />
      <CustomInputDialog
        open={showCustomInput}
        onClose={() => setShowCustomInput(false)}
        onSubmit={handleCustomInput}
        fields={customInputFields}
        title="Custom Input"
      />
    </>
  );
};

