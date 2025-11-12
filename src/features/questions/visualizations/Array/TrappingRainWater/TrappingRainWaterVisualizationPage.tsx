import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
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

interface TrappingRainWaterStep extends VisualizationStep {
  left?: number;
  right?: number;
  maxLeft?: number;
  maxRight?: number;
  water?: number[];
  totalWater?: number;
  isSolution?: boolean;
  result?: number;
}

export const TrappingRainWaterVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 42;
  
  // Get default input from question data
  const defaultHeight: number[] = (question?.defaultInput as any)?.height || [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
  
  const [height, setHeight] = useState<number[]>(defaultHeight);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHeight, setCustomHeight] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Update when question changes
  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.height && Array.isArray(input.height)) {
        setHeight(input.height);
      }
    }
  }, [question]);

  // Generate animation steps using two-pointer approach
  const generateSteps = (height: number[]): TrappingRainWaterStep[] => {
    const steps: TrappingRainWaterStep[] = [];
    
    if (height.length === 0) {
      steps.push({
        line: 1,
        variables: {},
        water: [],
        totalWater: 0,
        description: 'Empty array, return 0',
        result: 0,
        isSolution: true,
      });
      return steps;
    }

    let left = 0;
    let right = height.length - 1;
    let maxLeft = 0;
    let maxRight = 0;
    let totalWater = 0;
    const water: number[] = new Array(height.length).fill(0);

    // Initial state - Step 1: Check if empty (line 1), Steps 2-4: Initialize (lines 2-4)
    steps.push({
      line: 2,
      variables: {},
      left: 0,
      right: height.length - 1,
      maxLeft: 0,
      maxRight: 0,
      water: [...water],
      totalWater: 0,
      description: `Initialize: left = 0, right = ${height.length - 1}, maxLeft = 0, maxRight = 0, totalWater = 0`,
    });

    while (left < right) {
      // Step 5: Main loop condition
      steps.push({
        line: 5,
        left,
        right,
        maxLeft,
        maxRight,
        water: [...water],
        totalWater,
        variables: {
          left,
          right,
          'height[left]': height[left],
          'height[right]': height[right],
          maxLeft,
          maxRight,
        },
        description: `Loop: left=${left} < right=${right}\nComparing heights at left=${left} (${height[left]}) and right=${right} (${height[right]})`,
      });

      // Step 6: Compare heights
      if (height[left] < height[right]) {
        // Process left side
        steps.push({
          line: 6,
          left,
          right,
          maxLeft,
          maxRight,
          water: [...water],
          totalWater,
          variables: {
            left,
            right,
            'height[left]': height[left],
            'height[right]': height[right],
            maxLeft,
            maxRight,
          },
          description: `height[left] (${height[left]}) < height[right] (${height[right]})\nProcessing left side...`,
        });

        // Step 7: Check maxLeft
        if (height[left] >= maxLeft) {
          steps.push({
            line: 7,
            left,
            right,
            maxLeft,
            maxRight,
            water: [...water],
            totalWater,
            variables: {
              left,
              right,
              'height[left]': height[left],
              maxLeft,
            },
            description: `height[left] (${height[left]}) >= maxLeft (${maxLeft})\nUpdate maxLeft to ${height[left]}`,
          });
          maxLeft = height[left];
        } else {
          // Step 9: Calculate trapped water on left
          const trapped = maxLeft - height[left];
          water[left] = trapped;
          totalWater += trapped;
          
          steps.push({
            line: 9,
            left,
            right,
            maxLeft,
            maxRight,
            water: [...water],
            totalWater,
            variables: {
              left,
              right,
              'height[left]': height[left],
              maxLeft,
              trapped,
            },
            description: `height[left] (${height[left]}) < maxLeft (${maxLeft})\nTrapped water at index ${left} = ${maxLeft} - ${height[left]} = ${trapped}\nTotal water: ${totalWater}`,
          });
        }

        // Step 10: Move left pointer
        steps.push({
          line: 10,
          left: left + 1,
          right,
          maxLeft,
          maxRight,
          water: [...water],
          totalWater,
          variables: {
            left: left + 1,
            right,
            maxLeft,
            maxRight,
          },
          description: `Move left pointer: left = ${left + 1}`,
        });
        left++;
      } else {
        // Process right side
        steps.push({
          line: 6,
          left,
          right,
          maxLeft,
          maxRight,
          water: [...water],
          totalWater,
          variables: {
            left,
            right,
            'height[left]': height[left],
            'height[right]': height[right],
            maxLeft,
            maxRight,
          },
          description: `height[left] (${height[left]}) >= height[right] (${height[right]})\nProcessing right side...`,
        });

        // Step 11: Check maxRight
        if (height[right] >= maxRight) {
          steps.push({
            line: 11,
            left,
            right,
            maxLeft,
            maxRight,
            water: [...water],
            totalWater,
            variables: {
              left,
              right,
              'height[right]': height[right],
              maxRight,
            },
            description: `height[right] (${height[right]}) >= maxRight (${maxRight})\nUpdate maxRight to ${height[right]}`,
          });
          maxRight = height[right];
        } else {
          // Step 13: Calculate trapped water on right
          const trapped = maxRight - height[right];
          water[right] = trapped;
          totalWater += trapped;
          
          steps.push({
            line: 13,
            left,
            right,
            maxLeft,
            maxRight,
            water: [...water],
            totalWater,
            variables: {
              left,
              right,
              'height[right]': height[right],
              maxRight,
              trapped,
            },
            description: `height[right] (${height[right]}) < maxRight (${maxRight})\nTrapped water at index ${right} = ${maxRight} - ${height[right]} = ${trapped}\nTotal water: ${totalWater}`,
          });
        }

        // Step 14: Move right pointer
        steps.push({
          line: 14,
          left,
          right: right - 1,
          maxLeft,
          maxRight,
          water: [...water],
          totalWater,
          variables: {
            left,
            right: right - 1,
            maxLeft,
            maxRight,
          },
          description: `Move right pointer: right = ${right - 1}`,
        });
        right--;
      }
    }

    // Step 15: Final solution
    steps.push({
      line: 15,
      left,
      right,
      maxLeft,
      maxRight,
      water: [...water],
      totalWater,
      variables: {
        left,
        right,
        totalWater,
      },
      description: `Loop complete: left (${left}) >= right (${right})\nTotal trapped rainwater: ${totalWater}`,
      isSolution: true,
      result: totalWater,
    });

    return steps;
  };

  const [steps, setSteps] = useState<TrappingRainWaterStep[]>(() => generateSteps(height));

  useEffect(() => {
    setSteps(generateSteps(height));
  }, [height]);

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
  }, [height, reset]);

  const handleCustomInput = () => {
    try {
      const heightArray = customHeight
        .split(',')
        .map((h) => parseInt(h.trim()))
        .filter((h) => !isNaN(h) && h >= 0);
      if (heightArray.length >= 1) {
        setHeight(heightArray);
        setShowCustomInput(false);
        setCustomHeight('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Height Array (comma-separated)',
      value: customHeight,
      onChange: setCustomHeight,
      placeholder: '0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1',
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

  // Calculate max height for visualization scaling
  const maxHeight = Math.max(...height, 1);
  const water = currentStepData.water || [];

  // Extract visualization content
  const visualizationContent = (
    <>
      {/* Success Message - Fixed at top - Only show at final step */}
      {currentStepData.isSolution && 
       currentStepData.result !== undefined && 
       currentStepData.line === 15 && (
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

      {/* Rain Water Visualization */}
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
            Elevation Map{' '}
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
              height
            </Box>
            {' '}and Trapped Water
          </Typography>
          
          {/* Bar Chart Container */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              gap: { xs: 0.5, sm: 1 },
              height: 250,
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
            {height.map((h: number, idx: number) => {
              const isLeftPointer = currentStepData.left === idx;
              const isRightPointer = currentStepData.right === idx;
              const trappedWater = water[idx] || 0;
              
              // Calculate heights for visualization
              const barHeight = (h / maxHeight) * 180;
              const waterHeight = (trappedWater / maxHeight) * 180;
              
              // Dynamic sizing based on array length
              const arrayLength = height.length;
              const isLargeArray = arrayLength > 20;
              const barWidth = isLargeArray ? 35 : arrayLength > 15 ? 40 : 45;
              const fontSize = isLargeArray ? '0.6rem' : '0.65rem';
              const indexFontSize = isLargeArray ? '0.55rem' : '0.6rem';

              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Water layer (on top) */}
                  {trappedWater > 0 && (
                    <Box
                      sx={{
                        width: barWidth,
                        height: waterHeight,
                        backgroundColor: '#3b82f6',
                        opacity: 0.7,
                        border: '1px solid #2563eb',
                        borderRadius: '2px 2px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: barHeight,
                        zIndex: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {waterHeight > 15 && (
                        <Typography
                          sx={{
                            fontSize: fontSize,
                            fontWeight: 600,
                            color: themeColors.white,
                            textAlign: 'center',
                          }}
                        >
                          {trappedWater}
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {/* Elevation bar */}
                  <Box
                    sx={{
                      width: barWidth,
                      height: barHeight,
                      minHeight: h > 0 ? 10 : 2,
                      backgroundColor:
                        isLeftPointer || isRightPointer
                          ? themeColors.primary
                          : themeColors.borderLight,
                      border:
                        isLeftPointer || isRightPointer
                          ? `2px solid ${themeColors.primary}`
                          : `1px solid ${themeColors.borderLight}`,
                      borderRadius: '2px 2px 0 0',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      zIndex: 1,
                    }}
                  >
                    {barHeight > 20 && (
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontWeight: 700,
                          color: themeColors.white,
                          mb: 0.5,
                        }}
                      >
                        {h}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Index label */}
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: indexFontSize,
                      color: themeColors.textSecondary,
                    }}
                  >
                    {idx}
                  </Typography>
                  
                  {/* Pointer labels */}
                  {isLeftPointer && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      left
                    </Typography>
                  )}
                  {isRightPointer && (
                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      right
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Total Water Display */}
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Total Trapped Water:
          </Typography>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: themeColors.primary,
              fontFamily: 'monospace',
            }}
          >
            {currentStepData.totalWater !== undefined ? currentStepData.totalWater : 0}
          </Typography>
        </Box>
      </Box>

      {/* Data Structures */}
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

          {/* Water Array */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Trapped Water Array
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
              <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                {water.length > 0
                  ? `[${water.map((w, i) => (w > 0 ? `${i}:${w}` : '0')).join(', ')}]`
                  : '[]'}
              </Typography>
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
        <Paper
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
        </Paper>
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
            fontSize: '1.125rem',
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
                fontSize: '0.9375rem',
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
                fontSize: '0.9375rem',
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

  // Code content
  const codeContent = (
    <CodeViewer
      questionId={questionId}
      language={language}
      onLanguageChange={setLanguage}
      highlightedLine={highlightedLine}
      controls={
        <VisualizationControlBar
          isPlaying={isPlaying}
          speed={speed}
          currentStep={currentStep}
          totalSteps={steps.length}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSpeedChange={setSpeed}
          onCustomInput={() => setShowCustomInput(true)}
        />
      }
    />
  );

  return (
    <>
      <VisualizationLayout
        title="Trapping Rain Water"
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
      />
    </>
  );
};

export default TrappingRainWaterVisualizationPage;

