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

interface MergeIntervalsStep extends VisualizationStep {
  intervals: number[][];
  merged: number[][];
  currentIndex?: number;
  isComplete?: boolean;
}

export const MergeIntervalsVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 56;
  
  const defaultIntervals: number[][] = (question?.defaultInput as any)?.intervals || [[1, 3], [2, 6], [8, 10], [15, 18]];
  
  const [intervals, setIntervals] = useState<number[][]>(defaultIntervals);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customIntervals, setCustomIntervals] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.intervals && Array.isArray(input.intervals)) {
        setIntervals(input.intervals);
      }
    }
  }, [question]);

  const generateSteps = (intervals: number[][]): MergeIntervalsStep[] => {
    const steps: MergeIntervalsStep[] = [];
    
    if (intervals.length === 0) {
      steps.push({
        line: 1,
        variables: {},
        intervals: [],
        merged: [],
        description: 'Empty intervals array, return empty result',
      });
      return steps;
    }

    // Sort intervals
    const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);
    steps.push({
      line: 2,
      variables: {},
      intervals: sortedIntervals.map(i => [...i]),
      merged: [],
      description: `Sort intervals by start time: [${sortedIntervals.map(i => `[${i[0]},${i[1]}]`).join(', ')}]`,
    });

    const merged: number[][] = [[...sortedIntervals[0]]];
    steps.push({
      line: 3,
      variables: {},
      intervals: sortedIntervals.map(i => [...i]),
      merged: merged.map(m => [...m]),
      currentIndex: 0,
      description: `Initialize merged with first interval: [${merged[0][0]}, ${merged[0][1]}]`,
    });

    for (let i = 1; i < sortedIntervals.length; i++) {
      const current = sortedIntervals[i];
      const last = merged[merged.length - 1];

      steps.push({
        line: 4,
        variables: { i, 'current': `[${current[0]}, ${current[1]}]`, 'last': `[${last[0]}, ${last[1]}]` },
        intervals: sortedIntervals.map(interval => [...interval]),
        merged: merged.map(m => [...m]),
        currentIndex: i,
        description: `Processing interval ${i}: [${current[0]}, ${current[1]}]`,
      });

      // Check overlap
      steps.push({
        line: 6,
        variables: { i, 'current[0]': current[0], 'last[1]': last[1], overlap: current[0] <= last[1] },
        intervals: sortedIntervals.map(interval => [...interval]),
        merged: merged.map(m => [...m]),
        currentIndex: i,
        description: `Check overlap: current[0] (${current[0]}) <= last[1] (${last[1]})? ${current[0] <= last[1] ? 'YES - Overlap!' : 'NO - No overlap'}`,
      });

      if (current[0] <= last[1]) {
        // Merge
        const oldEnd = last[1];
        last[1] = Math.max(last[1], current[1]);
        steps.push({
          line: 7,
          variables: { i, 'oldEnd': oldEnd, 'newEnd': last[1] },
          intervals: sortedIntervals.map(interval => [...interval]),
          merged: merged.map(m => [...m]),
          currentIndex: i,
          description: `Merge intervals: Update last[1] = max(${oldEnd}, ${current[1]}) = ${last[1]}\nMerged: [${last[0]}, ${last[1]}]`,
        });
      } else {
        // Add new interval
        merged.push([...current]);
        steps.push({
          line: 8,
          variables: { i },
          intervals: sortedIntervals.map(interval => [...interval]),
          merged: merged.map(m => [...m]),
          currentIndex: i,
          description: `No overlap, add new interval: [${current[0]}, ${current[1]}]`,
        });
      }
    }

    steps.push({
      line: 10,
      variables: {},
      intervals: sortedIntervals.map(interval => [...interval]),
      merged: merged.map(m => [...m]),
      isComplete: true,
      description: `Algorithm complete! Merged intervals: [${merged.map(m => `[${m[0]},${m[1]}]`).join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<MergeIntervalsStep[]>(() => generateSteps(intervals));

  useEffect(() => {
    setSteps(generateSteps(intervals));
  }, [intervals]);

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
  }, [intervals, reset]);

  const handleCustomInput = () => {
    try {
      const parsed = JSON.parse(customIntervals);
      if (Array.isArray(parsed) && parsed.every(i => Array.isArray(i) && i.length === 2)) {
        setIntervals(parsed);
        setShowCustomInput(false);
        setCustomIntervals('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Intervals (JSON format: [[1,3],[2,6],...])',
      value: customIntervals,
      onChange: setCustomIntervals,
      placeholder: '[[1,3],[2,6],[8,10],[15,18]]',
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
          <SolutionMessage
            result={currentStepData.merged}
            timeComplexity="O(n log n)"
            spaceComplexity="O(n)"
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
        {/* Intervals Visualization */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: themeColors.textSecondary,
              mb: 2,
            }}
          >
            Intervals (Sorted)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {currentStepData.intervals.map((interval, idx) => {
              const isCurrent = currentStepData.currentIndex === idx;
              const [start, end] = interval;
              const width = end - start;
              const maxEnd = Math.max(...currentStepData.intervals.map(i => i[1]));
              const scale = 100 / maxEnd;

              return (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ minWidth: 30, fontSize: '0.75rem', color: themeColors.textSecondary }}>
                    {idx}:
                  </Typography>
                  <Box sx={{ flex: 1, position: 'relative', height: 40 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${start * scale}%`,
                        width: `${width * scale}%`,
                        height: 30,
                        backgroundColor: isCurrent ? themeColors.primary : themeColors.inputBgDark,
                        border: `2px solid ${isCurrent ? themeColors.primary : themeColors.borderLight}`,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: themeColors.white,
                        }}
                      >
                        [{start}, {end}]
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Merged Intervals */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: themeColors.textSecondary,
              mb: 2,
            }}
          >
            Merged Intervals
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {currentStepData.merged.length > 0 ? (
              currentStepData.merged.map((interval, idx) => {
                const [start, end] = interval;
                const width = end - start;
                const maxEnd = Math.max(...currentStepData.intervals.map(i => i[1]));
                const scale = 100 / maxEnd;

                return (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 30, fontSize: '0.75rem', color: themeColors.textSecondary }}>
                      {idx}:
                    </Typography>
                    <Box sx={{ flex: 1, position: 'relative', height: 40 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: `${start * scale}%`,
                          width: `${width * scale}%`,
                          height: 30,
                          backgroundColor: '#10b98133',
                          border: '2px solid #10b981',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#10b981',
                          }}
                        >
                          [{start}, {end}]
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem', fontStyle: 'italic' }}>
                No merged intervals yet
              </Typography>
            )}
          </Box>
        </Box>

        {/* Variables */}
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
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

        <Box sx={{ width: '100%', maxWidth: '600px' }}>
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
        title={question?.title || 'Merge Intervals'}
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

export default MergeIntervalsVisualizationPage;

