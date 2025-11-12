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

interface SortColorsStep extends VisualizationStep {
  left?: number;
  mid?: number;
  right?: number;
  nums: number[];
  swapped?: boolean;
  isComplete?: boolean;
}

export const SortColorsVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 75;
  
  // Get default input from question data
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [2, 0, 2, 1, 1, 0];
  
  const [nums, setNums] = useState<number[]>(defaultNums);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Update when question changes
  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.nums && Array.isArray(input.nums)) {
        setNums(input.nums);
      }
    }
  }, [question]);

  // Generate animation steps
  const generateSteps = (nums: number[]): SortColorsStep[] => {
    const steps: SortColorsStep[] = [];
    const numsCopy = [...nums];
    let left = 0;
    let mid = 0;
    let right = numsCopy.length - 1;

    // Initial state
    steps.push({
      line: 1,
      variables: { left: 0, mid: 0, right: numsCopy.length - 1 },
      nums: [...numsCopy],
      left: 0,
      mid: 0,
      right: numsCopy.length - 1,
      description: 'Initialize three pointers: left=0, mid=0, right=n-1',
    });

    while (mid <= right) {
      // Current iteration
      steps.push({
        line: 4,
        left,
        mid,
        right,
        variables: { left, mid, right, 'nums[mid]': numsCopy[mid] },
        nums: [...numsCopy],
        description: `Checking element at mid=${mid}: nums[${mid}] = ${numsCopy[mid]}`,
      });

      if (numsCopy[mid] === 0) {
        // Swap with left
        steps.push({
          line: 5,
          left,
          mid,
          right,
          variables: { left, mid, right, 'nums[mid]': numsCopy[mid], 'nums[left]': numsCopy[left] },
          nums: [...numsCopy],
          swapped: false,
          description: `nums[${mid}] == 0: Swapping with left pointer\nBefore: nums[${left}] = ${numsCopy[left]}, nums[${mid}] = ${numsCopy[mid]}`,
        });

        // Perform swap
        const temp = numsCopy[left];
        numsCopy[left] = numsCopy[mid];
        numsCopy[mid] = temp;

        // After swap
        steps.push({
          line: 6,
          left,
          mid,
          right,
          variables: { left, mid, right },
          nums: [...numsCopy],
          swapped: true,
          description: `After swap: nums[${left}] = ${numsCopy[left]}, nums[${mid}] = ${numsCopy[mid]}`,
        });

        left++;
        mid++;
        steps.push({
          line: 7,
          left,
          mid,
          right,
          variables: { left, mid, right },
          nums: [...numsCopy],
          description: `Increment left and mid: left=${left}, mid=${mid}`,
        });
      } else if (numsCopy[mid] === 1) {
        // Just increment mid
        steps.push({
          line: 8,
          left,
          mid,
          right,
          variables: { left, mid, right, 'nums[mid]': numsCopy[mid] },
          nums: [...numsCopy],
          description: `nums[${mid}] == 1: Leave in place, increment mid`,
        });
        mid++;
        steps.push({
          line: 9,
          left,
          mid,
          right,
          variables: { left, mid, right },
          nums: [...numsCopy],
          description: `mid incremented to ${mid}`,
        });
      } else {
        // nums[mid] == 2, swap with right
        steps.push({
          line: 10,
          left,
          mid,
          right,
          variables: { left, mid, right, 'nums[mid]': numsCopy[mid], 'nums[right]': numsCopy[right] },
          nums: [...numsCopy],
          swapped: false,
          description: `nums[${mid}] == 2: Swapping with right pointer\nBefore: nums[${mid}] = ${numsCopy[mid]}, nums[${right}] = ${numsCopy[right]}`,
        });

        // Perform swap
        const temp = numsCopy[mid];
        numsCopy[mid] = numsCopy[right];
        numsCopy[right] = temp;

        // After swap
        steps.push({
          line: 11,
          left,
          mid,
          right,
          variables: { left, mid, right },
          nums: [...numsCopy],
          swapped: true,
          description: `After swap: nums[${mid}] = ${numsCopy[mid]}, nums[${right}] = ${numsCopy[right]}`,
        });

        right--;
        steps.push({
          line: 11,
          left,
          mid,
          right,
          variables: { left, mid, right },
          nums: [...numsCopy],
          description: `Decrement right: right=${right} (mid stays at ${mid})`,
        });
      }
    }

    // Final state
    steps.push({
      line: 11,
      left,
      mid,
      right,
      variables: { left, mid, right },
      nums: [...numsCopy],
      isComplete: true,
      description: `Algorithm complete! Array sorted: [${numsCopy.join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<SortColorsStep[]>(() => generateSteps(nums));

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
        .filter((n) => !isNaN(n) && (n === 0 || n === 1 || n === 2));
      if (numArray.length > 0) {
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
      label: 'Array (0, 1, or 2 only, comma-separated)',
      value: customNums,
      onChange: setCustomNums,
      placeholder: '2, 0, 2, 1, 1, 0',
    },
  ];

  const highlightedLine = useMemo(
    () => getHighlightedLine(currentStepData.line, language, questionId),
    [currentStepData.line, language, questionId]
  );

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

  // Color mapping
  const getColor = (num: number) => {
    if (num === 0) return '#ef4444'; // Red
    if (num === 1) return '#ffffff'; // White
    return '#3b82f6'; // Blue
  };

  const getColorName = (num: number) => {
    if (num === 0) return 'Red';
    if (num === 1) return 'White';
    return 'Blue';
  };

  // Extract visualization content
  const visualizationContent = (
    <>
      {/* Success Message */}
      {currentStepData.isComplete && (
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
            result={currentStepData.nums}
            timeComplexity="O(n)"
            spaceComplexity="O(1)"
          />
        </Box>
      )}

      {/* Array Visualization */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
          p: 2,
          minHeight: '50vh',
        }}
      >
        {/* Array */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Array{' '}
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
              maxWidth: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              pb: 1,
            }}
          >
            {currentStepData.nums.map((num: number, idx: number) => {
              const isLeft = currentStepData.left === idx;
              const isMid = currentStepData.mid === idx;
              const isRight = currentStepData.right === idx;
              const isSwapped = currentStepData.swapped && (isLeft || isMid || isRight);
              
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
                      width: 50,
                      height: 50,
                      minWidth: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: isSwapped
                        ? '2px solid #10b981'
                        : isLeft || isMid || isRight
                        ? `2px solid ${themeColors.primary}`
                        : `1px solid ${themeColors.borderLight}`,
                      backgroundColor: isSwapped
                        ? '#10b98133'
                        : isLeft || isMid || isRight
                        ? `${themeColors.primary}1a`
                        : getColor(num) + '33',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: getColor(num),
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
                  {isLeft && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#ef4444',
                      }}
                    >
                      left
                    </Typography>
                  )}
                  {isMid && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      mid
                    </Typography>
                  )}
                  {isRight && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#3b82f6',
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

        {/* Variables */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            mt: 2,
          }}
        >
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
              backgroundColor: themeColors.inputBgDark,
              p: 1.5,
              borderRadius: 1,
              minHeight: 60,
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

        {/* Step Description */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            mt: 2,
          }}
        >
          <StepDescription description={currentStepData.description} />
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
                    color: themeColors.white,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  color: themeColors.textSecondary,
                  lineHeight: 1.8,
                }}
              >
                {step}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Complexity */}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper
            sx={{
              backgroundColor: themeColors.inputBgDark,
              p: 2.5,
              borderLeft: `4px solid ${themeColors.primary}`,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: themeColors.textSecondary,
                mb: 1,
                fontWeight: 600,
              }}
            >
              Time Complexity:
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: themeColors.white,
                fontFamily: 'monospace',
              }}
            >
              {question.explanation.timeComplexity}
            </Typography>
          </Paper>
          <Paper
            sx={{
              backgroundColor: themeColors.inputBgDark,
              p: 2.5,
              borderLeft: `4px solid ${themeColors.primary}`,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: themeColors.textSecondary,
                mb: 1,
                fontWeight: 600,
              }}
            >
              Space Complexity:
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem',
                color: themeColors.white,
                fontFamily: 'monospace',
              }}
            >
              {question.explanation.spaceComplexity}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  ) : null;

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
        title={question?.title || 'Sort Colors'}
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

export default SortColorsVisualizationPage;

