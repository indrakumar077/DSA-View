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

interface ThreeSumStep extends VisualizationStep {
  i?: number;
  left?: number;
  right?: number;
  total?: number;
  triplets?: number[][];
  isSolution?: boolean;
  result?: number[][];
}

export const ThreeSumVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 15;
  
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [-1, 0, 1, 2, -1, -4];
  
  const [nums, setNums] = useState<number[]>(defaultNums);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.nums && Array.isArray(input.nums)) {
        setNums(input.nums);
      }
    }
  }, [question]);

  const generateSteps = (nums: number[]): ThreeSumStep[] => {
    const steps: ThreeSumStep[] = [];
    const sortedNums = [...nums].sort((a, b) => a - b);
    const result: number[][] = [];
    const n = sortedNums.length;

    // Initial state - sort array
    steps.push({
      line: 1,
      variables: {},
      description: `Sort array: [${sortedNums.join(', ')}]`,
      triplets: [],
    });

    for (let i = 0; i < n - 2; i++) {
      // Skip duplicates for i
      if (i > 0 && sortedNums[i] === sortedNums[i - 1]) {
        steps.push({
          line: 2,
          i,
          variables: { i, 'nums[i]': sortedNums[i], 'nums[i-1]': sortedNums[i-1] },
          description: `Skip duplicate: nums[${i}] == nums[${i-1}]`,
          triplets: [...result],
        });
        continue;
      }

      // Start two pointers
      steps.push({
        line: 3,
        i,
        variables: { i, 'nums[i]': sortedNums[i] },
        description: `Fix element at index ${i}: ${sortedNums[i]}`,
        triplets: [...result],
      });

      let left = i + 1;
      let right = n - 1;

      steps.push({
        line: 4,
        i,
        left,
        right,
        variables: { i, left, right, 'nums[i]': sortedNums[i], 'nums[left]': sortedNums[left], 'nums[right]': sortedNums[right] },
        description: `Initialize left = ${left}, right = ${right}`,
        triplets: [...result],
      });

      while (left < right) {
        const total = sortedNums[i] + sortedNums[left] + sortedNums[right];

        steps.push({
          line: 5,
          i,
          left,
          right,
          total,
          variables: { i, left, right, total, 'nums[i]': sortedNums[i], 'nums[left]': sortedNums[left], 'nums[right]': sortedNums[right] },
          description: `Calculate sum: ${sortedNums[i]} + ${sortedNums[left]} + ${sortedNums[right]} = ${total}`,
          triplets: [...result],
        });

        if (total === 0) {
          const triplet = [sortedNums[i], sortedNums[left], sortedNums[right]];
          result.push(triplet);

          steps.push({
            line: 6,
            i,
            left,
            right,
            total,
            variables: { i, left, right, total },
            description: `Found triplet: [${triplet.join(', ')}]`,
            triplets: [...result],
          });

          // Skip duplicates for left
          while (left < right && sortedNums[left] === sortedNums[left + 1]) {
            left++;
            steps.push({
              line: 7,
              i,
              left,
              right,
              variables: { i, left, right },
              description: `Skip duplicate left: nums[${left}] == nums[${left+1}]`,
              triplets: [...result],
            });
          }

          // Skip duplicates for right
          while (left < right && sortedNums[right] === sortedNums[right - 1]) {
            right--;
            steps.push({
              line: 8,
              i,
              left,
              right,
              variables: { i, left, right },
              description: `Skip duplicate right: nums[${right}] == nums[${right-1}]`,
              triplets: [...result],
            });
          }

          left++;
          right--;

          steps.push({
            line: 9,
            i,
            left,
            right,
            variables: { i, left, right },
            description: `Move pointers: left = ${left}, right = ${right}`,
            triplets: [...result],
          });
        } else if (total < 0) {
          left++;
          steps.push({
            line: 10,
            i,
            left,
            right,
            total,
            variables: { i, left, right, total },
            description: `Sum < 0, move left pointer: left = ${left}`,
            triplets: [...result],
          });
        } else {
          right--;
          steps.push({
            line: 11,
            i,
            left,
            right,
            total,
            variables: { i, left, right, total },
            description: `Sum > 0, move right pointer: right = ${right}`,
            triplets: [...result],
          });
        }
      }
    }

    // Final solution
    steps.push({
      line: 12,
      variables: {},
      description: `All triplets found: ${result.length > 0 ? JSON.stringify(result) : '[]'}`,
      triplets: [...result],
      isSolution: true,
      result: [...result],
    });

    return steps;
  };

  const [steps, setSteps] = useState<ThreeSumStep[]>(() => generateSteps(nums));

  useEffect(() => {
    setSteps(generateSteps(nums));
  }, [nums]);

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
  }, [nums, reset]);

  const handleCustomInput = () => {
    try {
      const numArray = customNums
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (numArray.length >= 3) {
        setNums(numArray);
        setShowCustomInput(false);
        setCustomNums('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Array (comma-separated)',
      value: customNums,
      onChange: setCustomNums,
      placeholder: '-1, 0, 1, 2, -1, -4',
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

  const sortedNums = [...nums].sort((a, b) => a - b);
  const currentTriplets = currentStepData.triplets || [];

  const visualizationContent = (
    <>
      {currentStepData.isSolution && 
       currentStepData.result && 
       currentStepData.line === 12 && (
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
            timeComplexity="O(n²)"
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
          p: 2,
          minHeight: '50vh',
        }}
      >
        {/* Sorted Array */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Sorted Array{' '}
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
              nums
            </Box>
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 0.75, sm: 1 },
              mt: 1,
              justifyContent: 'center',
            }}
          >
            {sortedNums.map((num: number, idx: number) => {
              const isI = currentStepData.i === idx;
              const isLeft = currentStepData.left === idx;
              const isRight = currentStepData.right === idx;
              const isHighlighted = isI || isLeft || isRight;
              
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
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: isHighlighted
                        ? `2px solid ${isI ? themeColors.primary : isLeft ? '#10b981' : '#f59e0b'}`
                        : `1px solid ${themeColors.borderLight}`,
                      backgroundColor: isHighlighted
                        ? `${isI ? themeColors.primary : isLeft ? '#10b981' : '#f59e0b'}1a`
                        : 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: themeColors.white,
                      }}
                    >
                      {num}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: '0.65rem',
                      color: themeColors.textSecondary,
                    }}
                  >
                    {idx}
                  </Typography>
                  {isI && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      i
                    </Typography>
                  )}
                  {isLeft && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#10b981',
                      }}
                    >
                      left
                    </Typography>
                  )}
                  {isRight && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#f59e0b',
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

        {/* Found Triplets */}
        {currentTriplets.length > 0 && (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: themeColors.textSecondary,
                mb: 0.5,
              }}
            >
              Found Triplets
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
                justifyContent: 'center',
              }}
            >
              {currentTriplets.map((triplet: number[], idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                    backgroundColor: `${themeColors.primary}1a`,
                    padding: '4px 12px',
                    borderRadius: 1,
                    border: `1px solid ${themeColors.primary}33`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: themeColors.white,
                      fontFamily: 'monospace',
                    }}
                  >
                    [{triplet.join(', ')}]
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
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
              Current Sum
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
              {currentStepData.total !== undefined ? (
                <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                  total: {currentStepData.total}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    color: themeColors.textSecondary,
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  Not calculated yet
                </Typography>
              )}
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
        title="3Sum"
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

export default ThreeSumVisualizationPage;

