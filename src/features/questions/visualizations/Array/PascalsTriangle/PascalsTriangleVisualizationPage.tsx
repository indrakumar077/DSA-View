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

interface PascalsTriangleStep extends VisualizationStep {
  triangle: number[][];
  currentRow?: number;
  currentCol?: number;
  isComplete?: boolean;
}

export const PascalsTriangleVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 118;
  
  const defaultNumRows: number = (question?.defaultInput as any)?.numRows || 5;
  
  const [numRows, setNumRows] = useState<number>(defaultNumRows);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNumRows, setCustomNumRows] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (question?.defaultInput) {
      const input = question.defaultInput as any;
      if (input.numRows !== undefined && typeof input.numRows === 'number') {
        setNumRows(input.numRows);
      }
    }
  }, [question]);

  const generateSteps = (numRows: number): PascalsTriangleStep[] => {
    const steps: PascalsTriangleStep[] = [];
    const triangle: number[][] = [];

    // Initial state
    steps.push({
      line: 1,
      variables: { numRows },
      triangle: [],
      description: `Initialize empty triangle for ${numRows} rows`,
    });

    for (let i = 0; i < numRows; i++) {
      // Create row
      steps.push({
        line: 2,
        variables: { i, 'rowSize': i + 1 },
        triangle: triangle.map(row => [...row]),
        currentRow: i,
        description: `Creating row ${i} with ${i + 1} elements, all initialized to 1`,
      });

      const row = new Array(i + 1).fill(1);
      triangle.push(row);

      steps.push({
        line: 3,
        variables: { i },
        triangle: triangle.map(row => [...row]),
        currentRow: i,
        description: `Row ${i} created: [${row.join(', ')}]`,
      });

      // Fill middle elements
      if (i > 0) {
        for (let j = 1; j < i; j++) {
          const prevRow = triangle[i - 1];
          const sum = prevRow[j - 1] + prevRow[j];

          steps.push({
            line: 4,
            variables: { i, j, 'prevRow[j-1]': prevRow[j - 1], 'prevRow[j]': prevRow[j], sum },
            triangle: triangle.map(r => [...r]),
            currentRow: i,
            currentCol: j,
            description: `Fill element at row ${i}, col ${j}:\ntriangle[${i-1}][${j-1}] + triangle[${i-1}][${j}] = ${prevRow[j - 1]} + ${prevRow[j]} = ${sum}`,
          });

          row[j] = sum;

          steps.push({
            line: 5,
            variables: { i, j, sum },
            triangle: triangle.map(r => [...r]),
            currentRow: i,
            currentCol: j,
            description: `Updated row ${i}: [${row.join(', ')}]`,
          });
        }
      }

      steps.push({
        line: 6,
        variables: { i },
        triangle: triangle.map(row => [...row]),
        currentRow: i,
        description: `Row ${i} complete: [${row.join(', ')}]`,
      });
    }

    steps.push({
      line: 7,
      variables: {},
      triangle: triangle.map(row => [...row]),
      isComplete: true,
      description: `Pascal's Triangle complete with ${numRows} rows!`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<PascalsTriangleStep[]>(() => generateSteps(numRows));

  useEffect(() => {
    setSteps(generateSteps(numRows));
  }, [numRows]);

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
  }, [numRows, reset]);

  const handleCustomInput = () => {
    try {
      const rows = parseInt(customNumRows);
      if (!isNaN(rows) && rows > 0 && rows <= 30) {
        setNumRows(rows);
        setShowCustomInput(false);
        setCustomNumRows('');
      }
    } catch (e) {
      console.error('Invalid input');
    }
  };

  const customInputFields = [
    {
      label: 'Number of Rows (1-30)',
      value: customNumRows,
      onChange: setCustomNumRows,
      placeholder: '5',
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
            result={currentStepData.triangle}
            timeComplexity="O(numRows²)"
            spaceComplexity="O(numRows²)"
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
        {/* Pascal's Triangle Visualization */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: themeColors.textSecondary,
              mb: 2,
              textAlign: 'center',
            }}
          >
            Pascal's Triangle
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {currentStepData.triangle.map((row, rowIdx) => {
              const isCurrentRow = currentStepData.currentRow === rowIdx;
              return (
                <Box
                  key={rowIdx}
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {row.map((num, colIdx) => {
                    const isCurrentCol = currentStepData.currentCol === colIdx && isCurrentRow;
                    const isEdge = colIdx === 0 || colIdx === row.length - 1;
                    return (
                      <Box
                        key={colIdx}
                        sx={{
                          width: 40,
                          height: 40,
                          minWidth: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          border: isCurrentCol
                            ? `2px solid ${themeColors.primary}`
                            : isCurrentRow
                            ? `1px solid ${themeColors.primary}33`
                            : `1px solid ${themeColors.borderLight}`,
                          backgroundColor: isCurrentCol
                            ? `${themeColors.primary}33`
                            : isCurrentRow
                            ? `${themeColors.primary}1a`
                            : isEdge
                            ? `${themeColors.textSecondary}1a`
                            : 'transparent',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: isCurrentCol
                              ? themeColors.primary
                              : isEdge
                              ? themeColors.textSecondary
                              : themeColors.white,
                          }}
                        >
                          {num}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
            {currentStepData.triangle.length === 0 && (
              <Typography sx={{ color: themeColors.textSecondary, fontSize: '0.875rem', fontStyle: 'italic' }}>
                Triangle will be built here...
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
        title={question?.title || "Pascal's Triangle"}
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

export default PascalsTriangleVisualizationPage;

