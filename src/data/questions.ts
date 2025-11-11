// Question data for Easy Array questions with visualizations
// Import the type from types/index.ts to maintain single source of truth
import { QuestionData } from '../types';
import { Difficulty, Topic, Tag, Language } from '../constants/enums';

// Re-export for convenience
export type { QuestionData };

// Questions are keyed by LeetCode number
// id must always equal leetcodeNumber
// slug is used in URLs: /problems/two-sum/description
export const questionsData: Record<number, QuestionData> = {
  1: {
    id: 1, // Must match leetcodeNumber
    slug: "two-sum", // URL slug
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    codes: {
      [Language.PYTHON]: `def twoSum(nums, target):
    numMap = {}
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in numMap:
            return [numMap[complement], i]
        numMap[nums[i]] = i
    return []`,
      [Language.JAVA]: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (numMap.containsKey(complement)) {
            return new int[]{numMap.get(complement), i};
        }
        numMap.put(nums[i], i);
    }
    return new int[]{};
}`,
      [Language.CPP]: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}`,
      [Language.JAVASCRIPT]: `function twoSum(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
}`,
    },
    explanation: {
      approach:
        "Use a hash map to store each number and its index as we iterate through the array. For each number, check if its complement (target - current number) exists in the map. If found, return the indices.",
      steps: [
        "Initialize an empty hash map to store number-index pairs.",
        "Iterate through the array with index i.",
        "For each element nums[i], calculate complement = target - nums[i].",
        "Check if complement exists in the hash map.",
        "If found, return [map[complement], i].",
        "Otherwise, add nums[i] to the map with index i.",
        "Continue until a solution is found.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
    tags: [Tag.ARRAY, Tag.HASH_TABLE],
    difficulty: Difficulty.EASY,
    topic: Topic.ARRAYS,
    leetcodeNumber: 1,
    hasVisualization: true,
    defaultInput: {
      nums: [2, 7, 11, 15],
      target: 9,
    },
    lineMappings: {
      [Language.PYTHON]: {
        // Step 1: Initialize empty hash map to store number-index pairs
        1: 2, // numMap = {}
        // Step 2: Iterate through the array with index i
        2: 3, // for i in range(len(nums)):
        // Step 3: Calculate complement (target - current number)
        3: 4, // complement = target - nums[i]
        // Step 4: Check if complement exists in the hash map
        4: 5, // if complement in numMap:
        // Step 5: Add current number to map with its index
        5: 7, // numMap[nums[i]] = i
        // Step 6: Return statement when solution found
        6: 6, // return [numMap[complement], i]
      },
      [Language.JAVA]: {
        // Step 1: Initialize empty hash map to store number-index pairs
        1: 2, // Map<Integer, Integer> numMap = new HashMap<>();
        // Step 2: Iterate through the array with index i
        2: 3, // for (int i = 0; i < nums.length; i++) {
        // Step 3: Calculate complement (target - current number)
        3: 4, // int complement = target - nums[i];
        // Step 4: Check if complement exists in the hash map
        4: 5, // if (numMap.containsKey(complement)) {
        // Step 5: Add current number to map with its index
        5: 6, // numMap.put(nums[i], i);
        // Step 6: Return statement when solution found
        6: 6, // return new int[]{numMap.get(complement), i};
      },
      [Language.CPP]: {
        // Step 1: Initialize empty hash map to store number-index pairs
        1: 2, // unordered_map<int, int> numMap;
        // Step 2: Iterate through the array with index i
        2: 3, // for (int i = 0; i < nums.size(); i++) {
        // Step 3: Calculate complement (target - current number)
        3: 4, // int complement = target - nums[i];
        // Step 4: Check if complement exists in the hash map
        4: 5, // if (numMap.find(complement) != numMap.end()) {
        // Step 5: Add current number to map with its index
        5: 7, // numMap[nums[i]] = i;
        // Step 6: Return statement when solution found
        6: 6, // return {numMap[complement], i};
      },
      [Language.JAVASCRIPT]: {
        // Step 1: Initialize empty hash map to store number-index pairs
        1: 2, // const numMap = new Map();
        // Step 2: Iterate through the array with index i
        2: 3, // for (let i = 0; i < nums.length; i++) {
        // Step 3: Calculate complement (target - current number)
        3: 4, // const complement = target - nums[i];
        // Step 4: Check if complement exists in the hash map
        4: 5, // if (numMap.has(complement)) {
        // Step 5: Add current number to map with its index
        5: 7, // numMap.set(nums[i], i);
        // Step 6: Return statement when solution found
        6: 6, // return [numMap.get(complement), i];
      },
    },
  },
};
