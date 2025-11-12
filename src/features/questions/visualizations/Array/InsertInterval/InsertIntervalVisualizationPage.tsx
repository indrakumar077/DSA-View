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

interface InsertIntervalStep extends VisualizationStep {
  intervals: number[][];
  newInterval: number[];
  result: number[][];
  currentIndex?: number;
  phase?: 'before' | 'merge' | 'after';
  isComplete?: boolean;
}

export const InsertIntervalVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 57;
  
  const defaultIntervals: number[][] = (question?.defaultInput as any)?.intervals || [[1, 3], [6, 9]];
  const defaultNewInterval: number[] = (question?.defaultInput as any)?.newInterval || [2, 5];
  
  const [intervals, setIntervals] = useState<number[][]>(defaultIntervals);
  const [newInterval, setNewInterval] = useState<number[]>(defaultNewInterval);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customIntervals, setCustomIntervals] = useState('');
  const [customNewInterval, setCustomNewInterval] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.intervals && Array.isArray(input.intervals)) {
        setIntervals(input.intervals);
      }
      if (input.newInterval && Array.isArray(input.newInterval)) {
        setNewInterval(input.newInterval);
      }
    }
  }, [question]);

  const generateSteps = (intervals: number[][], newInterval: number[]): InsertIntervalStep[] => {
    const steps: InsertIntervalStep[] = [];
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;
    const workingInterval = [...newInterval];

    // Initial state
    steps.push({
      line: 1,
      variables: { i: 0, n },
      intervals: intervals.map(i => [...i]),
      newInterval: [...workingInterval],
      result: [],
      phase: 'before',
      description: `Initialize: Insert interval [${workingInterval[0]}, ${workingInterval[1]}] into ${n} intervals`,
    });

    // Phase 1: Add intervals before newInterval
    while (i < n && intervals[i][1] < workingInterval[0]) {
      steps.push({
        line: 2,
        variables: { i, 'intervals[i][1]': intervals[i][1], 'newInterval[0]': workingInterval[0] },
        intervals: intervals.map(interval => [...interval]),
        newInterval: [...workingInterval],
        result: result.map(r => [...r]),
        currentIndex: i,
        phase: 'before',
        description: `Phase 1: intervals[${i}][1] (${intervals[i][1]}) < newInterval[0] (${workingInterval[0]})? YES\nAdd interval [${intervals[i][0]}, ${intervals[i][1]}] to result`,
      });
      result.push([...intervals[i]]);
      i++;
    }

    // Phase 2: Merge overlapping intervals
    while (i < n && intervals[i][0] <= workingInterval[1]) {
      steps.push({
        line: 4,
        variables: { i, 'intervals[i][0]': intervals[i][0], 'newInterval[1]': workingInterval[1] },
        intervals: intervals.map(interval => [...interval]),
        newInterval: [...workingInterval],
        result: result.map(r => [...r]),
        currentIndex: i,
        phase: 'merge',
        description: `Phase 2: intervals[${i}][0] (${intervals[i][0]}) <= newInterval[1] (${workingInterval[1]})? YES - Overlap!\nMerge: newInterval = [min(${workingInterval[0]}, ${intervals[i][0]}), max(${workingInterval[1]}, ${intervals[i][1]})]`,
      });
      workingInterval[0] = Math.min(workingInterval[0], intervals[i][0]);
      workingInterval[1] = Math.max(workingInterval[1], intervals[i][1]);
      steps.push({
        line: 5,
        variables: { i, 'newInterval': `[${workingInterval[0]}, ${workingInterval[1]}]` },
        intervals: intervals.map(interval => [...interval]),
        newInterval: [...workingInterval],
        result: result.map(r => [...r]),
        currentIndex: i,
        phase: 'merge',
        description: `Merged interval updated: [${workingInterval[0]}, ${workingInterval[1]}]`,
      });
      i++;
    }

    // Add merged newInterval
    steps.push({
      line: 7,
      variables: {},
      intervals: intervals.map(interval => [...interval]),
      newInterval: [...workingInterval],
      result: result.map(r => [...r]),
      phase: 'merge',
      description: `Add merged newInterval [${workingInterval[0]}, ${workingInterval[1]}] to result`,
    });
    result.push([...workingInterval]);

    // Phase 3: Add remaining intervals
    while (i < n) {
      steps.push({
        line: 8,
        variables: { i },
        intervals: intervals.map(interval => [...interval]),
        newInterval: [...workingInterval],
        result: result.map(r => [...r]),
        currentIndex: i,
        phase: 'after',
        description: `Phase 3: Add remaining interval [${intervals[i][0]}, ${intervals[i][1]}] to result`,
      });
      result.push([...intervals[i]]);
      i++;
    }

    steps.push({
      line: 9,
      variables: {},
      intervals: intervals.map(interval => [...interval]),
      newInterval: [...workingInterval],
      result: result.map(r => [...r]),
      isComplete: true,
      description: `Algorithm complete! Result: [${result.map(r => `[${r[0]},${r[1]}]`).join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<InsertIntervalStep[]>(() => generateSteps(intervals, newInterval));

  useEffect(() => {
    setSteps(generateSteps(intervals, newInterval));
  }, [intervals, newInterval]);

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
  }, [intervals, newInterval, reset]);

  const handleCustomInput = () => {
    try {
      const parsedIntervals = JSON.parse(customIntervals);
      const parsedNewInterval = JSON.parse(customNewInterval);
      if (Array.isArray(parsedIntervals) && Array.isArray(parsedNewInterval) && parsedNewInterval.length === 2) {
        setIntervals(parsedIntervals);
        setNewInterval(parsedNewInterval);
        setShowCustomInput(false);
        setCustomIntervals('');
        setCustomNewInterval('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Intervals (JSON: [[1,3],[6,9]])',
      value: customIntervals,
      onChange: setCustomIntervals,
      placeholder: '[[1,3],[6,9]]',
    },
    {
      label: 'New Interval (JSON: [2,5])',
      value: customNewInterval,
      onChange: setCustomNewInterval,
      placeholder: '[2,5]',
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
            result={currentStepData.result}
            timeComplexity="O(n)"
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
        {/* Original Intervals */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.textSecondary, mb: 2 }}>
            Original Intervals
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {currentStepData.intervals.map((interval, idx) => {
              const isCurrent = currentStepData.currentIndex === idx;
              const [start, end] = interval;
              const maxEnd = Math.max(...currentStepData.intervals.map(i => i[1]), currentStepData.newInterval[1]);
              const scale = 100 / maxEnd;
              const width = end - start;

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
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: themeColors.white }}>
                        [{start}, {end}]
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* New Interval */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.textSecondary, mb: 2 }}>
            New Interval to Insert
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, position: 'relative', height: 40 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: `${(currentStepData.newInterval[0] / Math.max(...currentStepData.intervals.map(i => i[1]), currentStepData.newInterval[1])) * 100}%`,
                  width: `${((currentStepData.newInterval[1] - currentStepData.newInterval[0]) / Math.max(...currentStepData.intervals.map(i => i[1]), currentStepData.newInterval[1])) * 100}%`,
                  height: 30,
                  backgroundColor: '#10b98133',
                  border: '2px solid #10b981',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>
                  [{currentStepData.newInterval[0]}, {currentStepData.newInterval[1]}]
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Result */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.textSecondary, mb: 2 }}>
            Result
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {currentStepData.result.length > 0 ? (
              currentStepData.result.map((interval, idx) => {
                const [start, end] = interval;
                const maxEnd = Math.max(...currentStepData.intervals.map(i => i[1]), currentStepData.newInterval[1]);
                const scale = 100 / maxEnd;
                const width = end - start;

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
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>
                          [{start}, {end}]
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem', fontStyle: 'italic' }}>
                Result will appear here...
              </Typography>
            )}
          </Box>
        </Box>

        {/* Variables */}
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
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
        title={question?.title || 'Insert Interval'}
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

export default InsertIntervalVisualizationPage;

