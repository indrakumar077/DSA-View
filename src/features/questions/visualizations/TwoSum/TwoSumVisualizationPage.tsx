import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { themeColors } from '../../../../theme';
import { useVisualizationState } from '../../../../core/hooks/useVisualizationState';
import { useQuestionData } from '../../../../core/hooks/useQuestionData';
import { getHighlightedLine } from '../../../../core/utils/codeHighlighting';
import { VisualizationLayout } from '../../../../shared/layouts/VisualizationLayout';
import { CodeViewer } from '../../../../shared/components/CodeViewer';
import { VisualizationControlBar } from '../../../../shared/components/VisualizationControlBar';
import { CustomInputDialog } from '../../../../shared/components/CustomInputDialog';
import { StepDescription, SolutionMessage } from '../../../../shared/components/VisualizationComponents';
import { VisualizationStep, Language } from '../../../../types';
import { DEFAULT_LANGUAGE } from '../../../../constants';

interface TwoSumStep extends VisualizationStep {
  i?: number;
  j?: number;
  complement?: number;
  hashMap: Record<number, number>;
  isSolution?: boolean;
  result?: number[];
}

export const TwoSumVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 1;
  
  // Get default input from question data
  const defaultNums: number[] = (question?.defaultInput as any)?.nums || [2, 7, 11, 15];
  const defaultTarget: number = (question?.defaultInput as any)?.target || 9;
  
  const [nums, setNums] = useState<number[]>(defaultNums);
  const [target, setTarget] = useState<number>(defaultTarget);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState('');
  const [customTarget, setCustomTarget] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Update when question changes
  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.nums && Array.isArray(input.nums)) {
        setNums(input.nums);
      }
      if (input.target !== undefined && typeof input.target === 'number') {
        setTarget(input.target);
      }
    }
  }, [question]);

  // Generate animation steps
  const generateSteps = (nums: number[], target: number): TwoSumStep[] => {
    const steps: TwoSumStep[] = [];
    const map: Record<number, number> = {};

    // Initial state
    steps.push({
      line: 1,
      variables: {},
      hashMap: {},
      description: 'Initialize empty hash map',
    });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];

      // Current iteration
      steps.push({
        line: 2,
        i,
        variables: { i, 'nums[i]': nums[i] },
        hashMap: { ...map },
        description: `Check element at index ${i}: ${nums[i]}`,
      });

      // Calculate complement
      steps.push({
        line: 3,
        i,
        complement,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Calculate complement: ${target} - ${nums[i]} = ${complement}`,
      });

      // Check if complement exists - PAUSE AT IF STATEMENT
      steps.push({
        line: 4,
        i,
        complement,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Checking if complement ${complement} exists in map...`,
      });

      // If complement found
      if (map[complement] !== undefined) {
        steps.push({
          line: 4,
          i,
          j: map[complement],
          variables: { i, 'nums[i]': nums[i], complement },
          hashMap: { ...map },
          description: `Condition: TRUE ✓\nComplement ${complement} found at index ${map[complement]}!\nSolution: nums[${map[complement]}] + nums[${i}] = ${target}`,
          isSolution: true,
          result: [map[complement], i],
        });
        // Return statement
        steps.push({
          line: 6,
          i,
          j: map[complement],
          variables: { i, 'nums[i]': nums[i], complement },
          hashMap: { ...map },
          description: `Returning solution: [${map[complement]}, ${i}]`,
          isSolution: true,
          result: [map[complement], i],
        });
        break;
      }

      // If complement NOT found
      steps.push({
        line: 4,
        i,
        complement,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Condition: FALSE ✗\nComplement ${complement} not found in map.\nCurrent map: {${Object.entries(map).map(([k, v]) => `${k}: ${v}`).join(', ') || 'empty'}}\nContinue to add ${nums[i]} to map...`,
      });

      // Add to map
      steps.push({
        line: 5,
        i,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Add ${nums[i]} to map with index ${i}`,
      });

      map[nums[i]] = i;

      // Updated map state
      steps.push({
        line: 5,
        i,
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Map updated: {${Object.entries(map)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}}`,
      });
    }

    return steps;
  };

  const [steps, setSteps] = useState<TwoSumStep[]>(() => generateSteps(nums, target));

  useEffect(() => {
    setSteps(generateSteps(nums, target));
  }, [nums, target]);

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
  }, [nums, target, reset]);

  const handleCustomInput = () => {
    try {
      const numArray = customNums
        .split(',')
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      const targetNum = parseInt(customTarget);
      if (numArray.length >= 2 && !isNaN(targetNum)) {
        setNums(numArray);
        setTarget(targetNum);
        setShowCustomInput(false);
        setCustomNums('');
        setCustomTarget('');
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
      placeholder: '2, 7, 11, 15',
    },
    {
      label: 'Target',
      value: customTarget,
      onChange: setCustomTarget,
      placeholder: '9',
      type: 'number',
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
        {/* Success Message */}
        {currentStepData.isSolution && currentStepData.result && (
          <SolutionMessage
            result={currentStepData.result}
            timeComplexity="O(n)"
            spaceComplexity="O(n)"
          />
        )}

        {/* Array */}
        <Box sx={{ textAlign: 'center' }}>
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
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                    border:
                      currentStepData.isSolution && (currentStepData.i === idx || currentStepData.j === idx)
                        ? '2px solid #10b981'
                        : currentStepData.i === idx || currentStepData.j === idx
                        ? `2px solid ${themeColors.primary}`
                        : `1px solid ${themeColors.borderLight}`,
                    backgroundColor:
                      currentStepData.isSolution && (currentStepData.i === idx || currentStepData.j === idx)
                        ? '#10b98133'
                        : currentStepData.i === idx || currentStepData.j === idx
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
                {currentStepData.i === idx && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: currentStepData.isSolution ? '#10b981' : themeColors.primary,
                    }}
                  >
                    i
                  </Typography>
                )}
                {currentStepData.j === idx && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: currentStepData.isSolution ? '#10b981' : themeColors.primary,
                    }}
                  >
                    j
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Target */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: themeColors.textSecondary,
            }}
          >
            Target ={' '}
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
              {target}
            </Box>
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

          {/* Hash Map */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Hash Map
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
                {Object.keys(currentStepData.hashMap).length > 0
                  ? `{${Object.entries(currentStepData.hashMap)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')}}`
                  : '{}'}
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
        title="2 Sum"
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

export default TwoSumVisualizationPage;
