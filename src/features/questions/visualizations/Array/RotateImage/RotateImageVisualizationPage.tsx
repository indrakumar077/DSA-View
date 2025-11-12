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

interface RotateImageStep extends VisualizationStep {
  matrix: number[][];
  phase?: 'transpose' | 'reverse';
  i?: number;
  j?: number;
  swapped?: boolean;
  isComplete?: boolean;
}

export const RotateImageVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 48;
  
  const defaultMatrix: number[][] = (question?.defaultInput as any)?.matrix || [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  
  const [matrix, setMatrix] = useState<number[][]>(defaultMatrix);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMatrix, setCustomMatrix] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.matrix && Array.isArray(input.matrix)) {
        setMatrix(input.matrix);
      }
    }
  }, [question]);

  const generateSteps = (matrix: number[][]): RotateImageStep[] => {
    const steps: RotateImageStep[] = [];
    const matrixCopy = matrix.map(row => [...row]);
    const n = matrixCopy.length;

    steps.push({
      line: 1,
      variables: { n },
      matrix: matrixCopy.map(row => [...row]),
      description: `Initialize: n x n matrix where n = ${n}`,
    });

    // Phase 1: Transpose
    steps.push({
      line: 2,
      variables: {},
      matrix: matrixCopy.map(row => [...row]),
      phase: 'transpose',
      description: 'Phase 1: Transpose matrix (swap elements across diagonal)',
    });

    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        steps.push({
          line: 3,
          variables: { i, j, 'matrix[i][j]': matrixCopy[i][j], 'matrix[j][i]': matrixCopy[j][i] },
          matrix: matrixCopy.map(row => [...row]),
          phase: 'transpose',
          i,
          j,
          swapped: false,
          description: `Transpose: Swap matrix[${i}][${j}] (${matrixCopy[i][j]}) with matrix[${j}][${i}] (${matrixCopy[j][i]})`,
        });

        const temp = matrixCopy[i][j];
        matrixCopy[i][j] = matrixCopy[j][i];
        matrixCopy[j][i] = temp;

        steps.push({
          line: 3,
          variables: { i, j },
          matrix: matrixCopy.map(row => [...row]),
          phase: 'transpose',
          i,
          j,
          swapped: true,
          description: `Swapped: matrix[${i}][${j}] = ${matrixCopy[i][j]}, matrix[${j}][${i}] = ${matrixCopy[j][i]}`,
        });
      }
    }

    steps.push({
      line: 5,
      variables: {},
      matrix: matrixCopy.map(row => [...row]),
      phase: 'reverse',
      description: 'Phase 2: Reverse each row to complete 90° clockwise rotation',
    });

    // Phase 2: Reverse rows
    for (let i = 0; i < n; i++) {
      steps.push({
        line: 6,
        variables: { i },
        matrix: matrixCopy.map(row => [...row]),
        phase: 'reverse',
        i,
        description: `Reverse row ${i}: [${matrixCopy[i].join(', ')}]`,
      });

      let left = 0;
      let right = n - 1;
      while (left < right) {
        steps.push({
          line: 6,
          variables: { i, left, right },
          matrix: matrixCopy.map(row => [...row]),
          phase: 'reverse',
          i,
          j: left,
          swapped: false,
          description: `Reverse row ${i}: Swap matrix[${i}][${left}] (${matrixCopy[i][left]}) with matrix[${i}][${right}] (${matrixCopy[i][right]})`,
        });

        const temp = matrixCopy[i][left];
        matrixCopy[i][left] = matrixCopy[i][right];
        matrixCopy[i][right] = temp;

        steps.push({
          line: 6,
          variables: { i, left, right },
          matrix: matrixCopy.map(row => [...row]),
          phase: 'reverse',
          i,
          j: left,
          swapped: true,
          description: `Swapped: matrix[${i}][${left}] = ${matrixCopy[i][left]}, matrix[${i}][${right}] = ${matrixCopy[i][right]}`,
        });

        left++;
        right--;
      }
    }

    steps.push({
      line: 6,
      variables: {},
      matrix: matrixCopy.map(row => [...row]),
      isComplete: true,
      description: `Rotation complete! Matrix rotated 90° clockwise`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<RotateImageStep[]>(() => generateSteps(matrix));

  useEffect(() => {
    setSteps(generateSteps(matrix));
  }, [matrix]);

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
  }, [matrix, reset]);

  const handleCustomInput = () => {
    try {
      const parsed = JSON.parse(customMatrix);
      if (Array.isArray(parsed) && parsed.every(row => Array.isArray(row))) {
        setMatrix(parsed);
        setShowCustomInput(false);
        setCustomMatrix('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Matrix (JSON: [[1,2,3],[4,5,6],[7,8,9]])',
      value: customMatrix,
      onChange: setCustomMatrix,
      placeholder: '[[1,2,3],[4,5,6],[7,8,9]]',
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
          <SolutionMessage result={currentStepData.matrix} timeComplexity="O(n²)" spaceComplexity="O(1)" />
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
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.textSecondary, mb: 2, textAlign: 'center' }}>
            {currentStepData.phase === 'transpose' ? 'Transpose Phase' : currentStepData.phase === 'reverse' ? 'Reverse Phase' : 'Matrix'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
            {currentStepData.matrix.map((row, rowIdx) => (
              <Box key={rowIdx} sx={{ display: 'flex', gap: 0.5 }}>
                {row.map((num, colIdx) => {
                  const isCurrent = (currentStepData.i === rowIdx && currentStepData.j === colIdx) || 
                                   (currentStepData.i === colIdx && currentStepData.j === rowIdx);
                  const isSwapped = currentStepData.swapped && isCurrent;
                  return (
                    <Box
                      key={colIdx}
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
                          : isCurrent
                          ? `2px solid ${themeColors.primary}`
                          : `1px solid ${themeColors.borderLight}`,
                        backgroundColor: isSwapped
                          ? '#10b98133'
                          : isCurrent
                          ? `${themeColors.primary}1a`
                          : themeColors.inputBgDark,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.white }}>
                        {num}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>

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
        title={question?.title || 'Rotate Image'}
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

export default RotateImageVisualizationPage;

