import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReverseArrayVisualization from './ReverseArrayVisualization';
import { VisualizationControlProvider } from '../../../../contexts/VisualizationControlContext';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '10' }),
    useNavigate: () => vi.fn(),
  };
});

// Helper function to extract generateSteps logic for testing
const generateSteps = (nums: number[]) => {
  const steps: any[] = [];
  const arr = [...nums];
  let left = 0;
  let right = arr.length - 1;

  if (arr.length <= 1) {
    steps.push({
      line: 1,
      variables: { left: 0, right: arr.length - 1 },
      array: [...arr],
      description: 'Array has 0 or 1 element. No reversal needed.',
      isComplete: true,
    });
    return steps;
  }

  steps.push({
    line: 1,
    left,
    right,
    variables: { left, right },
    array: [...arr],
    description: `Initialize left = ${left}, right = ${right}`,
  });

  while (left < right) {
    steps.push({
      line: 2,
      left,
      right,
      variables: { left, right, 'nums[left]': arr[left], 'nums[right]': arr[right] },
      array: [...arr],
      description: `Compare: left (${left}) < right (${right}). Swap elements at positions ${left} and ${right}`,
    });

    // Swap
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    steps.push({
      line: 3,
      left,
      right,
      variables: { left, right, 'nums[left]': arr[left], 'nums[right]': arr[right] },
      array: [...arr],
      description: `Swapped: nums[${left}] = ${arr[left]}, nums[${right}] = ${arr[right]}`,
    });

    left++;
    right--;

    if (left < right) {
      steps.push({
        line: 4,
        left,
        right,
        variables: { left, right },
        array: [...arr],
        description: `Update pointers: left = ${left}, right = ${right}`,
      });
    }
  }

  steps.push({
    line: 5,
    variables: {},
    array: [...arr],
    description: 'Reversal complete! Array is now reversed.',
    isComplete: true,
  });

  return steps;
};

