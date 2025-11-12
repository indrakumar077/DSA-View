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

interface ProductExceptSelfStep extends VisualizationStep {
  i?: number;
  result?: number[];
  leftProducts?: number[];
  right?: number;
  phase?: 'left' | 'right';
  isSolution?: boolean;
}

export const ProductOfArrayExceptSelfVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 238;
  
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [1, 2, 3, 4];
  
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

  const generateSteps = (nums: number[]): ProductExceptSelfStep[] => {
    const steps: ProductExceptSelfStep[] = [];
    const n = nums.length;
    const result = new Array(n).fill(1);
    let right = 1;

    // Initial state
    steps.push({
      line: 1,
      variables: { n },
      description: `Initialize result array of size ${n} with 1s`,
      result: [...result],
      phase: 'left',
    });

    // Left pass
    for (let i = 1; i < n; i++) {
      steps.push({
        line: 2,
        i,
        variables: { i, 'result[i-1]': result[i-1], 'nums[i-1]': nums[i-1] },
        description: `Calculate left product for index ${i}`,
        result: [...result],
        leftProducts: [...result],
        phase: 'left',
      });

      result[i] = result[i-1] * nums[i-1];

      steps.push({
        line: 3,
        i,
        variables: { i, 'result[i]': result[i] },
        description: `result[${i}] = result[${i-1}] * nums[${i-1}] = ${result[i]}`,
        result: [...result],
        leftProducts: [...result],
        phase: 'left',
      });
    }

    // Right pass
    steps.push({
      line: 4,
      variables: { right: 1 },
      description: 'Start right pass: Initialize right = 1',
      result: [...result],
      right: 1,
      phase: 'right',
    });

    for (let i = n - 1; i >= 0; i--) {
      steps.push({
        line: 5,
        i,
        variables: { i, right, 'result[i]': result[i] },
        description: `Multiply result[${i}] by right product`,
        result: [...result],
        right,
        phase: 'right',
      });

      result[i] *= right;
      right *= nums[i];

      steps.push({
        line: 6,
        i,
        variables: { i, right, 'result[i]': result[i] },
        description: `result[${i}] = ${result[i]}, right = ${right}`,
        result: [...result],
        right,
        phase: 'right',
      });
    }

    // Final solution
    steps.push({
      line: 7,
      variables: {},
      description: `Final result: [${result.join(', ')}]`,
      result: [...result],
      isSolution: true,
      phase: 'right',
    });

    return steps;
  };

  const [steps, setSteps] = useState<ProductExceptSelfStep[]>(() => generateSteps(nums));

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
      if (numArray.length >= 2) {
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
      placeholder: '1, 2, 3, 4',
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

  const currentResult = currentStepData.result || new Array(nums.length).fill(1);

  const visualizationContent = (
    <>
      {currentStepData.isSolution && 
       currentStepData.result && 
       currentStepData.line === 7 && (
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
          p: 2,
          minHeight: '50vh',
        }}
      >
        {/* Original Array */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Original Array{' '}
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
            {nums.map((num: number, idx: number) => (
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
                    border: `1px solid ${themeColors.borderLight}`,
                    backgroundColor: 'transparent',
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
              </Box>
            ))}
          </Box>
        </Box>

        {/* Result Array */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Result Array{' '}
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
              result
            </Box>
            {currentStepData.phase && (
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  fontSize: '0.65rem',
                  color: themeColors.primary,
                  fontWeight: 600,
                }}
              >
                ({currentStepData.phase === 'left' ? 'Left Pass' : 'Right Pass'})
              </Typography>
            )}
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
            {currentResult.map((val: number, idx: number) => (
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
                    border:
                      currentStepData.i === idx
                        ? `2px solid ${themeColors.primary}`
                        : `1px solid ${themeColors.borderLight}`,
                    backgroundColor:
                      currentStepData.i === idx
                        ? `${themeColors.primary}1a`
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
                    {val}
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
                {currentStepData.i === idx && (
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
              </Box>
            ))}
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
                {currentStepData.right !== undefined && (
                  <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                    right: {currentStepData.right}
                  </Typography>
                )}
                {currentStepData.phase && (
                  <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                    Phase: {currentStepData.phase}
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
        title="Product of Array Except Self"
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

export default ProductOfArrayExceptSelfVisualizationPage;

