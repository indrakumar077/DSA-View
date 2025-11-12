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

interface SpiralMatrixStep extends VisualizationStep {
  matrix: number[][];
  result: number[];
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  direction?: 'right' | 'down' | 'left' | 'up';
  currentRow?: number;
  currentCol?: number;
  isComplete?: boolean;
}

export const SpiralMatrixVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 54;
  
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

  const generateSteps = (matrix: number[][]): SpiralMatrixStep[] => {
    const steps: SpiralMatrixStep[] = [];
    const result: number[] = [];
    
    // Step 1: Function definition (line 1 in Python)
    steps.push({
      line: 1,
      variables: {},
      matrix: matrix.map(row => [...row]),
      result: [],
      description: 'Function definition: def spiralOrder(matrix)',
    });

    // Step 2: Initialize result array (line 2)
    steps.push({
      line: 2,
      variables: {},
      matrix: matrix.map(row => [...row]),
      result: [],
      description: 'Initialize empty result array: result = []',
    });

    // Step 3: Check if matrix is empty (line 3)
    steps.push({
      line: 3,
      variables: {},
      matrix: matrix.map(row => [...row]),
      result: [],
      description: `Check if matrix is empty: if not matrix → ${matrix.length === 0 ? 'TRUE' : 'FALSE'}`,
    });

    if (matrix.length === 0) {
      // Step 4: Return empty result (line 4)
      steps.push({
        line: 4,
        variables: {},
        matrix: [],
        result: [],
        description: 'Matrix is empty, return empty result: return result',
      });
      return steps;
    }

    // Step 5: Initialize top and bottom (line 6)
    let top = 0, bottom = matrix.length - 1;
    steps.push({
      line: 6,
      variables: { top, bottom },
      matrix: matrix.map(row => [...row]),
      result: [],
      top,
      bottom,
      left: 0,
      right: 0,
      description: `Initialize boundaries: top = ${top}, bottom = ${bottom} (line 6: top, bottom = 0, len(matrix) - 1)`,
    });

    // Step 6: Initialize left and right (line 7)
    let left = 0, right = matrix[0].length - 1;
    steps.push({
      line: 7,
      variables: { top, bottom, left, right },
      matrix: matrix.map(row => [...row]),
      result: [],
      top,
      bottom,
      left,
      right,
      description: `Initialize boundaries: left = ${left}, right = ${right} (line 7: left, right = 0, len(matrix[0]) - 1)`,
    });

    // Step 7: While loop condition check (line 9)
    let iterationCount = 0;
    while (top <= bottom && left <= right) {
      iterationCount++;
      steps.push({
        line: 9,
        variables: { top, bottom, left, right, iteration: iterationCount },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `While loop condition (line 9): (top=${top} <= bottom=${bottom} && left=${left} <= right=${right})? ${top <= bottom && left <= right ? 'TRUE - Enter loop' : 'FALSE - Exit loop'}`,
      });

      // Step 8: Traverse right - for loop (line 11)
      for (let j = left; j <= right; j++) {
        // Step 8a: Check loop condition (line 11)
        steps.push({
          line: 11,
          variables: { j, 'j <= right': j <= right },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          direction: 'right',
          currentRow: top,
          currentCol: j,
          description: `For loop RIGHT (line 11): j = ${j}, check j <= right (${right})? ${j <= right ? 'TRUE - Continue' : 'FALSE - Exit'}`,
        });

        if (j <= right) {
          // Step 8b: Add element to result (line 12)
          result.push(matrix[top][j]);
          steps.push({
            line: 12,
            variables: { top, j, 'matrix[top][j]': matrix[top][j] },
            matrix: matrix.map(row => [...row]),
            result: [...result],
            top,
            bottom,
            left,
            right,
            direction: 'right',
            currentRow: top,
            currentCol: j,
            description: `Add to result (line 12): result.append(matrix[${top}][${j}]) = ${matrix[top][j]}\nResult: [${result.join(', ')}]`,
          });
        }
      }

      // Step 9: Update top (line 13)
      steps.push({
        line: 13,
        variables: { top, 'newTop': top + 1 },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        direction: 'right',
        description: `Update top (line 13): top = ${top} + 1 = ${top + 1}`,
      });
      top++;
      steps.push({
        line: 13,
        variables: { top },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `Top updated: top = ${top}`,
      });

      // Step 10: Traverse down - for loop (line 16)
      for (let i = top; i <= bottom; i++) {
        // Step 10a: Check loop condition (line 16)
        steps.push({
          line: 16,
          variables: { i, 'i <= bottom': i <= bottom },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          direction: 'down',
          currentRow: i,
          currentCol: right,
          description: `For loop DOWN (line 16): i = ${i}, check i <= bottom (${bottom})? ${i <= bottom ? 'TRUE - Continue' : 'FALSE - Exit'}`,
        });

        if (i <= bottom) {
          // Step 10b: Add element to result (line 17)
          result.push(matrix[i][right]);
          steps.push({
            line: 17,
            variables: { i, right, 'matrix[i][right]': matrix[i][right] },
            matrix: matrix.map(row => [...row]),
            result: [...result],
            top,
            bottom,
            left,
            right,
            direction: 'down',
            currentRow: i,
            currentCol: right,
            description: `Add to result (line 17): result.append(matrix[${i}][${right}]) = ${matrix[i][right]}\nResult: [${result.join(', ')}]`,
          });
        }
      }

      // Step 11: Update right (line 18)
      steps.push({
        line: 18,
        variables: { right, 'newRight': right - 1 },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        direction: 'down',
        description: `Update right (line 18): right = ${right} - 1 = ${right - 1}`,
      });
      right--;
      steps.push({
        line: 18,
        variables: { right },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `Right updated: right = ${right}`,
      });

      // Step 12: Check if top <= bottom for left traversal (line 21)
      steps.push({
        line: 21,
        variables: { top, bottom },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `Check condition (line 21): top (${top}) <= bottom (${bottom})? ${top <= bottom ? 'TRUE - Enter block' : 'FALSE - Skip block'}`,
      });

      if (top <= bottom) {
        // Step 13: Traverse left - for loop (line 22)
        for (let j = right; j >= left; j--) {
          // Step 13a: Check loop condition (line 22)
          steps.push({
            line: 22,
            variables: { j, 'j >= left': j >= left },
            matrix: matrix.map(row => [...row]),
            result: [...result],
            top,
            bottom,
            left,
            right,
            direction: 'left',
            currentRow: bottom,
            currentCol: j,
            description: `For loop LEFT (line 22): j = ${j}, check j >= left (${left})? ${j >= left ? 'TRUE - Continue' : 'FALSE - Exit'}`,
          });

          if (j >= left) {
            // Step 13b: Add element to result (line 23)
            result.push(matrix[bottom][j]);
            steps.push({
              line: 23,
              variables: { bottom, j, 'matrix[bottom][j]': matrix[bottom][j] },
              matrix: matrix.map(row => [...row]),
              result: [...result],
              top,
              bottom,
              left,
              right,
              direction: 'left',
              currentRow: bottom,
              currentCol: j,
              description: `Add to result (line 23): result.append(matrix[${bottom}][${j}]) = ${matrix[bottom][j]}\nResult: [${result.join(', ')}]`,
            });
          }
        }

        // Step 14: Update bottom (line 24)
        steps.push({
          line: 24,
          variables: { bottom, 'newBottom': bottom - 1 },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          direction: 'left',
          description: `Update bottom (line 24): bottom = ${bottom} - 1 = ${bottom - 1}`,
        });
        bottom--;
        steps.push({
          line: 24,
          variables: { bottom },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          description: `Bottom updated: bottom = ${bottom}`,
        });
      }

      // Step 15: Check if left <= right for up traversal (line 27)
      steps.push({
        line: 27,
        variables: { left, right },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `Check condition (line 27): left (${left}) <= right (${right})? ${left <= right ? 'TRUE - Enter block' : 'FALSE - Skip block'}`,
      });

      if (left <= right) {
        // Step 16: Traverse up - for loop (line 28)
        for (let i = bottom; i >= top; i--) {
          // Step 16a: Check loop condition (line 28)
          steps.push({
            line: 28,
            variables: { i, 'i >= top': i >= top },
            matrix: matrix.map(row => [...row]),
            result: [...result],
            top,
            bottom,
            left,
            right,
            direction: 'up',
            currentRow: i,
            currentCol: left,
            description: `For loop UP (line 28): i = ${i}, check i >= top (${top})? ${i >= top ? 'TRUE - Continue' : 'FALSE - Exit'}`,
          });

          if (i >= top) {
            // Step 16b: Add element to result (line 29)
            result.push(matrix[i][left]);
            steps.push({
              line: 29,
              variables: { i, left, 'matrix[i][left]': matrix[i][left] },
              matrix: matrix.map(row => [...row]),
              result: [...result],
              top,
              bottom,
              left,
              right,
              direction: 'up',
              currentRow: i,
              currentCol: left,
              description: `Add to result (line 29): result.append(matrix[${i}][${left}]) = ${matrix[i][left]}\nResult: [${result.join(', ')}]`,
            });
          }
        }

        // Step 17: Update left (line 30)
        steps.push({
          line: 30,
          variables: { left, 'newLeft': left + 1 },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          direction: 'up',
          description: `Update left (line 30): left = ${left} + 1 = ${left + 1}`,
        });
        left++;
        steps.push({
          line: 30,
          variables: { left },
          matrix: matrix.map(row => [...row]),
          result: [...result],
          top,
          bottom,
          left,
          right,
          description: `Left updated: left = ${left}`,
        });
      }

      // Step 7: Re-check while condition (line 9)
      steps.push({
        line: 9,
        variables: { top, bottom, left, right },
        matrix: matrix.map(row => [...row]),
        result: [...result],
        top,
        bottom,
        left,
        right,
        description: `Re-check while condition (line 9): (top=${top} <= bottom=${bottom} && left=${left} <= right=${right})? ${top <= bottom && left <= right ? 'TRUE - Continue loop' : 'FALSE - Exit loop'}`,
      });
    }

    // Step 18: Return result (line 32)
    steps.push({
      line: 32,
      variables: {},
      matrix: matrix.map(row => [...row]),
      result: [...result],
      isComplete: true,
      description: `Return result (line 32): return result = [${result.join(', ')}]`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<SpiralMatrixStep[]>(() => generateSteps(matrix));

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

  const getDirectionColor = (dir?: string) => {
    switch (dir) {
      case 'right': return '#3b82f6';
      case 'down': return '#10b981';
      case 'left': return '#f59e0b';
      case 'up': return '#ef4444';
      default: return themeColors.borderLight;
    }
  };

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
          <SolutionMessage result={currentStepData.result} timeComplexity="O(m × n)" spaceComplexity="O(1)" />
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
            Matrix (Spiral Traversal)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
            {currentStepData.matrix.map((row, rowIdx) => (
              <Box key={rowIdx} sx={{ display: 'flex', gap: 0.5 }}>
                {row.map((num, colIdx) => {
                  const isCurrent = currentStepData.currentRow === rowIdx && currentStepData.currentCol === colIdx;
                  const dirColor = getDirectionColor(currentStepData.direction);
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
                        border: isCurrent ? `2px solid ${dirColor}` : `1px solid ${themeColors.borderLight}`,
                        backgroundColor: isCurrent ? `${dirColor}33` : themeColors.inputBgDark,
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
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.textSecondary, mb: 1 }}>
            Result (Spiral Order)
          </Typography>
          <Box
            sx={{
              backgroundColor: themeColors.inputBgDark,
              p: 2,
              borderRadius: 1,
              minHeight: 60,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            {currentStepData.result.length > 0 ? (
              currentStepData.result.map((num, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor: `${themeColors.primary}33`,
                    border: `1px solid ${themeColors.primary}`,
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: themeColors.primary }}>
                    {num}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem', fontStyle: 'italic' }}>
                Result will appear here...
              </Typography>
            )}
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
        title={question?.title || 'Spiral Matrix'}
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

export default SpiralMatrixVisualizationPage;

