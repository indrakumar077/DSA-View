/**
 * Utility functions for testing visualization components
 */

export interface VisualizationStep {
  [key: string]: any;
  description: string;
  isComplete?: boolean;
  isSolution?: boolean;
  result?: any;
}

/**
 * Helper to find solution step in visualization steps
 */
export const findSolutionStep = (steps: VisualizationStep[]) => {
  return steps.find((step) => step.isSolution === true || step.isComplete === true);
};

/**
 * Helper to verify algorithm result
 */
export const verifyAlgorithmResult = (
  steps: VisualizationStep[],
  expectedResult: any
) => {
  const solutionStep = findSolutionStep(steps);
  expect(solutionStep).toBeDefined();
  
  if (solutionStep?.result) {
    expect(solutionStep.result).toEqual(expectedResult);
  } else if (solutionStep?.array) {
    // For array-based algorithms
    expect(solutionStep.array).toEqual(expectedResult);
  }
};

/**
 * Helper to count specific step types
 */
export const countStepTypes = (
  steps: VisualizationStep[],
  predicate: (step: VisualizationStep) => boolean
) => {
  return steps.filter(predicate).length;
};

/**
 * Helper to extract final state from steps
 */
export const getFinalState = (steps: VisualizationStep[]) => {
  const completeStep = steps.find((step) => step.isComplete === true);
  return completeStep || steps[steps.length - 1];
};

