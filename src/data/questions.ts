// Question data for Easy Array questions with visualizations

export interface QuestionData {
  id: number;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  codes: {
    Python: string;
    Java: string;
    'C++': string;
    JavaScript: string;
  };
  explanation: {
    approach: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
  };
  tags: string[];
  hasVisualization: boolean;
}

export const questionsData: Record<number, QuestionData> = {
  1: {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    codes: {
      Python: `def twoSum(nums, target):
    numMap = {}
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in numMap:
            return [numMap[complement], i]
        numMap[nums[i]] = i
    return []`,
      Java: `public int[] twoSum(int[] nums, int target) {
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
      'C++': `vector<int> twoSum(vector<int>& nums, int target) {
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
      JavaScript: `function twoSum(nums, target) {
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
      approach: 'Use a hash map to store each number and its index as we iterate through the array. For each number, check if its complement (target - current number) exists in the map. If found, return the indices.',
      steps: [
        'Initialize an empty hash map to store number-index pairs.',
        'Iterate through the array with index i.',
        'For each element nums[i], calculate complement = target - nums[i].',
        'Check if complement exists in the hash map.',
        'If found, return [map[complement], i].',
        'Otherwise, add nums[i] to the map with index i.',
        'Continue until a solution is found.',
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    tags: ['Array', 'Hash Table'],
    hasVisualization: true,
  },
  2: {
    id: 2,
    title: 'Best Time to Buy and Sell Stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.',
      },
    ],
    constraints: [
      '1 ≤ prices.length ≤ 10⁵',
      '0 ≤ prices[i] ≤ 10⁴',
    ],
    codes: {
      Python: `def maxProfit(prices):
    minPrice = float('inf')
    maxProfit = 0
    for price in prices:
        if price < minPrice:
            minPrice = price
        elif price - minPrice > maxProfit:
            maxProfit = price - minPrice
    return maxProfit`,
      Java: `public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
      'C++': `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
      JavaScript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    return maxProfit;
}`,
    },
    explanation: {
      approach: 'Keep track of the minimum price seen so far and the maximum profit. For each day, update the minimum price if current price is lower, or update maximum profit if selling today would yield more profit.',
      steps: [
        'Initialize minPrice to a very large value and maxProfit to 0.',
        'Iterate through each price in the array.',
        'If current price is less than minPrice, update minPrice.',
        'Otherwise, calculate profit = price - minPrice.',
        'If profit is greater than maxProfit, update maxProfit.',
        'Return maxProfit after processing all prices.',
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    tags: ['Array', 'Dynamic Programming'],
    hasVisualization: true,
  },
  8: {
    id: 8,
    title: 'Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
      },
      {
        input: 'nums = [1,1,1,3,3,4,3,2,4,2]',
        output: 'true',
      },
    ],
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
    ],
    codes: {
      Python: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      Java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,
      'C++': `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    return false;
}`,
      JavaScript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,
    },
    explanation: {
      approach: 'Use a hash set to keep track of numbers we have seen. As we iterate through the array, if we encounter a number that already exists in the set, we have found a duplicate and return true. Otherwise, we add the number to the set and continue.',
      steps: [
        'Initialize an empty hash set to store seen numbers.',
        'Iterate through each number in the array.',
        'For each number, check if it exists in the set.',
        'If it exists, return true (duplicate found).',
        'Otherwise, add the number to the set.',
        'If we finish iterating without finding duplicates, return false.',
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    tags: ['Array', 'Hash Table', 'Sorting'],
    hasVisualization: true,
  },
};

