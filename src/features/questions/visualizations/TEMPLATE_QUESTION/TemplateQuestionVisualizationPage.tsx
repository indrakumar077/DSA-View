/**
 * TEMPLATE FOR NEW QUESTION VISUALIZATION
 * 
 * Two Sum jaisa exact structure - fonts, buttons, layout sab same
 * 
 * Steps to use:
 * 1. Copy this file to YourQuestion/YourQuestionVisualizationPage.tsx
 * 2. Replace "TemplateQuestion" with your question name
 * 3. Update generateSteps() function with your algorithm
 * 4. Update visualizationContent with your UI
 * 5. Update defaultInput structure in questions.ts
 */

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

// Step interface - apne question ke according update karo
interface TemplateQuestionStep extends VisualizationStep {
  // Add your custom step properties here
  // Example: i?: number; j?: number; etc.
  hashMap?: Record<number, number>;
  isSolution?: boolean;
  result?: any;
}

export const TemplateQuestionVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 1;
  
  // Get default input from question data - apne question ke according update karo
  const defaultInput = (question?.defaultInput as any) || {};
  const defaultValue = defaultInput.yourField || []; // Update this
  
  const [inputValue, setInputValue] = useState<any>(defaultValue);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Update when question changes
  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      // Update based on your input structure
      if (input.yourField) {
        setInputValue(input.yourField);
      }
    }
  }, [question]);

  // Generate animation steps - Yaha apna algorithm logic likho
  const generateSteps = (input: any): TemplateQuestionStep[] => {
    const steps: TemplateQuestionStep[] = [];

    // Initial state
    steps.push({
      line: 1,
      variables: {},
      description: 'Initialize...',
    });

    // Add your algorithm steps here
    // Example:
    // for (let i = 0; i < input.length; i++) {
    //   steps.push({
    //     line: 2,
    //     variables: { i, value: input[i] },
    //     description: `Processing element ${i}: ${input[i]}`,
    //   });
    // }

    return steps;
  };

  const [steps, setSteps] = useState<TemplateQuestionStep[]>(() => generateSteps(inputValue));

  useEffect(() => {
    setSteps(generateSteps(inputValue));
  }, [inputValue]);

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
  }, [inputValue, reset]);

  const handleCustomInput = () => {
    try {
      // Parse your custom input here
      // Example: const parsed = JSON.parse(customInput);
      // setInputValue(parsed);
      setShowCustomInput(false);
      setCustomInput('');
    } catch (e) {
      console.error('Invalid input');
    }
  };

  // Custom input fields - apne question ke according update karo
  const customInputFields = [
    {
      label: 'Input Field',
      value: customInput,
      onChange: setCustomInput,
      placeholder: 'Enter input...',
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

  // Visualization Content - Yaha apna visualization UI likho
  // Two Sum jaisa exact structure follow karo
  const visualizationContent = (
    <>
      {/* Your Visualization UI */}
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

        {/* Your visualization elements here */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.75rem', // Same as Two Sum
              color: themeColors.textSecondary,
              mb: 0.5,
            }}
          >
            Your Visualization Title
          </Typography>
        </Box>
      </Box>

      {/* Data Structures Section - Same as Two Sum */}
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
                fontSize: '0.75rem', // Same as Two Sum
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
                fontSize: '0.75rem', // Same as Two Sum
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

          {/* Additional Data Structure (if needed) */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.75rem', // Same as Two Sum
                fontWeight: 500,
                color: themeColors.textSecondary,
                mb: 0.75,
              }}
            >
              Data Structure
            </Typography>
            <Box
              sx={{
                backgroundColor: themeColors.backgroundDark,
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.75rem', // Same as Two Sum
                minHeight: 50,
                maxHeight: 150,
                overflow: 'auto',
              }}
            >
              <Typography sx={{ color: themeColors.white, fontSize: '0.7rem' }}>
                {/* Your data structure display */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );

  // Explanation Content - Same structure as Two Sum
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
            fontSize: '1.125rem', // Same as Two Sum
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
              fontSize: '0.9375rem', // Same as Two Sum
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
            fontSize: '1.125rem', // Same as Two Sum
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
                    fontSize: '0.875rem', // Same as Two Sum
                    fontWeight: 700,
                    color: themeColors.textPrimary,
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.9375rem', // Same as Two Sum
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
            fontSize: '1.125rem', // Same as Two Sum
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
                fontSize: '0.875rem', // Same as Two Sum
                color: themeColors.textSecondary,
                mb: 1,
              }}
            >
              Time Complexity
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem', // Same as Two Sum
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
                fontSize: '0.875rem', // Same as Two Sum
                color: themeColors.textSecondary,
                mb: 1,
              }}
            >
              Space Complexity
            </Typography>
            <Typography
              sx={{
                fontSize: '0.9375rem', // Same as Two Sum
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
          fontSize: '1rem', // Same as Two Sum
          color: themeColors.textSecondary,
        }}
      >
        Explanation not available for this problem.
      </Typography>
    </Box>
  );

  // Code Content - Same structure as Two Sum
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
        title={question?.title || 'Template Question'}
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

export default TemplateQuestionVisualizationPage;

