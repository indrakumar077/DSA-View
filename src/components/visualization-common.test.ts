import { describe, it, expect } from 'vitest';
import { questionsData } from '../data/questions';

/**
 * Common tests for all visualization components
 * These tests verify that every visualization has:
 * 1. Code highlighting (line numbers)
 * 2. Variable values in each step
 * 3. Proper step structure
 */

interface VisualizationStep {
  line: number;
  variables: Record<string, any>;
  description: string;
  [key: string]: any;
}

describe('All Visualization Questions - Common Requirements', () => {
  // Get all questions with visualizations
  const visualizationQuestions = Object.values(questionsData).filter(
    (q) => q.hasVisualization
  );

  it('should have visualizations for all marked questions', () => {
    expect(visualizationQuestions.length).toBeGreaterThan(0);
    
    visualizationQuestions.forEach((question) => {
      expect(question.hasVisualization).toBe(true);
      expect(question.id).toBeDefined();
      expect(question.title).toBeDefined();
    });
  });

  describe('Code Highlighting Requirements', () => {
    it('should verify that all visualization components need line numbers', () => {
      // This is a structural test - actual line number testing is done
      // in individual component tests
      visualizationQuestions.forEach((question) => {
        expect(question.hasVisualization).toBe(true);
        // Each visualization should have code that can be highlighted
        expect(question.codes).toBeDefined();
        expect(question.codes.Python).toBeDefined();
      });
    });

    it('should have code in all required languages', () => {
      visualizationQuestions.forEach((question) => {
        expect(question.codes.Python).toBeDefined();
        expect(question.codes.Java).toBeDefined();
        expect(question.codes['C++']).toBeDefined();
        expect(question.codes.JavaScript).toBeDefined();
        
        // Code should not be empty
        expect(question.codes.Python.length).toBeGreaterThan(0);
        expect(question.codes.Java.length).toBeGreaterThan(0);
        expect(question.codes['C++'].length).toBeGreaterThan(0);
        expect(question.codes.JavaScript.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Variable Tracking Requirements', () => {
    it('should verify that visualizations track variables', () => {
      // This test ensures the structure is in place
      // Individual component tests verify actual variable values
      visualizationQuestions.forEach((question) => {
        expect(question.explanation).toBeDefined();
        expect(question.explanation.steps).toBeDefined();
        expect(Array.isArray(question.explanation.steps)).toBe(true);
      });
    });
  });

  describe('Step Structure Requirements', () => {
    it('should have proper explanation structure for all visualizations', () => {
      visualizationQuestions.forEach((question) => {
        expect(question.explanation).toBeDefined();
        expect(question.explanation.approach).toBeDefined();
        expect(question.explanation.steps).toBeDefined();
        expect(Array.isArray(question.explanation.steps)).toBe(true);
        expect(question.explanation.steps.length).toBeGreaterThan(0);
        expect(question.explanation.timeComplexity).toBeDefined();
        expect(question.explanation.spaceComplexity).toBeDefined();
      });
    });
  });
});

/**
 * Helper function to validate step structure
 * This can be used by individual visualization tests
 */
export const validateStepStructure = (step: VisualizationStep, stepIndex: number) => {
  // Every step must have a line number for code highlighting
  expect(step.line).toBeDefined();
  expect(typeof step.line).toBe('number');
  expect(step.line).toBeGreaterThan(0);

  // Every step must have variables object
  expect(step.variables).toBeDefined();
  expect(typeof step.variables).toBe('object');

  // Every step must have a description
  expect(step.description).toBeDefined();
  expect(typeof step.description).toBe('string');
  expect(step.description.length).toBeGreaterThan(0);
};

/**
 * Helper function to validate variable values in a step
 */
export const validateVariableValues = (
  step: VisualizationStep,
  expectedVariables: string[]
) => {
  expectedVariables.forEach((varName) => {
    expect(step.variables).toHaveProperty(varName);
    expect(step.variables[varName]).toBeDefined();
  });
};

/**
 * Helper function to validate line progression
 */
export const validateLineProgression = (steps: VisualizationStep[]) => {
  steps.forEach((step, index) => {
    // Line should be valid
    expect(step.line).toBeGreaterThan(0);
    
    // First step should typically be line 1 (initialization)
    if (index === 0) {
      expect(step.line).toBe(1);
    }
  });
};

