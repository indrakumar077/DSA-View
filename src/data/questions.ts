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
};
