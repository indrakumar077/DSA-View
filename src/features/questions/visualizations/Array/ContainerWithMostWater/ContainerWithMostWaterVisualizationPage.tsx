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

interface ContainerWithMostWaterStep extends VisualizationStep {
  left?: number;
  right?: number;
  width?: number;
  currentWater?: number;
  maxWater?: number;
  isSolution?: boolean;
  result?: number;
}

export const ContainerWithMostWaterVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 11;
  
  const defaultHeight: number[] = (question?.defaultInput as any)?.height || [1, 8, 6, 2, 5, 4, 8, 3, 7];
  
  const [height, setHeight] = useState<number[]>(defaultHeight);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHeight, setCustomHeight] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.height && Array.isArray(input.height)) {
        setHeight(input.height);
      }
    }
  }, [question]);

  const generateSteps = (height: number[]): ContainerWithMostWaterStep[] => {
    const steps: ContainerWithMostWaterStep[] = [];
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    // Initial state
    steps.push({
      line: 1,
      variables: { left: 0, right: height.length - 1 },
      description: `Initialize left = 0, right = ${height.length - 1}`,
      left: 0,
      right: height.length - 1,
      maxWater: 0,
    });

    steps.push({
      line: 3,
      variables: { maxWater: 0 },
      description: `Initialize maxWater = 0`,
      left: 0,
      right: height.length - 1,
      maxWater: 0,
    });

    while (left < right) {
      const width = right - left;
      const currentWater = Math.min(height[left], height[right]) * width;

      // Calculate width
      steps.push({
        line: 4,
        left,
        right,
        width,
        variables: { left, right, width },
        description: `Calculate width = right - left = ${right} - ${left} = ${width}`,
        maxWater,
      });

      // Calculate current water
      steps.push({
        line: 5,
        left,
        right,
        width,
        currentWater,
        variables: { left, right, width, 'height[left]': height[left], 'height[right]': height[right], currentWater },
        description: `Calculate current water = min(${height[left]}, ${height[right]}) × ${width} = ${currentWater}`,
        maxWater,
      });

      // Update maxWater
      maxWater = Math.max(maxWater, currentWater);
      steps.push({
        line: 7,
        left,
        right,
        width,
        currentWater,
        maxWater,
        variables: { left, right, currentWater, maxWater },
        description: `Update maxWater = max(${maxWater - currentWater}, ${currentWater}) = ${maxWater}`,
      });

      // Move pointer
      if (height[left] < height[right]) {
        steps.push({
          line: 8,
          left,
          right,
          variables: { left, right, 'height[left]': height[left], 'height[right]': height[right] },
          description: `height[${left}] (${height[left]}) < height[${right}] (${height[right]}), move left pointer: left = ${left + 1}`,
          maxWater,
        });
        left++;
      } else {
        steps.push({
          line: 9,
          left,
          right,
          variables: { left, right, 'height[left]': height[left], 'height[right]': height[right] },
          description: `height[${left}] (${height[left]}) >= height[${right}] (${height[right]}), move right pointer: right = ${right - 1}`,
          maxWater,
        });
        right--;
      }
    }

    // Final solution
    steps.push({
      line: 10,
      variables: { maxWater },
      description: `Maximum water container area: ${maxWater}`,
      maxWater,
      isSolution: true,
      result: maxWater,
    });

    return steps;
  };

  const [steps, setSteps] = useState<ContainerWithMostWaterStep[]>(() => generateSteps(height));

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
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (heightArray.length >= 2) {
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
      placeholder: '1, 8, 6, 2, 5, 4, 8, 3, 7',
    },
  ];

  const highlightedLine = useMemo(
    () => getHighlightedLine(currentStepData.line, language, questionId),
    [currentStepData.line, language, questionId]
  );

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

  const maxHeight = Math.max(...height, 1);
  const containerWidth = height.length;
  const barWidth = Math.max(30, Math.min(50, 400 / height.length));
  const scale = 200 / maxHeight;

  const visualizationContent = (
    <>
      {currentStepData.isSolution && 
       currentStepData.result !== undefined && 
       currentStepData.line === 10 && (
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 3,
          p: 3,
          minHeight: '50vh',
        }}
      >
        {/* Container Visualization */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 2,
            }}
          >
            Container Visualization
          </Typography>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              height: '250px',
              borderBottom: `2px solid ${themeColors.borderLight}`,
              borderLeft: `2px solid ${themeColors.borderLight}`,
              borderRight: `2px solid ${themeColors.borderLight}`,
              backgroundColor: themeColors.inputBgDark,
              borderRadius: '4px 4px 0 0',
            }}
          >
            {/* Bars */}
            {height.map((h: number, idx: number) => {
              const isLeft = currentStepData.left === idx;
              const isRight = currentStepData.right === idx;
              const isActive = isLeft || isRight;
              const barHeight = h * scale;
              
              return (
                <Box
                  key={idx}
                  sx={{
                    position: 'absolute',
                    left: `${(idx / (height.length - 1)) * 95 + 2.5}%`,
                    bottom: 0,
                    width: `${barWidth}px`,
                    height: `${barHeight}px`,
                    backgroundColor: isActive
                      ? isLeft
                        ? themeColors.primary
                        : '#10b981'
                      : themeColors.borderLight,
                    border: isActive
                      ? `2px solid ${isLeft ? themeColors.primary : '#10b981'}`
                      : `1px solid ${themeColors.borderLight}`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: themeColors.white,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {h}
                  </Typography>
                  {isLeft && (
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: -20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      left
                    </Typography>
                  )}
                  {isRight && (
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: -20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#10b981',
                      }}
                    >
                      right
                    </Typography>
                  )}
                </Box>
              );
            })}

            {/* Water container visualization */}
            {currentStepData.left !== undefined && 
             currentStepData.right !== undefined && 
             currentStepData.width !== undefined && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${(currentStepData.left / (height.length - 1)) * 95 + 2.5}%`,
                  bottom: 0,
                  width: `${(currentStepData.width / (height.length - 1)) * 95}%`,
                  height: `${Math.min(height[currentStepData.left], height[currentStepData.right]) * scale}px`,
                  backgroundColor: `${themeColors.primary}33`,
                  border: `2px dashed ${themeColors.primary}`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                {currentStepData.currentWater !== undefined && (
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: themeColors.primary,
                      fontWeight: 700,
                    }}
                  >
                    {currentStepData.currentWater}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Array representation below */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {height.map((h: number, idx: number) => {
              const isLeft = currentStepData.left === idx;
              const isRight = currentStepData.right === idx;
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: isLeft || isRight
                        ? `2px solid ${isLeft ? themeColors.primary : '#10b981'}`
                        : `1px solid ${themeColors.borderLight}`,
                      backgroundColor: isLeft || isRight
                        ? `${isLeft ? themeColors.primary : '#10b981'}1a`
                        : 'transparent',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: themeColors.white,
                      }}
                    >
                      {h}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.65rem',
                      color: themeColors.textSecondary,
                    }}
                  >
                    {idx}
                  </Typography>
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
          p: 1.5,
        }}
      >
        <StepDescription
          description={currentStepData.description}
          isSolution={currentStepData.isSolution}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
          }}
        >
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

          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Current State
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {currentStepData.currentWater !== undefined && (
                  <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                    currentWater: {currentStepData.currentWater}
                  </Typography>
                )}
                {currentStepData.maxWater !== undefined && (
                  <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                    maxWater: {currentStepData.maxWater}
                  </Typography>
                )}
                {currentStepData.width !== undefined && (
                  <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                    width: {currentStepData.width}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

  const explanationContent = question?.explanation ? (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 4,
      }}
    >
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
  ) : null;

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
        title="Container With Most Water"
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

export default ContainerWithMostWaterVisualizationPage;