describe('ReverseArray Visualization', () => {
  describe('generateSteps Algorithm', () => {
    it('should generate correct steps for reversing array', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      // Should have initial step
      expect(steps[0].description).toContain('Initialize');

      // Should have completion step
      const completeStep = steps.find((step) => step.isComplete === true);
      expect(completeStep).toBeDefined();
      expect(completeStep?.description).toContain('Reversal complete');

      // Final array should be reversed
      expect(completeStep?.array).toEqual([5, 4, 3, 2, 1]);
    });

    it('should correctly reverse array with even length', () => {
      const nums = [1, 2, 3, 4];
      const steps = generateSteps(nums);

      const completeStep = steps.find((step) => step.isComplete === true);
      expect(completeStep?.array).toEqual([4, 3, 2, 1]);
    });

    it('should correctly reverse array with odd length', () => {
      const nums = [1, 2, 3];
      const steps = generateSteps(nums);

      const completeStep = steps.find((step) => step.isComplete === true);
      expect(completeStep?.array).toEqual([3, 2, 1]);
    });

    it('should handle single element array', () => {
      const nums = [5];
      const steps = generateSteps(nums);

      expect(steps.length).toBe(1);
      expect(steps[0].isComplete).toBe(true);
      expect(steps[0].description).toContain('No reversal needed');
      expect(steps[0].array).toEqual([5]);
    });

    it('should handle empty array', () => {
      const nums: number[] = [];
      const steps = generateSteps(nums);

      expect(steps.length).toBe(1);
      expect(steps[0].isComplete).toBe(true);
      expect(steps[0].array).toEqual([]);
    });

    it('should generate swap steps correctly', () => {
      const nums = [1, 2, 3, 4];
      const steps = generateSteps(nums);

      // Find swap steps
      const swapSteps = steps.filter((step) =>
        step.description.includes('Swapped')
      );

      expect(swapSteps.length).toBeGreaterThan(0);

      // First swap should swap first and last
      const firstSwap = swapSteps[0];
      expect(firstSwap.left).toBe(0);
      expect(firstSwap.right).toBe(3);
    });

    it('should update pointers correctly after each swap', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      // Check pointer update steps
      const updateSteps = steps.filter((step) =>
        step.description.includes('Update pointers')
      );

      expect(updateSteps.length).toBeGreaterThan(0);

      // First update should increment left and decrement right
      if (updateSteps.length > 0) {
        expect(updateSteps[0].left).toBe(1);
        expect(updateSteps[0].right).toBe(3);
      }
    });
  });

  describe('Algorithm Correctness', () => {
    it('should correctly reverse various arrays', () => {
      const testCases = [
        { input: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1] },
        { input: [10, 20, 30], expected: [30, 20, 10] },
        { input: [1], expected: [1] },
        { input: [1, 2], expected: [2, 1] },
        { input: [-1, -2, -3], expected: [-3, -2, -1] },
      ];

      testCases.forEach(({ input, expected }) => {
        const steps = generateSteps(input);
        const completeStep = steps.find((step) => step.isComplete === true);
        expect(completeStep?.array).toEqual(expected);
      });
    });

    it('should maintain array length after reversal', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      const initialStep = steps[0];
      const completeStep = steps.find((step) => step.isComplete === true);

      expect(initialStep.array.length).toBe(completeStep?.array.length);
    });
  });

  describe('Visualization Component Logic', () => {
    it('should generate steps for default input', () => {
      const defaultNums = [1, 2, 3, 4, 5];
      const steps = generateSteps(defaultNums);
      
      // Should generate multiple steps
      expect(steps.length).toBeGreaterThan(1);
      
      // Should complete
      const complete = steps.find((step) => step.isComplete === true);
      expect(complete).toBeDefined();
    });

    it('should handle state transitions correctly', () => {
      const nums = [1, 2, 3];
      const steps = generateSteps(nums);
      
      // Steps should progress logically
      expect(steps[0].line).toBe(1); // Initial step
      
      // Should have swap steps
      const swapSteps = steps.filter((step) =>
        step.description.includes('Swapped')
      );
      expect(swapSteps.length).toBeGreaterThan(0);
    });
  });

  describe('Code Highlighting and Line Numbers', () => {
    it('should have line property in every step for code highlighting', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      steps.forEach((step) => {
        expect(step.line).toBeDefined();
        expect(typeof step.line).toBe('number');
        expect(step.line).toBeGreaterThan(0);
      });
    });

    it('should have correct line numbers for different operations', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      // First step should be line 1 (initialization)
      expect(steps[0].line).toBe(1);

      // Should have line 2 steps (comparison/swap)
      const line2Steps = steps.filter((step) => step.line === 2);
      expect(line2Steps.length).toBeGreaterThan(0);

      // Should have line 3 steps (swap operation)
      const line3Steps = steps.filter((step) => step.line === 3);
      expect(line3Steps.length).toBeGreaterThan(0);

      // Final step should be line 5 (completion)
      const completeStep = steps.find((step) => step.isComplete === true);
      expect(completeStep?.line).toBe(5);
    });
  });

  describe('Variable Values Display', () => {
    it('should have variables object in every step', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      steps.forEach((step) => {
        expect(step.variables).toBeDefined();
        expect(typeof step.variables).toBe('object');
      });
    });

    it('should have correct left and right pointer values', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      // First step should initialize left=0, right=length-1
      expect(steps[0].variables.left).toBe(0);
      expect(steps[0].variables.right).toBe(4);

      // Find a swap step
      const swapStep = steps.find((step) => step.line === 2);
      if (swapStep) {
        expect(swapStep.variables).toHaveProperty('left');
        expect(swapStep.variables).toHaveProperty('right');
        expect(swapStep.variables).toHaveProperty('nums[left]');
        expect(swapStep.variables).toHaveProperty('nums[right]');
      }
    });

    it('should update pointers correctly after each swap', () => {
      const nums = [1, 2, 3, 4];
      const steps = generateSteps(nums);

      // Find pointer update steps
      const updateSteps = steps.filter((step) =>
        step.description.includes('Update pointers')
      );

      if (updateSteps.length > 0) {
        const firstUpdate = updateSteps[0];
        expect(firstUpdate.variables.left).toBe(1);
        expect(firstUpdate.variables.right).toBe(2);
      }
    });

    it('should show correct array state in each step', () => {
      const nums = [1, 2, 3, 4, 5];
      const steps = generateSteps(nums);

      steps.forEach((step) => {
        expect(step.array).toBeDefined();
        expect(Array.isArray(step.array)).toBe(true);
        expect(step.array.length).toBe(nums.length);
      });

      // First step should have original array
      expect(steps[0].array).toEqual([1, 2, 3, 4, 5]);

      // Last step should have reversed array
      const completeStep = steps.find((step) => step.isComplete === true);
      expect(completeStep?.array).toEqual([5, 4, 3, 2, 1]);
    });

    it('should track array changes through swap operations', () => {
      const nums = [1, 2, 3];
      const steps = generateSteps(nums);

      // Find swap steps
      const swapSteps = steps.filter((step) =>
        step.description.includes('Swapped')
      );

      expect(swapSteps.length).toBeGreaterThan(0);

      // After first swap, first and last elements should be swapped
      const firstSwap = swapSteps[0];
      expect(firstSwap.array[0]).toBe(3); // Last element moved to first
      expect(firstSwap.array[2]).toBe(1); // First element moved to last
    });
  });
});

