import { describe, it, expect } from 'vitest';

// Example utility functions to test
export const twoSum = (nums: number[], target: number): number[] => {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
};

export const reverseArray = (arr: number[]): number[] => {
  return arr.reverse();
};

describe('Array Utility Functions', () => {
  describe('twoSum', () => {
    it('should return correct indices for valid input', () => {
      const result = twoSum([2, 7, 11, 15], 9);
      expect(result).toEqual([0, 1]);
    });

    it('should return correct indices for different input', () => {
      const result = twoSum([3, 2, 4], 6);
      expect(result).toEqual([1, 2]);
    });

    it('should return empty array if no solution exists', () => {
      const result = twoSum([1, 2, 3], 10);
      expect(result).toEqual([]);
    });

    it('should handle duplicate numbers', () => {
      const result = twoSum([3, 3], 6);
      expect(result).toEqual([0, 1]);
    });
  });

  describe('reverseArray', () => {
    it('should reverse an array correctly', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = reverseArray([...arr]);
      expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it('should handle empty array', () => {
      const result = reverseArray([]);
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = reverseArray([1]);
      expect(result).toEqual([1]);
    });
  });
});

