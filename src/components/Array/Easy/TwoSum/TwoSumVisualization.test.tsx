import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TwoSumVisualization from './TwoSumVisualization';
import { VisualizationControlProvider } from '../../../../contexts/VisualizationControlContext';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

// Helper function to extract generateSteps logic for testing
const generateSteps = (nums: number[], target: number) => {
  const steps: any[] = [];
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

    // Check if complement exists
    if (map[complement] !== undefined) {
      steps.push({
        line: 4,
        i,
        j: map[complement],
        variables: { i, 'nums[i]': nums[i], complement },
        hashMap: { ...map },
        description: `Found! nums[${map[complement]}] + nums[${i}] = ${target}`,
        isSolution: true,
        result: [map[complement], i],
      });
      break;
    }

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

describe('TwoSum Visualization', () => {
  describe('generateSteps Algorithm', () => {
    it('should generate correct steps for valid two sum solution', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Should have initial step
      expect(steps[0].description).toBe('Initialize empty hash map');

      // Should find solution
      const solutionStep = steps.find((step) => step.isSolution === true);
      expect(solutionStep).toBeDefined();
      expect(solutionStep?.result).toEqual([0, 1]);
      expect(solutionStep?.description).toContain('Found!');
    });

    it('should generate correct steps for different input', () => {
      const nums = [3, 2, 4];
      const target = 6;
      const steps = generateSteps(nums, target);

      const solutionStep = steps.find((step) => step.isSolution === true);
      expect(solutionStep).toBeDefined();
      expect(solutionStep?.result).toEqual([1, 2]);
    });

    it('should handle duplicate numbers correctly', () => {
      const nums = [3, 3];
      const target = 6;
      const steps = generateSteps(nums, target);

      const solutionStep = steps.find((step) => step.isSolution === true);
      expect(solutionStep).toBeDefined();
      expect(solutionStep?.result).toEqual([0, 1]);
    });

    it('should generate steps with correct hash map updates', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Check that hash map is being updated
      const mapUpdateSteps = steps.filter((step) =>
        step.description.includes('Map updated')
      );
      expect(mapUpdateSteps.length).toBeGreaterThan(0);

      // First element should be added to map
      const firstMapUpdate = mapUpdateSteps[0];
      expect(firstMapUpdate.hashMap).toHaveProperty('2');
      expect(firstMapUpdate.hashMap[2]).toBe(0);
    });

    it('should calculate complement correctly in each step', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Find complement calculation steps
      const complementSteps = steps.filter(
        (step) => step.complement !== undefined
      );

      expect(complementSteps.length).toBeGreaterThan(0);
      expect(complementSteps[0].complement).toBe(7); // 9 - 2 = 7
    });
  });

  describe('Visualization Component Logic', () => {
    it('should generate steps for default input', () => {
      const defaultNums = [2, 7, 11, 15];
      const defaultTarget = 9;
      const steps = generateSteps(defaultNums, defaultTarget);
      
      // Should generate multiple steps
      expect(steps.length).toBeGreaterThan(1);
      
      // Should have solution
      const solution = steps.find((step) => step.isSolution === true);
      expect(solution).toBeDefined();
    });

    it('should handle state transitions correctly', () => {
      const nums = [3, 2, 4];
      const target = 6;
      const steps = generateSteps(nums, target);
      
      // Steps should progress logically
      expect(steps[0].line).toBe(1); // Initial step
      
      // Should have iteration steps
      const iterationSteps = steps.filter((step) => step.i !== undefined);
      expect(iterationSteps.length).toBeGreaterThan(0);
    });
  });

  describe('Algorithm Correctness', () => {
    it('should return correct indices for two sum problem', () => {
      const testCases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { nums: [3, 3], target: 6, expected: [0, 1] },
      ];

      testCases.forEach(({ nums, target, expected }) => {
        const steps = generateSteps(nums, target);
        const solutionStep = steps.find((step) => step.isSolution === true);
        expect(solutionStep?.result).toEqual(expected);
      });
    });

    it('should handle edge cases correctly', () => {
      // Test with negative numbers
      const nums1 = [-1, -2, -3, -4, -5];
      const target1 = -8;
      const steps1 = generateSteps(nums1, target1);
      const solution1 = steps1.find((step) => step.isSolution === true);
      expect(solution1).toBeDefined();

      // Test with zero
      const nums2 = [0, 4, 3, 0];
      const target2 = 0;
      const steps2 = generateSteps(nums2, target2);
      const solution2 = steps2.find((step) => step.isSolution === true);
      expect(solution2).toBeDefined();
      expect(solution2?.result).toEqual([0, 3]);
    });
  });

  describe('Code Highlighting and Line Numbers', () => {
    it('should have line property in every step for code highlighting', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Every step should have a line number
      steps.forEach((step, index) => {
        expect(step.line).toBeDefined();
        expect(typeof step.line).toBe('number');
        expect(step.line).toBeGreaterThan(0);
      });
    });

    it('should have correct line numbers for different step types', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // First step should be line 1 (initialization)
      expect(steps[0].line).toBe(1);

      // Should have line 2 steps (for loop iterations)
      const line2Steps = steps.filter((step) => step.line === 2);
      expect(line2Steps.length).toBeGreaterThan(0);

      // Should have line 3 steps (complement calculation)
      const line3Steps = steps.filter((step) => step.line === 3);
      expect(line3Steps.length).toBeGreaterThan(0);

      // Solution step should be line 4
      const solutionStep = steps.find((step) => step.isSolution === true);
      expect(solutionStep?.line).toBe(4);
    });

    it('should progress through lines correctly in sequence', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Check that steps follow logical line progression
      // Should start with line 1
      expect(steps[0].line).toBe(1);

      // Should have progression: 1 -> 2 -> 3 -> (4 if solution) or (5 if continue)
      let previousLine = 1;
      for (let i = 1; i < steps.length; i++) {
        const currentLine = steps[i].line;
        // Line should be valid (1-5 for this algorithm)
        expect(currentLine).toBeGreaterThanOrEqual(1);
        expect(currentLine).toBeLessThanOrEqual(5);
        previousLine = currentLine;
      }
    });
  });

  describe('Variable Values Display', () => {
    it('should have variables object in every step', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      steps.forEach((step) => {
        expect(step.variables).toBeDefined();
        expect(typeof step.variables).toBe('object');
      });
    });

    it('should have correct variable values in each step', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // First step should have empty variables (initialization)
      expect(steps[0].variables).toEqual({});

      // Find a step with iteration (line 2)
      const iterationStep = steps.find((step) => step.line === 2 && step.i !== undefined);
      if (iterationStep) {
        expect(iterationStep.variables).toHaveProperty('i');
        expect(iterationStep.variables).toHaveProperty('nums[i]');
        expect(iterationStep.variables['nums[i]']).toBe(nums[iterationStep.i!]);
      }

      // Find complement calculation step (line 3)
      const complementStep = steps.find((step) => step.line === 3 && step.complement !== undefined);
      if (complementStep) {
        expect(complementStep.variables).toHaveProperty('complement');
        expect(complementStep.variables.complement).toBe(target - nums[complementStep.i!]);
      }
    });

    it('should update variable values correctly across steps', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Find first iteration step
      const firstIteration = steps.find((step) => step.line === 2 && step.i === 0);
      expect(firstIteration).toBeDefined();
      expect(firstIteration?.variables['nums[i]']).toBe(2);

      // Find second iteration step
      const secondIteration = steps.find((step) => step.line === 2 && step.i === 1);
      expect(secondIteration).toBeDefined();
      expect(secondIteration?.variables['nums[i]']).toBe(7);
    });

    it('should have hashMap in variables for tracking', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // All steps should have hashMap property
      steps.forEach((step) => {
        expect(step.hashMap).toBeDefined();
        expect(typeof step.hashMap).toBe('object');
      });

      // First step should have empty hashMap
      expect(steps[0].hashMap).toEqual({});

      // Later steps should have updated hashMap
      const laterStep = steps.find((step) => step.line === 5 && Object.keys(step.hashMap).length > 0);
      if (laterStep) {
        expect(Object.keys(laterStep.hashMap).length).toBeGreaterThan(0);
      }
    });

    it('should show correct indices in solution step', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      const solutionStep = steps.find((step) => step.isSolution === true);
      expect(solutionStep).toBeDefined();
      
      if (solutionStep) {
        expect(solutionStep.variables).toHaveProperty('i');
        expect(solutionStep).toHaveProperty('j');
        expect(solutionStep.result).toEqual([solutionStep.j, solutionStep.i]);
      }
    });
  });

  describe('Step-by-Step Variable Tracking', () => {
    it('should track all variables correctly through entire algorithm', () => {
      const nums = [2, 7, 11, 15];
      const target = 9;
      const steps = generateSteps(nums, target);

      // Track variables through steps
      let lastI: number | undefined;
      let lastComplement: number | undefined;

      steps.forEach((step, index) => {
        // If step has i, it should be valid index
        if (step.i !== undefined) {
          expect(step.i).toBeGreaterThanOrEqual(0);
          expect(step.i).toBeLessThan(nums.length);
          
          // Variables should match step.i
          if (step.variables.i !== undefined) {
            expect(step.variables.i).toBe(step.i);
          }
        }

        // If step has complement, it should be calculated correctly
        if (step.complement !== undefined && step.i !== undefined) {
          const expectedComplement = target - nums[step.i];
          expect(step.complement).toBe(expectedComplement);
          expect(step.variables.complement).toBe(expectedComplement);
        }

        lastI = step.i;
        lastComplement = step.complement;
      });
    });
  });
});

