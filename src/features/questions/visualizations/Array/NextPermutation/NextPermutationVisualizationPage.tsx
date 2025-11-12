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

interface NextPermutationStep extends VisualizationStep {
  nums: number[];
  i?: number;
  j?: number;
  left?: number;
  right?: number;
  phase?: 'findPivot' | 'swap' | 'reverse';
  swapped?: boolean;
  isComplete?: boolean;
}

export const NextPermutationVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 31;
  
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [1, 2, 3];
  
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

  const generateSteps = (nums: number[]): NextPermutationStep[] => {
    const steps: NextPermutationStep[] = [];
    const numsCopy = [...nums];
    const n = numsCopy.length;
    let i = n - 2;

    steps.push({
      line: 1,
      variables: { n, i: n - 2 },
      nums: [...numsCopy],
      phase: 'findPivot',
      description: `Initialize: n = ${n}, start from i = ${n - 2}`,
    });

    // Find pivot
    steps.push({
      line: 3,
      variables: { i },
      nums: [...numsCopy],
      phase: 'findPivot',
      i,
      description: `Find pivot: Looking for largest i where nums[i] < nums[i+1], starting from i = ${i}`,
    });

    while (i >= 0 && numsCopy[i] >= numsCopy[i + 1]) {
      steps.push({
        line: 3,
        variables: { i, 'nums[i]': numsCopy[i], 'nums[i+1]': numsCopy[i + 1] },
        nums: [...numsCopy],
        phase: 'findPivot',
        i,
        description: `nums[${i}] (${numsCopy[i]}) >= nums[${i + 1}] (${numsCopy[i + 1]}), continue...`,
      });
      i--;
    }

    if (i >= 0) {
      steps.push({
        line: 4,
        variables: { i, 'nums[i]': numsCopy[i], 'nums[i+1]': numsCopy[i + 1] },
        nums: [...numsCopy],
        phase: 'findPivot',
        i,
        description: `Pivot found at i = ${i}: nums[${i}] (${numsCopy[i]}) < nums[${i + 1}] (${numsCopy[i + 1]})`,
      });

      // Find j
      let j = n - 1;
      steps.push({
        line: 5,
        variables: { i, j },
        nums: [...numsCopy],
        phase: 'swap',
        i,
        j,
        description: `Find j: Looking for largest j where nums[j] > nums[i] (${numsCopy[i]}), starting from j = ${j}`,
      });

      while (numsCopy[j] <= numsCopy[i]) {
        steps.push({
          line: 6,
          variables: { i, j, 'nums[j]': numsCopy[j], 'nums[i]': numsCopy[i] },
          nums: [...numsCopy],
          phase: 'swap',
          i,
          j,
          description: `nums[${j}] (${numsCopy[j]}) <= nums[${i}] (${numsCopy[i]}), continue...`,
        });
        j--;
      }

      steps.push({
        line: 7,
        variables: { i, j, 'nums[i]': numsCopy[i], 'nums[j]': numsCopy[j] },
        nums: [...numsCopy],
        phase: 'swap',
        i,
        j,
        swapped: false,
        description: `Swap target found: j = ${j}, nums[${j}] (${numsCopy[j]}) > nums[${i}] (${numsCopy[i]})\nSwapping nums[${i}] and nums[${j}]`,
      });

      // Swap
      const temp = numsCopy[i];
      numsCopy[i] = numsCopy[j];
      numsCopy[j] = temp;

      steps.push({
        line: 7,
        variables: { i, j },
        nums: [...numsCopy],
        phase: 'swap',
        i,
        j,
        swapped: true,
        description: `Swapped: nums[${i}] = ${numsCopy[i]}, nums[${j}] = ${numsCopy[j]}\nArray: [${numsCopy.join(', ')}]`,
      });
    } else {
      steps.push({
        line: 4,
        variables: { i: -1 },
        nums: [...numsCopy],
        phase: 'findPivot',
        description: `No pivot found (i = -1): Array is in descending order. Will reverse entire array.`,
      });
    }

    // Reverse suffix
    steps.push({
      line: 10,
      variables: { i },
      nums: [...numsCopy],
      phase: 'reverse',
      description: `Reverse suffix starting from index ${i + 1}`,
    });

    let left = i + 1;
    let right = n - 1;

    steps.push({
      line: 11,
      variables: { left, right },
      nums: [...numsCopy],
      phase: 'reverse',
      left,
      right,
      description: `Initialize pointers: left = ${left}, right = ${right}`,
    });

    while (left < right) {
      steps.push({
        line: 12,
        variables: { left, right, 'nums[left]': numsCopy[left], 'nums[right]': numsCopy[right] },
        nums: [...numsCopy],
        phase: 'reverse',
        left,
        right,
        swapped: false,
        description: `Reverse: Swap nums[${left}] (${numsCopy[left]}) with nums[${right}] (${numsCopy[right]})`,
      });

      const temp = numsCopy[left];
      numsCopy[left] = numsCopy[right];
      numsCopy[right] = temp;

      steps.push({
        line: 12,
        variables: { left, right },
        nums: [...numsCopy],
        phase: 'reverse',
        left,
        right,
        swapped: true,
        description: `Swapped: nums[${left}] = ${numsCopy[left]}, nums[${right}] = ${numsCopy[right]}\nArray: [${numsCopy.join(', ')}]`,
      });

      left++;
      right--;
    }

    steps.push({
      line: 12,
      variables: {},
      nums: [...numsCopy],
      isComplete: true,
      description: `Next permutation complete! Result: [${numsCopy.join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<NextPermutationStep[]>(() => generateSteps(nums));

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
      placeholder: '1, 2, 3',
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

  const visualizationContent = (
    <>
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
          <SolutionMessage result={currentStepData.nums} timeComplexity="O(n)" spaceComplexity="O(1)" />
        </Box>
      )}

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
              const isI = currentStepData.i === idx;
              const isJ = currentStepData.j === idx;
              const isLeft = currentStepData.left === idx;
              const isRight = currentStepData.right === idx;
              const isSwapped = currentStepData.swapped && (isI || isJ || isLeft || isRight);
              const isPivot = currentStepData.phase === 'findPivot' && isI;
              const isSuffix = currentStepData.phase === 'reverse' && idx > (currentStepData.i ?? -1);

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
                        : isI || isJ || isLeft || isRight || isPivot
                        ? `2px solid ${themeColors.primary}`
                        : isSuffix
                        ? `1px solid ${themeColors.primary}33`
                        : `1px solid ${themeColors.borderLight}`,
                      backgroundColor: isSwapped
                        ? '#10b98133'
                        : isI || isJ || isLeft || isRight || isPivot
                        ? `${themeColors.primary}1a`
                        : isSuffix
                        ? `${themeColors.primary}0a`
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1rem',
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
                    <Typography sx={{ mt: 0.5, fontSize: '0.65rem', fontWeight: 700, color: themeColors.primary }}>
                      i
                    </Typography>
                  )}
                  {isJ && (
                    <Typography sx={{ mt: 0.5, fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b' }}>
                      j
                    </Typography>
                  )}
                  {isLeft && (
                    <Typography sx={{ mt: 0.5, fontSize: '0.65rem', fontWeight: 700, color: '#10b981' }}>
                      left
                    </Typography>
                  )}
                  {isRight && (
                    <Typography sx={{ mt: 0.5, fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                      right
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '600px', mt: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: themeColors.textSecondary, mb: 0.75 }}>
            Variables
          </Typography>
          <Box sx={{ backgroundColor: themeColors.inputBgDark, p: 1.5, borderRadius: 1, minHeight: 60 }}>
            {Object.keys(currentStepData.variables).length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
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
                    <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.7rem' }}>{key}:</Typography>
                    <Typography sx={{ color: themeColors.white, fontWeight: 600, fontSize: '0.7rem' }}>
                      {String(value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.75rem', fontStyle: 'italic' }}>
                No variables yet
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '600px', mt: 2 }}>
          <StepDescription description={currentStepData.description} />
        </Box>
      </Box>
    </>
  );

  const explanationContent = question?.explanation ? (
    <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: themeColors.white, mb: 2 }}>
          Approach
        </Typography>
        <Paper sx={{ backgroundColor: themeColors.inputBgDark, p: 3, borderLeft: `4px solid ${themeColors.primary}` }}>
          <Typography sx={{ fontSize: '0.9375rem', color: themeColors.textSecondary, lineHeight: 1.8 }}>
            {question.explanation.approach}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: themeColors.white, mb: 2 }}>
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
                <Typography sx={{ color: themeColors.white, fontWeight: 700, fontSize: '0.875rem' }}>
                  {index + 1}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.9375rem', color: themeColors.textSecondary, lineHeight: 1.8 }}>
                {step}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: themeColors.white, mb: 2 }}>
          Complexity Analysis
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ backgroundColor: themeColors.inputBgDark, p: 2.5, borderLeft: `4px solid ${themeColors.primary}` }}>
            <Typography sx={{ fontSize: '0.9375rem', color: themeColors.textSecondary, mb: 1, fontWeight: 600 }}>
              Time Complexity:
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', color: themeColors.white, fontFamily: 'monospace' }}>
              {question.explanation.timeComplexity}
            </Typography>
          </Paper>
          <Paper sx={{ backgroundColor: themeColors.inputBgDark, p: 2.5, borderLeft: `4px solid ${themeColors.primary}` }}>
            <Typography sx={{ fontSize: '0.9375rem', color: themeColors.textSecondary, mb: 1, fontWeight: 600 }}>
              Space Complexity:
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', color: themeColors.white, fontFamily: 'monospace' }}>
              {question.explanation.spaceComplexity}
            </Typography>
          </Paper>
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
        title={question?.title || 'Next Permutation'}
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

export default NextPermutationVisualizationPage;

