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
    "C++": string;
    JavaScript: string;
  };
  explanation: {
    approach: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
  };
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  hasVisualization: boolean;
}

export const questionsData: Record<number, QuestionData> = {
  1: {
    id: 1,
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
      "C++": `vector<int> twoSum(vector<int>& nums, int target) {
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
    tags: ["Array", "Hash Table"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  2: {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation:
          "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
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
      "C++": `int maxProfit(vector<int>& prices) {
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
      approach:
        "Keep track of the minimum price seen so far and the maximum profit. For each day, update the minimum price if current price is lower, or update maximum profit if selling today would yield more profit.",
      steps: [
        "Initialize minPrice to a very large value and maxProfit to 0.",
        "Iterate through each price in the array.",
        "If current price is less than minPrice, update minPrice.",
        "Otherwise, calculate profit = price - minPrice.",
        "If profit is greater than maxProfit, update maxProfit.",
        "Return maxProfit after processing all prices.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Dynamic Programming"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  8: {
    id: 8,
    title: "Contains Duplicate",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
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
      "C++": `bool containsDuplicate(vector<int>& nums) {
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
      approach:
        "Use a hash set to keep track of numbers we have seen. As we iterate through the array, if we encounter a number that already exists in the set, we have found a duplicate and return true. Otherwise, we add the number to the set and continue.",
      steps: [
        "Initialize an empty hash set to store seen numbers.",
        "Iterate through each number in the array.",
        "For each number, check if it exists in the set.",
        "If it exists, return true (duplicate found).",
        "Otherwise, add the number to the set.",
        "If we finish iterating without finding duplicates, return false.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
    tags: ["Array", "Hash Table", "Sorting"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  9: {
    id: 9,
    title: "Find Maximum and Minimum Element in an Array",
    description:
      "Given an array of integers, find the maximum and minimum elements in the array.\n\nReturn the maximum and minimum values.",
    examples: [
      {
        input: "nums = [3, 5, 1, 8, 2, 9, 4]",
        output: "Maximum: 9, Minimum: 1",
        explanation: "The maximum value is 9 and the minimum value is 1.",
      },
      {
        input: "nums = [10, 20, 30]",
        output: "Maximum: 30, Minimum: 10",
      },
      {
        input: "nums = [5]",
        output: "Maximum: 5, Minimum: 5",
        explanation:
          "When there is only one element, it is both maximum and minimum.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
    codes: {
      Python: `def findMaxMin(nums):
    if not nums:
        return None, None
    maxVal = nums[0]
    minVal = nums[0]
    for num in nums:
        if num > maxVal:
            maxVal = num
        if num < minVal:
            minVal = num
    return maxVal, minVal`,
      Java: `public int[] findMaxMin(int[] nums) {
    if (nums.length == 0) {
        return new int[]{};
    }
    int maxVal = nums[0];
    int minVal = nums[0];
    for (int num : nums) {
        if (num > maxVal) {
            maxVal = num;
        }
        if (num < minVal) {
            minVal = num;
        }
    }
    return new int[]{maxVal, minVal};
}`,
      "C++": `pair<int, int> findMaxMin(vector<int>& nums) {
    if (nums.empty()) {
        return {0, 0};
    }
    int maxVal = nums[0];
    int minVal = nums[0];
    for (int num : nums) {
        if (num > maxVal) {
            maxVal = num;
        }
        if (num < minVal) {
            minVal = num;
        }
    }
    return {maxVal, minVal};
}`,
      JavaScript: `function findMaxMin(nums) {
    if (nums.length === 0) {
        return [null, null];
    }
    let maxVal = nums[0];
    let minVal = nums[0];
    for (let num of nums) {
        if (num > maxVal) {
            maxVal = num;
        }
        if (num < minVal) {
            minVal = num;
        }
    }
    return [maxVal, minVal];
}`,
    },
    explanation: {
      approach:
        "Initialize maxVal and minVal with the first element. Iterate through the array, updating maxVal when we find a larger value and minVal when we find a smaller value.",
      steps: [
        "Check if the array is empty. If so, return appropriate values.",
        "Initialize maxVal and minVal with the first element of the array.",
        "Iterate through each element in the array.",
        "For each element, compare it with maxVal. If it is greater, update maxVal.",
        "Compare the element with minVal. If it is smaller, update minVal.",
        "After processing all elements, return maxVal and minVal.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  10: {
    id: 10,
    title: "Reverse Array",
    description:
      "Given an array of integers, reverse the array in-place.\n\nYou must modify the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: "nums = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The array is reversed in-place.",
      },
      {
        input: "nums = [1,2]",
        output: "[2,1]",
      },
      {
        input: "nums = [1]",
        output: "[1]",
        explanation: "Single element array remains unchanged.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
    codes: {
      Python: `def reverseArray(nums):
    left = 0
    right = len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,
      Java: `public void reverseArray(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        left++;
        right--;
    }
}`,
      "C++": `void reverseArray(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    while (left < right) {
        swap(nums[left], nums[right]);
        left++;
        right--;
    }
}`,
      JavaScript: `function reverseArray(nums) {
    let left = 0;
    let right = nums.length - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
}`,
    },
    explanation: {
      approach:
        "Use two pointers technique: one starting from the beginning (left) and one from the end (right). Swap elements at these positions and move both pointers towards the center until they meet.",
      steps: [
        "Initialize two pointers: left = 0 and right = nums.length - 1.",
        "While left < right, swap elements at positions left and right.",
        "Increment left pointer and decrement right pointer.",
        "Continue until left >= right.",
        "The array is now reversed in-place.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Two Pointers"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  11: {
    id: 11,
    title: "Find the Kth Max and Min Element of an Array",
    description:
      "Given an array of integers and a value K, find the Kth largest and Kth smallest elements in the array.\n\nReturn both the Kth maximum and Kth minimum values.",
    examples: [
      {
        input: "nums = [7, 10, 4, 3, 20, 15], K = 3",
        output: "Kth Maximum: 10, Kth Minimum: 7",
        explanation:
          "Sorted array: [3, 4, 7, 10, 15, 20]. 3rd smallest is 7 (index 2), 3rd largest is 10 (index 3).",
      },
      {
        input: "nums = [1, 2, 3, 4, 5], K = 2",
        output: "Kth Maximum: 4, Kth Minimum: 2",
        explanation:
          "Sorted array: [1, 2, 3, 4, 5]. 2nd smallest is 2 (index 1), 2nd largest is 4 (index 3).",
      },
      {
        input: "nums = [5], K = 1",
        output: "Kth Maximum: 5, Kth Minimum: 5",
        explanation:
          "When there is only one element, it is both the 1st maximum and 1st minimum.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "1 ≤ K ≤ nums.length",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
    ],
    codes: {
      Python: `def findKthMaxMin(nums, k):
    if not nums or k < 1 or k > len(nums):
        return None, None
    
    sorted_nums = sorted(nums)
    kth_min = sorted_nums[k - 1]
    kth_max = sorted_nums[len(nums) - k]
    
    return kth_max, kth_min`,
      Java: `public int[] findKthMaxMin(int[] nums, int k) {
    if (nums.length == 0 || k < 1 || k > nums.length) {
        return new int[]{};
    }
    
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    int kthMin = sorted[k - 1];
    int kthMax = sorted[nums.length - k];
    
    return new int[]{kthMax, kthMin};
}`,
      "C++": `pair<int, int> findKthMaxMin(vector<int>& nums, int k) {
    if (nums.empty() || k < 1 || k > nums.size()) {
        return {0, 0};
    }
    
    vector<int> sorted = nums;
    sort(sorted.begin(), sorted.end());
    int kthMin = sorted[k - 1];
    int kthMax = sorted[nums.size() - k];
    
    return {kthMax, kthMin};
}`,
      JavaScript: `function findKthMaxMin(nums, k) {
    if (nums.length === 0 || k < 1 || k > nums.length) {
        return [null, null];
    }
    
    const sorted = [...nums].sort((a, b) => a - b);
    const kthMin = sorted[k - 1];
    const kthMax = sorted[nums.length - k];
    
    return [kthMax, kthMin];
}`,
    },
    explanation: {
      approach:
        "Sort the array in ascending order. The Kth minimum element is at index (K-1) in the sorted array, and the Kth maximum element is at index (n-K) in the sorted array, where n is the length of the array.",
      steps: [
        "Check if the array is empty or K is out of valid range (1 to array length).",
        "Sort the array in ascending order.",
        "Find Kth minimum: Access element at index (K-1) in the sorted array.",
        "Find Kth maximum: Access element at index (n-K) in the sorted array, where n is the array length.",
        "Return both Kth maximum and Kth minimum values.",
      ],
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
    },
    tags: ["Array", "Sorting"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  12: {
    id: 12,
    title: "Sort an array of 0s, 1s and 2s",
    description:
      "Given an array nums containing only 0s, 1s, and 2s, sort the array in-place without using any sorting algorithm.\n\nYou must solve this problem without using the library's sort function.",
    examples: [
      {
        input: "nums = [2,0,2,1,1,0]",
        output: "[0,0,1,1,2,2]",
        explanation:
          "The array is sorted so all 0s come first, followed by 1s, then 2s.",
      },
      {
        input: "nums = [2,0,1]",
        output: "[0,1,2]",
      },
      {
        input: "nums = [0]",
        output: "[0]",
        explanation: "Single element array is already sorted.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 300", "nums[i] is either 0, 1, or 2."],
    codes: {
      Python: `def sortColors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
      Java: `public void sortColors(int[] nums) {
    int low = 0;
    int mid = 0;
    int high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            int temp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = temp;
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int temp = nums[mid];
            nums[mid] = nums[high];
            nums[high] = temp;
            high--;
        }
    }
}`,
      "C++": `void sortColors(vector<int>& nums) {
    int low = 0;
    int mid = 0;
    int high = nums.size() - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`,
      JavaScript: `function sortColors(nums) {
    let low = 0;
    let mid = 0;
    let high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            mid++;
        } else {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        }
    }
}`,
    },
    explanation: {
      approach:
        "Use the Dutch National Flag algorithm with three pointers: low (for 0s), mid (for 1s), and high (for 2s). Partition the array by swapping elements based on their values.",
      steps: [
        "Initialize three pointers: low = 0, mid = 0, high = n-1.",
        "While mid <= high, check the value at nums[mid].",
        "If nums[mid] == 0: swap with nums[low], increment both low and mid.",
        "If nums[mid] == 1: increment mid (leave it in place).",
        "If nums[mid] == 2: swap with nums[high], decrement high.",
        "Continue until mid > high. The array is now sorted.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Two Pointers", "Sorting"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
};
