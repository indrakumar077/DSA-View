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

interface SetMatrixZeroesStep extends VisualizationStep {
  matrix: number[][];
  firstRowZero?: boolean;
  firstColZero?: boolean;
  phase?: 'check' | 'mark' | 'set' | 'finalize';
  i?: number;
  j?: number;
  isComplete?: boolean;
}

export const SetMatrixZeroesVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 73;
  
  const defaultMatrix: number[][] = (question?.defaultInput as any)?.matrix || [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
  
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

  const generateSteps = (matrix: number[][], lang: Language): SetMatrixZeroesStep[] => {
    const steps: SetMatrixZeroesStep[] = [];
    const matrixCopy = matrix.map(row => [...row]);
    const m = matrixCopy.length;
    const n = matrixCopy[0].length;

    // Get the code for the current language
    const code = question?.codes?.[lang] || '';
    if (!code) return steps;

    const codeLines = code.split('\n');
    let firstRowZero = false;
    let firstColZero = false;

    // Helper to check if a line is executable
    const isExecutableLine = (line: string): boolean => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith('#') &&
             trimmed !== '{' &&
             trimmed !== '}';
    };

    // Parse each line and generate steps
    for (let lineIdx = 0; lineIdx < codeLines.length; lineIdx++) {
      const line = codeLines[lineIdx];
      const lineNum = lineIdx + 1;
      const trimmed = line.trim();

      if (!isExecutableLine(line)) continue;

      // Python implementation
      if (lang === Language.PYTHON) {
        // Line 1: def setZeroes(matrix):
        if (lineNum === 1) {
          steps.push({
            line: lineNum,
            variables: {},
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Function definition - ${trimmed}`,
          });
        }
        // Line 2: m, n = len(matrix), len(matrix[0])
        else if (lineNum === 2) {
          steps.push({
            line: lineNum,
            variables: { m, n },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize m = ${m}, n = ${n} - ${trimmed}`,
          });
        }
        // Line 3: first_row_zero = any(...)
        else if (lineNum === 3) {
          for (let j = 0; j < n; j++) {
            steps.push({
              line: lineNum,
              variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i: 0,
              j,
              description: `Line ${lineNum}: Check first row - j = ${j}, matrix[0][${j}] = ${matrixCopy[0][j]}`,
            });
            if (matrixCopy[0][j] === 0) {
              firstRowZero = true;
              steps.push({
                line: lineNum,
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum}: Found zero, firstRowZero = true`,
              });
              break;
            }
          }
          if (!firstRowZero) {
            steps.push({
              line: lineNum,
              variables: { m, n, firstRowZero: false },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              description: `Line ${lineNum}: No zeros in first row, firstRowZero = false`,
            });
          }
        }
        // Line 4: first_col_zero = any(...)
        else if (lineNum === 4) {
          for (let i = 0; i < m; i++) {
            steps.push({
              line: lineNum,
              variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i,
              j: 0,
              description: `Line ${lineNum}: Check first column - i = ${i}, matrix[${i}][0] = ${matrixCopy[i][0]}`,
            });
            if (matrixCopy[i][0] === 0) {
              firstColZero = true;
              steps.push({
                line: lineNum,
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum}: Found zero, firstColZero = true`,
              });
              break;
            }
          }
          if (!firstColZero) {
            steps.push({
              line: lineNum,
              variables: { m, n, firstRowZero, firstColZero: false },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              description: `Line ${lineNum}: No zeros in first column, firstColZero = false`,
            });
          }
        }
        // Line 7: for i in range(1, m):
        else if (lineNum === 7) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'mark',
            description: `Line ${lineNum}: Start marking zeros - for i in range(1, ${m}):`,
          });
        }
        // Line 8: for j in range(1, n):
        else if (lineNum === 8) {
          // Handled in line 9
        }
        // Line 9: if matrix[i][j] == 0:
        else if (lineNum === 9) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'mark',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][${j}] == 0? ${matrixCopy[i][j] === 0 ? 'TRUE' : 'FALSE'}`,
              });
              if (matrixCopy[i][j] === 0) {
                matrixCopy[i][0] = 0;
                matrixCopy[0][j] = 0;
                steps.push({
                  line: lineNum + 1, // Line 10: matrix[i][0] = 0
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Mark matrix[${i}][0] = 0`,
                });
                steps.push({
                  line: lineNum + 2, // Line 11: matrix[0][j] = 0
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 2}: Mark matrix[0][${j}] = 0`,
                });
              }
            }
          }
        }
        // Line 14: for i in range(1, m): (set zeros)
        else if (lineNum === 14) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'set',
            description: `Line ${lineNum}: Start setting zeros - for i in range(1, ${m}):`,
          });
        }
        // Line 16: if matrix[i][0] == 0 or matrix[0][j] == 0:
        else if (lineNum === 16) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'set',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][0] == 0 (${matrixCopy[i][0]}) or matrix[0][${j}] == 0 (${matrixCopy[0][j]})? ${(matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) ? 'TRUE' : 'FALSE'}`,
              });
              if (matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) {
                matrixCopy[i][j] = 0;
                steps.push({
                  line: lineNum + 1, // Line 17: matrix[i][j] = 0
                  variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'set',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Set matrix[${i}][${j}] = 0`,
                });
              }
            }
          }
        }
        // Line 20: if first_row_zero:
        else if (lineNum === 20) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if first_row_zero (${firstRowZero})? ${firstRowZero ? 'TRUE - Enter block' : 'FALSE - Skip'}`,
          });
          if (firstRowZero) {
            for (let j = 0; j < n; j++) {
              steps.push({
                line: lineNum + 1, // Line 21: for j in range(n):
                variables: { m, n, j, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Loop j = ${j}`,
              });
              matrixCopy[0][j] = 0;
              steps.push({
                line: lineNum + 2, // Line 22: matrix[0][j] = 0
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: Set matrix[0][${j}] = 0`,
              });
            }
          }
        }
        // Line 25: if first_col_zero:
        else if (lineNum === 25) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if first_col_zero (${firstColZero})? ${firstColZero ? 'TRUE - Enter block' : 'FALSE - Skip'}`,
          });
          if (firstColZero) {
            for (let i = 0; i < m; i++) {
              steps.push({
                line: lineNum + 1, // Line 26: for i in range(m):
                variables: { m, n, i, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Loop i = ${i}`,
              });
              matrixCopy[i][0] = 0;
              steps.push({
                line: lineNum + 2, // Line 27: matrix[i][0] = 0
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: Set matrix[${i}][0] = 0`,
              });
            }
          }
        }
      }
      // Java implementation
      else if (lang === Language.JAVA) {
        // Line 1: public void setZeroes(int[][] matrix) {
        if (lineNum === 1) {
          steps.push({
            line: lineNum,
            variables: {},
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Function definition - ${trimmed}`,
          });
        }
        // Line 2: int m = matrix.length, n = matrix[0].length;
        else if (lineNum === 2) {
          steps.push({
            line: lineNum,
            variables: { m, n },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize m = ${m}, n = ${n} - ${trimmed}`,
          });
        }
        // Line 3: boolean firstRowZero = false, firstColZero = false;
        else if (lineNum === 3) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero: false, firstColZero: false },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize flags - firstRowZero = false, firstColZero = false - ${trimmed}`,
          });
        }
        // Line 6: for (int j = 0; j < n; j++) {
        else if (lineNum === 6) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first row - for (int j = 0; j < ${n}; j++) - ${trimmed}`,
          });
        }
        // Line 7: if (matrix[0][j] == 0) {
        else if (lineNum === 7) {
          for (let j = 0; j < n; j++) {
            steps.push({
              line: lineNum,
              variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i: 0,
              j,
              description: `Line ${lineNum}: Check if matrix[0][${j}] == 0? ${matrixCopy[0][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[0][j] === 0) {
              firstRowZero = true;
              steps.push({
                line: lineNum + 1, // Line 8: firstRowZero = true;
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Set firstRowZero = true - ${codeLines[lineNum].trim()}`,
              });
              steps.push({
                line: lineNum + 2, // Line 9: break;
                variables: { m, n, j, firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: break - exit loop`,
              });
              break;
            }
          }
        }
        // Line 14: for (int i = 0; i < m; i++) {
        else if (lineNum === 14) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first column - for (int i = 0; i < ${m}; i++) - ${trimmed}`,
          });
        }
        // Line 15: if (matrix[i][0] == 0) {
        else if (lineNum === 15) {
          for (let i = 0; i < m; i++) {
            steps.push({
              line: lineNum,
              variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i,
              j: 0,
              description: `Line ${lineNum}: Check if matrix[${i}][0] == 0? ${matrixCopy[i][0] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[i][0] === 0) {
              firstColZero = true;
              steps.push({
                line: lineNum + 1, // Line 16: firstColZero = true;
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Set firstColZero = true - ${codeLines[lineNum].trim()}`,
              });
              steps.push({
                line: lineNum + 2, // Line 17: break;
                variables: { m, n, i, firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: break - exit loop`,
              });
              break;
            }
          }
        }
        // Line 22: for (int i = 1; i < m; i++) { (mark zeros)
        else if (lineNum === 22) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'mark',
            description: `Line ${lineNum}: Start marking zeros - for (int i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        // Line 24: if (matrix[i][j] == 0) {
        else if (lineNum === 24) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'mark',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][${j}] == 0? ${matrixCopy[i][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][j] === 0) {
                matrixCopy[i][0] = 0;
                matrixCopy[0][j] = 0;
                steps.push({
                  line: lineNum + 1, // Line 25: matrix[i][0] = 0;
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Mark matrix[${i}][0] = 0 - ${codeLines[lineNum].trim()}`,
                });
                steps.push({
                  line: lineNum + 2, // Line 26: matrix[0][j] = 0;
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 2}: Mark matrix[0][${j}] = 0 - ${codeLines[lineNum + 1].trim()}`,
                });
              }
            }
          }
        }
        // Line 32: for (int i = 1; i < m; i++) { (set zeros)
        else if (lineNum === 32) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'set',
            description: `Line ${lineNum}: Start setting zeros - for (int i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        // Line 34: if (matrix[i][0] == 0 || matrix[0][j] == 0) {
        else if (lineNum === 34) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'set',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][0] == 0 (${matrixCopy[i][0]}) || matrix[0][${j}] == 0 (${matrixCopy[0][j]})? ${(matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) {
                matrixCopy[i][j] = 0;
                steps.push({
                  line: lineNum + 1, // Line 35: matrix[i][j] = 0;
                  variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'set',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Set matrix[${i}][${j}] = 0 - ${codeLines[lineNum].trim()}`,
                });
              }
            }
          }
        }
        // Line 41: if (firstRowZero) {
        else if (lineNum === 41) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstRowZero (${firstRowZero})? ${firstRowZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstRowZero) {
            for (let j = 0; j < n; j++) {
              steps.push({
                line: lineNum + 1, // Line 42: for (int j = 0; j < n; j++) {
                variables: { m, n, j, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Loop j = ${j} - ${codeLines[lineNum].trim()}`,
              });
              matrixCopy[0][j] = 0;
              steps.push({
                line: lineNum + 2, // Line 43: matrix[0][j] = 0;
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: Set matrix[0][${j}] = 0 - ${codeLines[lineNum + 1].trim()}`,
              });
            }
          }
        }
        // Line 48: if (firstColZero) {
        else if (lineNum === 48) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstColZero (${firstColZero})? ${firstColZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstColZero) {
            for (let i = 0; i < m; i++) {
              steps.push({
                line: lineNum + 1, // Line 49: for (int i = 0; i < m; i++) {
                variables: { m, n, i, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Loop i = ${i} - ${codeLines[lineNum].trim()}`,
              });
              matrixCopy[i][0] = 0;
              steps.push({
                line: lineNum + 2, // Line 50: matrix[i][0] = 0;
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: Set matrix[${i}][0] = 0 - ${codeLines[lineNum + 1].trim()}`,
              });
            }
          }
        }
      }
      // C++ implementation (similar to Java)
      else if (lang === Language.CPP) {
        // Similar structure to Java, with C++ specific syntax
        if (lineNum === 1) {
          steps.push({
            line: lineNum,
            variables: {},
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Function definition - ${trimmed}`,
          });
        }
        else if (lineNum === 2) {
          steps.push({
            line: lineNum,
            variables: { m, n },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize m = ${m}, n = ${n} - ${trimmed}`,
          });
        }
        else if (lineNum === 3) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero: false, firstColZero: false },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize flags - firstRowZero = false, firstColZero = false - ${trimmed}`,
          });
        }
        else if (lineNum === 6) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first row - for (int j = 0; j < ${n}; j++) - ${trimmed}`,
          });
        }
        else if (lineNum === 7) {
          for (let j = 0; j < n; j++) {
            steps.push({
              line: lineNum,
              variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i: 0,
              j,
              description: `Line ${lineNum}: Check if matrix[0][${j}] == 0? ${matrixCopy[0][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[0][j] === 0) {
              firstRowZero = true;
              steps.push({
                line: lineNum + 1,
                variables: { m, n, j, firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Set firstRowZero = true`,
              });
              steps.push({
                line: lineNum + 2,
                variables: { m, n, j, firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: break`,
              });
              break;
            }
          }
        }
        else if (lineNum === 14) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first column - for (int i = 0; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 15) {
          for (let i = 0; i < m; i++) {
            steps.push({
              line: lineNum,
              variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i,
              j: 0,
              description: `Line ${lineNum}: Check if matrix[${i}][0] == 0? ${matrixCopy[i][0] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[i][0] === 0) {
              firstColZero = true;
              steps.push({
                line: lineNum + 1,
                variables: { m, n, i, firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Set firstColZero = true`,
              });
              steps.push({
                line: lineNum + 2,
                variables: { m, n, i, firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: break`,
              });
              break;
            }
          }
        }
        else if (lineNum === 22) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'mark',
            description: `Line ${lineNum}: Start marking zeros - for (int i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 24) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'mark',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][${j}] == 0? ${matrixCopy[i][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][j] === 0) {
                matrixCopy[i][0] = 0;
                matrixCopy[0][j] = 0;
                steps.push({
                  line: lineNum + 1,
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Mark matrix[${i}][0] = 0`,
                });
                steps.push({
                  line: lineNum + 2,
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 2}: Mark matrix[0][${j}] = 0`,
                });
              }
            }
          }
        }
        else if (lineNum === 32) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'set',
            description: `Line ${lineNum}: Start setting zeros - for (int i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 34) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'set',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][0] == 0 (${matrixCopy[i][0]}) || matrix[0][${j}] == 0 (${matrixCopy[0][j]})? ${(matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) {
                matrixCopy[i][j] = 0;
                steps.push({
                  line: lineNum + 1,
                  variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'set',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Set matrix[${i}][${j}] = 0`,
                });
              }
            }
          }
        }
        else if (lineNum === 41) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstRowZero (${firstRowZero})? ${firstRowZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstRowZero) {
            for (let j = 0; j < n; j++) {
              steps.push({
                line: lineNum + 1,
                variables: { m, n, j, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Loop j = ${j}`,
              });
              matrixCopy[0][j] = 0;
              steps.push({
                line: lineNum + 2,
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: Set matrix[0][${j}] = 0`,
              });
            }
          }
        }
        else if (lineNum === 48) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstColZero (${firstColZero})? ${firstColZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstColZero) {
            for (let i = 0; i < m; i++) {
              steps.push({
                line: lineNum + 1,
                variables: { m, n, i, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Loop i = ${i}`,
              });
              matrixCopy[i][0] = 0;
              steps.push({
                line: lineNum + 2,
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: Set matrix[${i}][0] = 0`,
              });
            }
          }
        }
      }
      // JavaScript implementation (similar to Java/C++)
      else if (lang === Language.JAVASCRIPT) {
        if (lineNum === 1) {
          steps.push({
            line: lineNum,
            variables: {},
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Function definition - ${trimmed}`,
          });
        }
        else if (lineNum === 2) {
          steps.push({
            line: lineNum,
            variables: { m, n },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize m = ${m}, n = ${n} - ${trimmed}`,
          });
        }
        else if (lineNum === 3) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero: false, firstColZero: false },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Initialize flags - firstRowZero = false, firstColZero = false - ${trimmed}`,
          });
        }
        else if (lineNum === 6) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first row - for (let j = 0; j < ${n}; j++) - ${trimmed}`,
          });
        }
        else if (lineNum === 7) {
          for (let j = 0; j < n; j++) {
            steps.push({
              line: lineNum,
              variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i: 0,
              j,
              description: `Line ${lineNum}: Check if matrix[0][${j}] === 0? ${matrixCopy[0][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[0][j] === 0) {
              firstRowZero = true;
              steps.push({
                line: lineNum + 1,
                variables: { m, n, j, firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Set firstRowZero = true`,
              });
              steps.push({
                line: lineNum + 2,
                variables: { m, n, j, firstRowZero: true, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: break`,
              });
              break;
            }
          }
        }
        else if (lineNum === 14) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'check',
            description: `Line ${lineNum}: Start checking first column - for (let i = 0; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 15) {
          for (let i = 0; i < m; i++) {
            steps.push({
              line: lineNum,
              variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
              matrix: matrixCopy.map(row => [...row]),
              phase: 'check',
              i,
              j: 0,
              description: `Line ${lineNum}: Check if matrix[${i}][0] === 0? ${matrixCopy[i][0] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
            });
            if (matrixCopy[i][0] === 0) {
              firstColZero = true;
              steps.push({
                line: lineNum + 1,
                variables: { m, n, i, firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Set firstColZero = true`,
              });
              steps.push({
                line: lineNum + 2,
                variables: { m, n, i, firstRowZero, firstColZero: true },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'check',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: break`,
              });
              break;
            }
          }
        }
        else if (lineNum === 22) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'mark',
            description: `Line ${lineNum}: Start marking zeros - for (let i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 24) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'mark',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][${j}] === 0? ${matrixCopy[i][j] === 0 ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][j] === 0) {
                matrixCopy[i][0] = 0;
                matrixCopy[0][j] = 0;
                steps.push({
                  line: lineNum + 1,
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Mark matrix[${i}][0] = 0`,
                });
                steps.push({
                  line: lineNum + 2,
                  variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'mark',
                  i,
                  j,
                  description: `Line ${lineNum + 2}: Mark matrix[0][${j}] = 0`,
                });
              }
            }
          }
        }
        else if (lineNum === 32) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'set',
            description: `Line ${lineNum}: Start setting zeros - for (let i = 1; i < ${m}; i++) - ${trimmed}`,
          });
        }
        else if (lineNum === 34) {
          for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
              steps.push({
                line: lineNum,
                variables: { m, n, i, j, 'matrix[i][0]': matrixCopy[i][0], 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'set',
                i,
                j,
                description: `Line ${lineNum}: Check if matrix[${i}][0] === 0 (${matrixCopy[i][0]}) || matrix[0][${j}] === 0 (${matrixCopy[0][j]})? ${(matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) ? 'TRUE' : 'FALSE'} - ${trimmed}`,
              });
              if (matrixCopy[i][0] === 0 || matrixCopy[0][j] === 0) {
                matrixCopy[i][j] = 0;
                steps.push({
                  line: lineNum + 1,
                  variables: { m, n, i, j, 'matrix[i][j]': matrixCopy[i][j], firstRowZero, firstColZero },
                  matrix: matrixCopy.map(row => [...row]),
                  phase: 'set',
                  i,
                  j,
                  description: `Line ${lineNum + 1}: Set matrix[${i}][${j}] = 0`,
                });
              }
            }
          }
        }
        else if (lineNum === 41) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstRowZero (${firstRowZero})? ${firstRowZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstRowZero) {
            for (let j = 0; j < n; j++) {
              steps.push({
                line: lineNum + 1,
                variables: { m, n, j, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 1}: Loop j = ${j}`,
              });
              matrixCopy[0][j] = 0;
              steps.push({
                line: lineNum + 2,
                variables: { m, n, j, 'matrix[0][j]': matrixCopy[0][j], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i: 0,
                j,
                description: `Line ${lineNum + 2}: Set matrix[0][${j}] = 0`,
              });
            }
          }
        }
        else if (lineNum === 48) {
          steps.push({
            line: lineNum,
            variables: { m, n, firstRowZero, firstColZero },
            matrix: matrixCopy.map(row => [...row]),
            phase: 'finalize',
            description: `Line ${lineNum}: Check if firstColZero (${firstColZero})? ${firstColZero ? 'TRUE - Enter block' : 'FALSE - Skip'} - ${trimmed}`,
          });
          if (firstColZero) {
            for (let i = 0; i < m; i++) {
              steps.push({
                line: lineNum + 1,
                variables: { m, n, i, firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 1}: Loop i = ${i}`,
              });
              matrixCopy[i][0] = 0;
              steps.push({
                line: lineNum + 2,
                variables: { m, n, i, 'matrix[i][0]': matrixCopy[i][0], firstRowZero, firstColZero },
                matrix: matrixCopy.map(row => [...row]),
                phase: 'finalize',
                i,
                j: 0,
                description: `Line ${lineNum + 2}: Set matrix[${i}][0] = 0`,
              });
            }
          }
        }
      }
    }

    // Final completion step
    steps.push({
      line: codeLines.length,
      variables: { m, n, firstRowZero, firstColZero },
      matrix: matrixCopy.map(row => [...row]),
      isComplete: true,
      description: `Algorithm complete! All zeros set. Final matrix: ${JSON.stringify(matrixCopy)}`,
    });

    return steps;
  };

  const [steps, setSteps] = useState<SetMatrixZeroesStep[]>(() => generateSteps(matrix, language));

  useEffect(() => {
    setSteps(generateSteps(matrix, language));
  }, [matrix, language]);

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
  }, [matrix, language, reset]);

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
      label: 'Matrix (JSON: [[1,1,1],[1,0,1],[1,1,1]])',
      value: customMatrix,
      onChange: setCustomMatrix,
      placeholder: '[[1,1,1],[1,0,1],[1,1,1]]',
    },
  ];

  const highlightedLine = useMemo(
    () => currentStepData.line,
    [currentStepData.line]
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
          <SolutionMessage result={currentStepData.matrix} timeComplexity="O(m × n)" spaceComplexity="O(1)" />
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
            Matrix ({currentStepData.phase || 'processing'})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
            {currentStepData.matrix.map((row, rowIdx) => (
              <Box key={rowIdx} sx={{ display: 'flex', gap: 0.5 }}>
                {row.map((num, colIdx) => {
                  const isCurrent = currentStepData.i === rowIdx && currentStepData.j === colIdx;
                  const isZero = num === 0;
                  const isMarker = (rowIdx === 0 && currentStepData.phase === 'mark') || 
                                  (colIdx === 0 && currentStepData.phase === 'mark');
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
                        border: isCurrent
                          ? `2px solid ${themeColors.primary}`
                          : isZero
                          ? `2px solid #ef4444`
                          : `1px solid ${themeColors.borderLight}`,
                        backgroundColor: isCurrent
                          ? `${themeColors.primary}33`
                          : isZero
                          ? '#ef444433'
                          : isMarker
                          ? '#f59e0b33'
                          : themeColors.inputBgDark,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: isZero ? '#ef4444' : themeColors.white }}>
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
        title={question?.title || 'Set Matrix Zeroes'}
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

export default SetMatrixZeroesVisualizationPage;
