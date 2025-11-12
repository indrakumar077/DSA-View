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

interface MoveZeroesStep extends VisualizationStep {
  read?: number;
  write?: number;
  nums: number[];
  swapped?: boolean;
  isComplete?: boolean;
}

export const MoveZeroesVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 283;
  
  // Get default input from question data
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [0, 1, 0, 3, 12];
  
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
  const generateSteps = (nums: number[]): MoveZeroesStep[] => {
    const steps: MoveZeroesStep[] = [];
    const numsCopy = [...nums];
    let write = 0;

    // Initial state
    steps.push({
      line: 1,
      variables: { write: 0 },
      nums: [...numsCopy],
      description: 'Initialize write pointer at index 0',
    });

    for (let read = 0; read < numsCopy.length; read++) {
      // Current iteration - check condition
      steps.push({
        line: 2,
        read,
        write,
        variables: { read, write },
        nums: [...numsCopy],
        description: `Read pointer at index ${read}: nums[${read}] = ${numsCopy[read]}`,
      });

      // Check if non-zero
      steps.push({
        line: 3,
        read,
        write,
        variables: { read, write, 'nums[read]': numsCopy[read] },
        nums: [...numsCopy],
        description: `Check: nums[${read}] != 0? ${numsCopy[read] !== 0 ? 'TRUE ✓' : 'FALSE ✗'}`,
      });

      if (numsCopy[read] !== 0) {
        // Swap elements
        steps.push({
          line: 4,
          read,
          write,
          variables: { read, write, 'nums[read]': numsCopy[read], 'nums[write]': numsCopy[write] },
          nums: [...numsCopy],
          swapped: false,
          description: `Swapping nums[${write}] and nums[${read}]:\nBefore: nums[${write}] = ${numsCopy[write]}, nums[${read}] = ${numsCopy[read]}`,
        });

        // Perform swap
        const temp = numsCopy[write];
        numsCopy[write] = numsCopy[read];
        numsCopy[read] = temp;

        // After swap
        steps.push({
          line: 4,
          read,
          write,
          variables: { read, write, 'nums[read]': numsCopy[read], 'nums[write]': numsCopy[write] },
          nums: [...numsCopy],
          swapped: true,
          description: `After swap: nums[${write}] = ${numsCopy[write]}, nums[${read}] = ${numsCopy[read]}`,
        });

        // Increment write
        write++;
        steps.push({
          line: 5,
          read,
          write,
          variables: { read, write },
          nums: [...numsCopy],
          description: `Increment write pointer: write = ${write}`,
        });
      } else {
        steps.push({
          line: 3,
          read,
          write,
          variables: { read, write, 'nums[read]': numsCopy[read] },
          nums: [...numsCopy],
          description: `Skipping zero at index ${read}. Write pointer stays at ${write}.`,
        });
      }
    }

    // Final state
    steps.push({
      line: 5,
      read: numsCopy.length,
      write,
      variables: { read: numsCopy.length, write },
      nums: [...numsCopy],
      isComplete: true,
      description: `Algorithm complete! All zeros moved to the end.\nFinal array: [${numsCopy.join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<MoveZeroesStep[]>(() => generateSteps(nums));

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
      label: 'Array (comma-separated)',
      value: customNums,
      onChange: setCustomNums,
      placeholder: '0, 1, 0, 3, 12',
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

  // Extract visualization content
  const visualizationContent = (
    <>
      {/* Success Message - Fixed at top - Only show at completion */}
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
            {currentStepData.nums.map((num: number, idx: number) => {
              const arrayLength = currentStepData.nums.length;
              const isLargeArray = arrayLength > 15;
              const boxSize = isLargeArray ? 35 : 50;
              const fontSize = isLargeArray ? '0.8125rem' : '1rem';
              const indexFontSize = isLargeArray ? '0.6rem' : '0.65rem';
              
              const isRead = currentStepData.read === idx;
              const isWrite = currentStepData.write === idx;
              const isSwapped = currentStepData.swapped && (isRead || isWrite);
              const isZero = num === 0;
              
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
                      width: boxSize,
                      height: boxSize,
                      minWidth: boxSize,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      border: isSwapped
                        ? '2px solid #10b981'
                        : isRead || isWrite
                        ? `2px solid ${themeColors.primary}`
                        : `1px solid ${themeColors.borderLight}`,
                      backgroundColor: isSwapped
                        ? '#10b98133'
                        : isZero && !isRead
                        ? `${themeColors.textSecondary}1a`
                        : isRead || isWrite
                        ? `${themeColors.primary}1a`
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        fontWeight: 700,
                        color: isZero && !isRead ? themeColors.textSecondary : themeColors.white,
                        wordBreak: 'break-word',
                        textAlign: 'center',
                        px: 0.25,
                      }}
                    >
                      {num}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: indexFontSize,
                      color: themeColors.textSecondary,
                    }}
                  >
                    {idx}
                  </Typography>
                  {isRead && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: themeColors.primary,
                      }}
                    >
                      read
                    </Typography>
                  )}
                  {isWrite !== undefined && isWrite === idx && (
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: '#10b981',
                      }}
                    >
                      write
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
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: themeColors.textSecondary,
                mt: 1,
                fontStyle: 'italic',
              }}
            >
              We iterate through the array once with the read pointer.
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
            <Typography
              sx={{
                fontSize: '0.8125rem',
                color: themeColors.textSecondary,
                mt: 1,
                fontStyle: 'italic',
              }}
            >
              We only use a constant amount of extra space for the write pointer.
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
        title={question?.title || 'Move Zeroes'}
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

export default MoveZeroesVisualizationPage;

