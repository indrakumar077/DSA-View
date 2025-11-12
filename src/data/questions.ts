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
  121: {
    id: 121, // Must match leetcodeNumber
    slug: "best-time-to-buy-and-sell-stock", // URL slug
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: [
      "1 ≤ prices.length ≤ 10⁵",
      "0 ≤ prices[i] ≤ 10⁴",
    ],
    codes: {
      [Language.PYTHON]: `def maxProfit(prices):
    minPrice = float('inf')
    maxProfit = 0
    for i in range(len(prices)):
        if prices[i] < minPrice:
            minPrice = prices[i]
        profit = prices[i] - minPrice
        if profit > maxProfit:
            maxProfit = profit
    return maxProfit`,
      [Language.JAVA]: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        }
        int profit = prices[i] - minPrice;
        if (profit > maxProfit) {
            maxProfit = profit;
        }
    }
    return maxProfit;
}`,
      [Language.CPP]: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    for (int i = 0; i < prices.size(); i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        }
        int profit = prices[i] - minPrice;
        if (profit > maxProfit) {
            maxProfit = profit;
        }
    }
    return maxProfit;
}`,
      [Language.JAVASCRIPT]: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        }
        const profit = prices[i] - minPrice;
        if (profit > maxProfit) {
            maxProfit = profit;
        }
    }
    return maxProfit;
}`,
    },
    explanation: {
      approach:
        "Keep track of the minimum price seen so far and the maximum profit. For each day, update the minimum price if the current price is lower, and calculate the profit if we sell today. Update max profit if current profit is greater.",
      steps: [
        "Initialize minPrice to a very large value and maxProfit to 0.",
        "Iterate through each day's price.",
        "If current price is less than minPrice, update minPrice.",
        "Calculate profit = current price - minPrice.",
        "If profit is greater than maxProfit, update maxProfit.",
        "Return maxProfit after processing all days.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: [Tag.ARRAY, Tag.DYNAMIC_PROGRAMMING],
    difficulty: Difficulty.EASY,
    topic: Topic.ARRAYS,
    leetcodeNumber: 121,
    hasVisualization: true,
    defaultInput: {
      prices: [7, 1, 5, 3, 6, 4],
    },
    lineMappings: {
      [Language.PYTHON]: {
        // Step 1: Initialize minPrice and maxProfit
        1: 2, // minPrice = float('inf')
        2: 3, // maxProfit = 0
        // Step 2: Iterate through prices
        3: 4, // for i in range(len(prices)):
        // Step 3: Check if current price is less than minPrice
        4: 5, // if prices[i] < minPrice:
        5: 6, // minPrice = prices[i]
        // Step 4: Calculate profit
        6: 7, // profit = prices[i] - minPrice
        // Step 5: Check if profit is greater than maxProfit
        7: 8, // if profit > maxProfit:
        8: 9, // maxProfit = profit
        // Step 6: Return maxProfit
        9: 10, // return maxProfit
      },
      [Language.JAVA]: {
        // Step 1: Initialize minPrice and maxProfit
        1: 2, // int minPrice = Integer.MAX_VALUE;
        2: 3, // int maxProfit = 0;
        // Step 2: Iterate through prices
        3: 4, // for (int i = 0; i < prices.length; i++) {
        // Step 3: Check if current price is less than minPrice
        4: 5, // if (prices[i] < minPrice) {
        5: 6, // minPrice = prices[i];
        // Step 4: Calculate profit
        6: 7, // int profit = prices[i] - minPrice;
        // Step 5: Check if profit is greater than maxProfit
        7: 8, // if (profit > maxProfit) {
        8: 9, // maxProfit = profit;
        // Step 6: Return maxProfit
        9: 11, // return maxProfit;
      },
      [Language.CPP]: {
        // Step 1: Initialize minPrice and maxProfit
        1: 2, // int minPrice = INT_MAX;
        2: 3, // int maxProfit = 0;
        // Step 2: Iterate through prices
        3: 4, // for (int i = 0; i < prices.size(); i++) {
        // Step 3: Check if current price is less than minPrice
        4: 5, // if (prices[i] < minPrice) {
        5: 6, // minPrice = prices[i];
        // Step 4: Calculate profit
        6: 7, // int profit = prices[i] - minPrice;
        // Step 5: Check if profit is greater than maxProfit
        7: 8, // if (profit > maxProfit) {
        8: 9, // maxProfit = profit;
        // Step 6: Return maxProfit
        9: 11, // return maxProfit;
      },
      [Language.JAVASCRIPT]: {
        // Step 1: Initialize minPrice and maxProfit
        1: 2, // let minPrice = Infinity;
        2: 3, // let maxProfit = 0;
        // Step 2: Iterate through prices
        3: 4, // for (let i = 0; i < prices.length; i++) {
        // Step 3: Check if current price is less than minPrice
        4: 5, // if (prices[i] < minPrice) {
        5: 6, // minPrice = prices[i];
        // Step 4: Calculate profit
        6: 7, // const profit = prices[i] - minPrice;
        // Step 5: Check if profit is greater than maxProfit
        7: 8, // if (profit > maxProfit) {
        8: 9, // maxProfit = profit;
        // Step 6: Return maxProfit
        9: 10, // return maxProfit;
      },
    },
  },
  42: {
    id: 42, // Must match leetcodeNumber
    slug: "trapping-rain-water", // URL slug
    title: "Trapping Rain Water",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nWater can only be trapped between bars if there are bars on both sides that are taller than the current bar.",
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
      },
    ],
    constraints: [
      "n == height.length",
      "1 ≤ n ≤ 2 * 10⁴",
      "0 ≤ height[i] ≤ 10⁵",
    ],
    codes: {
      [Language.PYTHON]: `def trap(height):
    if not height:
        return 0
    
    left, right = 0, len(height) - 1
    maxLeft, maxRight = 0, 0
    totalWater = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= maxLeft:
                maxLeft = height[left]
            else:
                totalWater += maxLeft - height[left]
            left += 1
        else:
            if height[right] >= maxRight:
                maxRight = height[right]
            else:
                totalWater += maxRight - height[right]
            right -= 1
    
    return totalWater`,
      [Language.JAVA]: `public int trap(int[] height) {
    if (height.length == 0) {
        return 0;
    }
    
    int left = 0, right = height.length - 1;
    int maxLeft = 0, maxRight = 0;
    int totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                totalWater += maxLeft - height[left];
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                totalWater += maxRight - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}`,
      [Language.CPP]: `int trap(vector<int>& height) {
    if (height.empty()) {
        return 0;
    }
    
    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0;
    int totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                totalWater += maxLeft - height[left];
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                totalWater += maxRight - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}`,
      [Language.JAVASCRIPT]: `function trap(height) {
    if (height.length === 0) {
        return 0;
    }
    
    let left = 0, right = height.length - 1;
    let maxLeft = 0, maxRight = 0;
    let totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                totalWater += maxLeft - height[left];
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                totalWater += maxRight - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}`,
    },
    explanation: {
      approach:
        "Use the two-pointer technique. Start with pointers at both ends. At each step, process the side with the smaller height. Track the maximum height seen from each side. The water trapped at a position equals the minimum of the max heights on both sides minus the current height.",
      steps: [
        "Initialize two pointers: left at start (0) and right at end (n-1).",
        "Initialize maxLeft and maxRight to track maximum heights from each side.",
        "While left < right, compare heights at both pointers.",
        "If height[left] < height[right], process the left side:",
        "  - If current height >= maxLeft, update maxLeft.",
        "  - Otherwise, add trapped water (maxLeft - height[left]) and move left pointer.",
        "If height[left] >= height[right], process the right side:",
        "  - If current height >= maxRight, update maxRight.",
        "  - Otherwise, add trapped water (maxRight - height[right]) and move right pointer.",
        "Return totalWater when pointers meet.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: [Tag.ARRAY, Tag.TWO_POINTERS, Tag.DYNAMIC_PROGRAMMING, Tag.STACK],
    difficulty: Difficulty.HARD,
    topic: Topic.ARRAYS,
    leetcodeNumber: 42,
    hasVisualization: true,
    defaultInput: {
      height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    },
    lineMappings: {
      [Language.PYTHON]: {
        // Step 1: Check if array is empty
        1: 2, // if not height:
        // Step 2: Initialize pointers and variables
        2: 4, // left, right = 0, len(height) - 1
        3: 5, // maxLeft, maxRight = 0, 0
        4: 6, // totalWater = 0
        // Step 3: Main loop condition
        5: 8, // while left < right:
        // Step 4: Compare heights
        6: 9, // if height[left] < height[right]:
        // Step 5: Process left side - check maxLeft
        7: 10, // if height[left] >= maxLeft:
        8: 11, // maxLeft = height[left]
        // Step 6: Process left side - calculate trapped water
        9: 12, // else: totalWater += maxLeft - height[left]
        10: 13, // left += 1
        // Step 7: Process right side - check maxRight
        11: 15, // if height[right] >= maxRight:
        12: 16, // maxRight = height[right]
        // Step 8: Process right side - calculate trapped water
        13: 17, // else: totalWater += maxRight - height[right]
        14: 18, // right -= 1
        // Step 9: Return result
        15: 20, // return totalWater
      },
      [Language.JAVA]: {
        // Step 1: Check if array is empty
        1: 2, // if (height.length == 0) {
        // Step 2: Initialize pointers and variables
        2: 6, // int left = 0, right = height.length - 1;
        3: 7, // int maxLeft = 0, maxRight = 0;
        4: 8, // int totalWater = 0;
        // Step 3: Main loop condition
        5: 10, // while (left < right) {
        // Step 4: Compare heights
        6: 11, // if (height[left] < height[right]) {
        // Step 5: Process left side - check maxLeft
        7: 12, // if (height[left] >= maxLeft) {
        8: 13, // maxLeft = height[left];
        // Step 6: Process left side - calculate trapped water
        9: 14, // } else { totalWater += maxLeft - height[left]; }
        10: 16, // left++;
        // Step 7: Process right side - check maxRight
        11: 18, // if (height[right] >= maxRight) {
        12: 19, // maxRight = height[right];
        // Step 8: Process right side - calculate trapped water
        13: 20, // } else { totalWater += maxRight - height[right]; }
        14: 22, // right--;
        // Step 9: Return result
        15: 26, // return totalWater;
      },
      [Language.CPP]: {
        // Step 1: Check if array is empty
        1: 2, // if (height.empty()) {
        // Step 2: Initialize pointers and variables
        2: 6, // int left = 0, right = height.size() - 1;
        3: 7, // int maxLeft = 0, maxRight = 0;
        4: 8, // int totalWater = 0;
        // Step 3: Main loop condition
        5: 10, // while (left < right) {
        // Step 4: Compare heights
        6: 11, // if (height[left] < height[right]) {
        // Step 5: Process left side - check maxLeft
        7: 12, // if (height[left] >= maxLeft) {
        8: 13, // maxLeft = height[left];
        // Step 6: Process left side - calculate trapped water
        9: 14, // } else { totalWater += maxLeft - height[left]; }
        10: 16, // left++;
        // Step 7: Process right side - check maxRight
        11: 18, // if (height[right] >= maxRight) {
        12: 19, // maxRight = height[right];
        // Step 8: Process right side - calculate trapped water
        13: 20, // } else { totalWater += maxRight - height[right]; }
        14: 22, // right--;
        // Step 9: Return result
        15: 26, // return totalWater;
      },
      [Language.JAVASCRIPT]: {
        // Step 1: Check if array is empty
        1: 2, // if (height.length === 0) {
        // Step 2: Initialize pointers and variables
        2: 6, // let left = 0, right = height.length - 1;
        3: 7, // let maxLeft = 0, maxRight = 0;
        4: 8, // let totalWater = 0;
        // Step 3: Main loop condition
        5: 10, // while (left < right) {
        // Step 4: Compare heights
        6: 11, // if (height[left] < height[right]) {
        // Step 5: Process left side - check maxLeft
        7: 12, // if (height[left] >= maxLeft) {
        8: 13, // maxLeft = height[left];
        // Step 6: Process left side - calculate trapped water
        9: 14, // } else { totalWater += maxLeft - height[left]; }
        10: 16, // left++;
        // Step 7: Process right side - check maxRight
        11: 18, // if (height[right] >= maxRight) {
        12: 19, // maxRight = height[right];
        // Step 8: Process right side - calculate trapped water
        13: 20, // } else { totalWater += maxRight - height[right]; }
        14: 22, // right--;
        // Step 9: Return result
        15: 24, // return totalWater;
      },
    },
  },
  283: {
    id: 283,
    slug: "move-zeroes",
    title: "Move Zeroes",
    description:
      "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
        explanation: "Move all zeros to the end while maintaining the order of non-zero elements.",
      },
      {
        input: "nums = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
    ],
    codes: {
      [Language.PYTHON]: `def moveZeroes(nums):
    # Two-pointer approach
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1`,
      [Language.JAVA]: `public void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            int temp = nums[write];
            nums[write] = nums[read];
            nums[read] = temp;
            write++;
        }
    }
}`,
      [Language.CPP]: `void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}`,
      [Language.JAVASCRIPT]: `function moveZeroes(nums) {
    let write = 0;
    for (let read = 0; read < nums.length; read++) {
        if (nums[read] !== 0) {
            [nums[write], nums[read]] = [nums[read], nums[write]];
            write++;
        }
    }
}`,
    },
    explanation: {
      approach:
        "Use two pointers: 'read' pointer iterates through the array, and 'write' pointer tracks the position where the next non-zero element should be placed. When we encounter a non-zero element, we swap it with the element at the 'write' position and increment 'write'.",
      steps: [
        "Initialize 'write' pointer at index 0.",
        "Iterate through the array with 'read' pointer.",
        "If nums[read] is non-zero, swap it with nums[write] and increment 'write'.",
        "Continue until all elements are processed.",
        "All zeros will be moved to the end automatically.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: [Tag.ARRAY, Tag.TWO_POINTERS],
    difficulty: Difficulty.EASY,
    topic: Topic.ARRAYS,
    leetcodeNumber: 283,
    hasVisualization: true,
    defaultInput: {
      nums: [0, 1, 0, 3, 12],
    },
    lineMappings: {
      [Language.PYTHON]: {
        1: 2, // write = 0
        2: 3, // for read in range(len(nums)):
        3: 4, // if nums[read] != 0:
        4: 5, // nums[write], nums[read] = nums[read], nums[write]
        5: 6, // write += 1
      },
      [Language.JAVA]: {
        1: 2, // int write = 0;
        2: 3, // for (int read = 0; read < nums.length; read++) {
        3: 4, // if (nums[read] != 0) {
        4: 6, // nums[write] = nums[read];
        5: 7, // write++;
      },
      [Language.CPP]: {
        1: 2, // int write = 0;
        2: 3, // for (int read = 0; read < nums.size(); read++) {
        3: 4, // if (nums[read] != 0) {
        4: 5, // swap(nums[write], nums[read]);
        5: 6, // write++;
      },
      [Language.JAVASCRIPT]: {
        1: 2, // let write = 0;
        2: 3, // for (let read = 0; read < nums.length; read++) {
        3: 4, // if (nums[read] !== 0) {
        4: 5, // [nums[write], nums[read]] = [nums[read], nums[write]];
        5: 6, // write++;
      },
    },
  },
  53: {
    id: 53,
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    codes: {
      [Language.PYTHON]: `def maxSubArray(nums):
    maxSum = nums[0]
    currentSum = nums[0]
    for i in range(1, len(nums)):
        currentSum = max(nums[i], currentSum + nums[i])
        maxSum = max(maxSum, currentSum)
    return maxSum`,
      [Language.JAVA]: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
      [Language.CPP]: `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
      [Language.JAVASCRIPT]: `function maxSubArray(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
    },
    explanation: {
      approach:
        "Use Kadane's algorithm: maintain a running sum and update the maximum sum. For each element, decide whether to start a new subarray or extend the current one.",
      steps: [
        "Initialize maxSum and currentSum with the first element.",
        "Iterate through the array starting from index 1.",
        "For each element, update currentSum to be the maximum of the current element or currentSum + current element.",
        "Update maxSum to be the maximum of maxSum and currentSum.",
        "Return maxSum.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: [Tag.ARRAY, Tag.DYNAMIC_PROGRAMMING, Tag.DIVIDE_AND_CONQUER],
    difficulty: Difficulty.MEDIUM,
    topic: Topic.ARRAYS,
    leetcodeNumber: 53,
    hasVisualization: true,
    defaultInput: {
      nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    },
    lineMappings: {
      [Language.PYTHON]: {
        1: 2, // maxSum = nums[0] and currentSum = nums[0]
        2: 3, // for i in range(1, len(nums)):
        3: 4, // currentSum = max(nums[i], currentSum + nums[i])
        4: 5, // maxSum = max(maxSum, currentSum)
        5: 6, // return maxSum
      },
      [Language.JAVA]: {
        1: 3, // maxSum = nums[0]; currentSum = nums[0];
        2: 4, // for (int i = 1; i < nums.length; i++)
        3: 5, // currentSum = Math.max(nums[i], currentSum + nums[i]);
        4: 6, // maxSum = Math.max(maxSum, currentSum);
        5: 8, // return maxSum;
      },
      [Language.CPP]: {
        1: 3, // maxSum = nums[0]; currentSum = nums[0];
        2: 4, // for (int i = 1; i < nums.size(); i++)
        3: 5, // currentSum = max(nums[i], currentSum + nums[i]);
        4: 6, // maxSum = max(maxSum, currentSum);
        5: 8, // return maxSum;
      },
      [Language.JAVASCRIPT]: {
        1: 3, // maxSum = nums[0]; currentSum = nums[0];
        2: 4, // for (let i = 1; i < nums.length; i++)
        3: 5, // currentSum = Math.max(nums[i], currentSum + nums[i]);
        4: 6, // maxSum = Math.max(maxSum, currentSum);
        5: 8, // return maxSum;
      },
    },
  },
  238: {
    id: 238,
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operator.",
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁵",
      "-30 ≤ nums[i] ≤ 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    codes: {
      [Language.PYTHON]: `def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n
    # Calculate left products
    for i in range(1, n):
        result[i] = result[i-1] * nums[i-1]
    # Calculate right products and multiply
    right = 1
    for i in range(n-1, -1, -1):
        result[i] *= right
        right *= nums[i]
    return result`,
      [Language.JAVA]: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    result[0] = 1;
    // Calculate left products
    for (int i = 1; i < n; i++) {
        result[i] = result[i-1] * nums[i-1];
    }
    // Calculate right products and multiply
    int right = 1;
    for (int i = n-1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    return result;
}`,
      [Language.CPP]: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, 1);
    // Calculate left products
    for (int i = 1; i < n; i++) {
        result[i] = result[i-1] * nums[i-1];
    }
    // Calculate right products and multiply
    int right = 1;
    for (int i = n-1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    return result;
}`,
      [Language.JAVASCRIPT]: `function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    // Calculate left products
    for (let i = 1; i < n; i++) {
        result[i] = result[i-1] * nums[i-1];
    }
    // Calculate right products and multiply
    let right = 1;
    for (let i = n-1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    return result;
}`,
    },
    explanation: {
      approach:
        "Use two passes: first pass calculates left products (product of all elements to the left), second pass calculates right products and multiplies with left products.",
      steps: [
        "Initialize result array with 1s.",
        "First pass: Calculate left products by iterating from left to right.",
        "Second pass: Calculate right products by iterating from right to left and multiply with left products.",
        "Return the result array.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) excluding the output array",
    },
    tags: [Tag.ARRAY, Tag.PREFIX_SUM],
    difficulty: Difficulty.MEDIUM,
    topic: Topic.ARRAYS,
    leetcodeNumber: 238,
    hasVisualization: true,
    defaultInput: {
      nums: [1, 2, 3, 4],
    },
    lineMappings: {
      [Language.PYTHON]: {
        1: 3, // result = [1] * n
        2: 5, // for i in range(1, n):
        3: 6, // result[i] = result[i-1] * nums[i-1]
        4: 8, // right = 1
        5: 9, // for i in range(n-1, -1, -1):
        6: 10, // result[i] *= right
        7: 11, // return result
      },
      [Language.JAVA]: {
        1: 4, // result[0] = 1;
        2: 6, // for (int i = 1; i < n; i++)
        3: 7, // result[i] = result[i-1] * nums[i-1];
        4: 10, // int right = 1;
        5: 11, // for (int i = n-1; i >= 0; i--)
        6: 12, // result[i] *= right;
        7: 15, // return result;
      },
      [Language.CPP]: {
        1: 4, // vector<int> result(n, 1);
        2: 6, // for (int i = 1; i < n; i++)
        3: 7, // result[i] = result[i-1] * nums[i-1];
        4: 10, // int right = 1;
        5: 11, // for (int i = n-1; i >= 0; i--)
        6: 12, // result[i] *= right;
        7: 15, // return result;
      },
      [Language.JAVASCRIPT]: {
        1: 4, // const result = new Array(n).fill(1);
        2: 6, // for (let i = 1; i < n; i++)
        3: 7, // result[i] = result[i-1] * nums[i-1];
        4: 10, // let right = 1;
        5: 11, // for (let i = n-1; i >= 0; i--)
        6: 12, // result[i] *= right;
        7: 15, // return result;
      },
    },
  },
  15: {
    id: 15,
    slug: "3sum",
    title: "3Sum",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.",
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0.",
      },
      {
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only possible triplet sums up to 0.",
      },
    ],
    constraints: [
      "3 ≤ nums.length ≤ 3000",
      "-10⁵ ≤ nums[i] ≤ 10⁵",
    ],
    codes: {
      [Language.PYTHON]: `def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n-2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        left, right = i+1, n-1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result`,
      [Language.JAVA]: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n-2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i+1, right = n-1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++;
                right--;
            } else if (total < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
      [Language.CPP]: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();
    for (int i = 0; i < n-2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i+1, right = n-1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++;
                right--;
            } else if (total < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
      [Language.JAVASCRIPT]: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    const n = nums.length;
    for (let i = 0; i < n-2; i++) {
        if (i > 0 && nums[i] === nums[i-1]) continue;
        let left = i+1, right = n-1;
        while (left < right) {
            const total = nums[i] + nums[left] + nums[right];
            if (total === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left+1]) left++;
                while (left < right && nums[right] === nums[right-1]) right--;
                left++;
                right--;
            } else if (total < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
    },
    explanation: {
      approach:
        "Sort the array first, then use two pointers. For each element, use two pointers to find pairs that sum to the negative of that element, avoiding duplicates.",
      steps: [
        "Sort the array to enable two-pointer technique.",
        "Iterate through the array with index i.",
        "Skip duplicate values for the first element.",
        "Use two pointers (left and right) to find pairs that sum to -nums[i].",
        "When a valid triplet is found, add it to result and skip duplicates.",
        "Adjust pointers based on whether the sum is less than, equal to, or greater than 0.",
      ],
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1) excluding the output array",
    },
    tags: [Tag.ARRAY, Tag.TWO_POINTERS, Tag.SORTING],
    difficulty: Difficulty.MEDIUM,
    topic: Topic.ARRAYS,
    leetcodeNumber: 15,
    hasVisualization: true,
    defaultInput: {
      nums: [-1, 0, 1, 2, -1, -4],
    },
    lineMappings: {
      [Language.PYTHON]: {
        1: 2, // nums.sort()
        2: 5, // if i > 0 and nums[i] == nums[i-1]: continue
        3: 6, // left, right = i+1, n-1
        4: 7, // while left < right:
        5: 8, // total = nums[i] + nums[left] + nums[right]
        6: 10, // result.append([nums[i], nums[left], nums[right]])
        7: 11, // while left < right and nums[left] == nums[left+1]: left += 1
        8: 13, // while left < right and nums[right] == nums[right-1]: right -= 1
        9: 15, // left += 1; right -= 1
        10: 16, // elif total < 0: left += 1
        11: 18, // else: right -= 1
        12: 19, // return result
      },
      [Language.JAVA]: {
        1: 2, // Arrays.sort(nums);
        2: 6, // if (i > 0 && nums[i] == nums[i-1]) continue;
        3: 7, // int left = i+1, right = n-1;
        4: 8, // while (left < right)
        5: 9, // int total = nums[i] + nums[left] + nums[right];
        6: 11, // result.add(Arrays.asList(...));
        7: 12, // while (left < right && nums[left] == nums[left+1]) left++;
        8: 13, // while (left < right && nums[right] == nums[right-1]) right--;
        9: 15, // left++; right--;
        10: 16, // else if (total < 0) left++;
        11: 18, // else right--;
        12: 22, // return result;
      },
      [Language.CPP]: {
        1: 2, // sort(nums.begin(), nums.end());
        2: 6, // if (i > 0 && nums[i] == nums[i-1]) continue;
        3: 7, // int left = i+1, right = n-1;
        4: 8, // while (left < right)
        5: 9, // int total = nums[i] + nums[left] + nums[right];
        6: 11, // result.push_back({...});
        7: 12, // while (left < right && nums[left] == nums[left+1]) left++;
        8: 13, // while (left < right && nums[right] == nums[right-1]) right--;
        9: 15, // left++; right--;
        10: 16, // else if (total < 0) left++;
        11: 18, // else right--;
        12: 21, // return result;
      },
      [Language.JAVASCRIPT]: {
        1: 2, // nums.sort((a, b) => a - b);
        2: 6, // if (i > 0 && nums[i] === nums[i-1]) continue;
        3: 7, // let left = i+1, right = n-1;
        4: 8, // while (left < right)
        5: 9, // const total = nums[i] + nums[left] + nums[right];
        6: 11, // result.push([nums[i], nums[left], nums[right]]);
        7: 12, // while (left < right && nums[left] === nums[left+1]) left++;
        8: 13, // while (left < right && nums[right] === nums[right-1]) right--;
        9: 15, // left++; right--;
        10: 16, // else if (total < 0) left++;
        11: 18, // else right--;
        12: 21, // return result;
      },
    },
  },
};
