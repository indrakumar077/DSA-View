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
  leetcodeNumber?: number;
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
    leetcodeNumber: 1,
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
    leetcodeNumber: 121,
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
    leetcodeNumber: 217,
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
          "Using min-heap for max: Keep 3 largest elements [10, 15, 20], root is 10 (3rd largest). Using max-heap for min: Keep 3 smallest elements [7, 4, 3], root is 7 (3rd smallest).",
      },
      {
        input: "nums = [1, 2, 3, 4, 5], K = 2",
        output: "Kth Maximum: 4, Kth Minimum: 2",
        explanation:
          "Using min-heap for max: Keep 2 largest elements [4, 5], root is 4 (2nd largest). Using max-heap for min: Keep 2 smallest elements [2, 1], root is 2 (2nd smallest).",
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
      Python: `import heapq

def findKthMaxMin(nums, k):
    if not nums or k < 1 or k > len(nums):
        return None, None
    
    # Use min-heap to find Kth maximum (keep k largest elements)
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    kth_max = min_heap[0]
    
    # Use max-heap to find Kth minimum (keep k smallest elements)
    # Python doesn't have max-heap, so we use negative values
    max_heap = []
    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    kth_min = -max_heap[0]
    
    return kth_max, kth_min`,
      Java: `import java.util.PriorityQueue;
import java.util.Collections;

public int[] findKthMaxMin(int[] nums, int k) {
    if (nums.length == 0 || k < 1 || k > nums.length) {
        return new int[]{};
    }
    
    // Use min-heap to find Kth maximum (keep k largest elements)
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    int kthMax = minHeap.peek();
    
    // Use max-heap to find Kth minimum (keep k smallest elements)
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int num : nums) {
        maxHeap.offer(num);
        if (maxHeap.size() > k) {
            maxHeap.poll();
        }
    }
    int kthMin = maxHeap.peek();
    
    return new int[]{kthMax, kthMin};
}`,
      "C++": `#include <queue>
#include <vector>
using namespace std;

pair<int, int> findKthMaxMin(vector<int>& nums, int k) {
    if (nums.empty() || k < 1 || k > nums.size()) {
        return {0, 0};
    }
    
    // Use min-heap to find Kth maximum (keep k largest elements)
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    int kthMax = minHeap.top();
    
    // Use max-heap to find Kth minimum (keep k smallest elements)
    priority_queue<int> maxHeap;
    for (int num : nums) {
        maxHeap.push(num);
        if (maxHeap.size() > k) {
            maxHeap.pop();
        }
    }
    int kthMin = maxHeap.top();
    
    return {kthMax, kthMin};
}`,
      JavaScript: `class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(val) {
        this.heap.push(val);
        this.bubbleUp();
    }
    
    pop() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown();
        }
        return min;
    }
    
    peek() {
        return this.heap[0];
    }
    
    size() {
        return this.heap.length;
    }
    
    bubbleUp() {
        let idx = this.heap.length - 1;
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            if (this.heap[parent] <= this.heap[idx]) break;
            [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
            idx = parent;
        }
    }
    
    sinkDown() {
        let idx = 0;
        while (true) {
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;
            let swap = null;
            
            if (left < this.heap.length && this.heap[left] < this.heap[idx]) {
                swap = left;
            }
            if (right < this.heap.length && 
                (swap === null || this.heap[right] < this.heap[left])) {
                swap = right;
            }
            if (swap === null) break;
            [this.heap[idx], this.heap[swap]] = [this.heap[swap], this.heap[idx]];
            idx = swap;
        }
    }
}

class MaxHeap {
    constructor() {
        this.heap = [];
    }
    
    push(val) {
        this.heap.push(val);
        this.bubbleUp();
    }
    
    pop() {
        const max = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown();
        }
        return max;
    }
    
    peek() {
        return this.heap[0];
    }
    
    size() {
        return this.heap.length;
    }
    
    bubbleUp() {
        let idx = this.heap.length - 1;
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            if (this.heap[parent] >= this.heap[idx]) break;
            [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
            idx = parent;
        }
    }
    
    sinkDown() {
        let idx = 0;
        while (true) {
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;
            let swap = null;
            
            if (left < this.heap.length && this.heap[left] > this.heap[idx]) {
                swap = left;
            }
            if (right < this.heap.length && 
                (swap === null || this.heap[right] > this.heap[left])) {
                swap = right;
            }
            if (swap === null) break;
            [this.heap[idx], this.heap[swap]] = [this.heap[swap], this.heap[idx]];
            idx = swap;
        }
    }
}

function findKthMaxMin(nums, k) {
    if (nums.length === 0 || k < 1 || k > nums.length) {
        return [null, null];
    }
    
    // Use min-heap to find Kth maximum (keep k largest elements)
    const minHeap = new MinHeap();
    for (const num of nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    const kthMax = minHeap.peek();
    
    // Use max-heap to find Kth minimum (keep k smallest elements)
    const maxHeap = new MaxHeap();
    for (const num of nums) {
        maxHeap.push(num);
        if (maxHeap.size() > k) {
            maxHeap.pop();
        }
    }
    const kthMin = maxHeap.peek();
    
    return [kthMax, kthMin];
}`,
    },
    explanation: {
      approach:
        "Use priority queues (heaps) to efficiently find Kth max and min without sorting the entire array. For Kth maximum, maintain a min-heap of size K containing the K largest elements. For Kth minimum, maintain a max-heap of size K containing the K smallest elements. This approach is more efficient when K is much smaller than the array size.",
      steps: [
        "Check if the array is empty or K is out of valid range (1 to array length).",
        "For Kth maximum: Use a min-heap of size K. Iterate through the array, adding elements to the heap. When heap size exceeds K, remove the smallest element. The root of the heap is the Kth maximum.",
        "For Kth minimum: Use a max-heap of size K. Iterate through the array, adding elements to the heap. When heap size exceeds K, remove the largest element. The root of the heap is the Kth minimum.",
        "Return both Kth maximum and Kth minimum values from the heap roots.",
      ],
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)",
    },
    tags: ["Array", "Heap", "Priority Queue"],
    difficulty: "Medium",
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
    leetcodeNumber: 75,
    hasVisualization: true,
  },
  13: {
    id: 13,
    title: "Move all negative numbers to one side",
    description:
      "Given an array of integers, move all negative numbers to one side (left side) and all positive numbers (including zero) to the other side (right side) of the array.\n\nYou must do this in-place without using extra space.",
    examples: [
      {
        input: "nums = [-12, 11, -13, -5, 6, -7, 5, -3, -6]",
        output: "[-12, -13, -5, -7, -3, -6, 11, 6, 5]",
        explanation:
          "All negative numbers are moved to the left side, and all positive numbers are on the right side.",
      },
      {
        input: "nums = [-1, 2, -3, 4, 5, 6, -7, 8, 9]",
        output: "[-1, -3, -7, 2, 4, 5, 6, 8, 9]",
      },
      {
        input: "nums = [1, 2, 3, 4, 5]",
        output: "[1, 2, 3, 4, 5]",
        explanation: "All numbers are positive, so no changes needed.",
      },
      {
        input: "nums = [-1, -2, -3]",
        output: "[-1, -2, -3]",
        explanation: "All numbers are negative, so no changes needed.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "The relative order of negative and positive numbers may not be preserved.",
    ],
    codes: {
      Python: `def moveNegatives(nums):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        if nums[left] < 0:
            left += 1
        elif nums[right] >= 0:
            right -= 1
        else:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    return nums`,
      Java: `public void moveNegatives(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        if (nums[left] < 0) {
            left++;
        } else if (nums[right] >= 0) {
            right--;
        } else {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}`,
      "C++": `void moveNegatives(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left <= right) {
        if (nums[left] < 0) {
            left++;
        } else if (nums[right] >= 0) {
            right--;
        } else {
            swap(nums[left], nums[right]);
            left++;
            right--;
        }
    }
}`,
      JavaScript: `function moveNegatives(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        if (nums[left] < 0) {
            left++;
        } else if (nums[right] >= 0) {
            right--;
        } else {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
            right--;
        }
    }
    
    return nums;
}`,
    },
    explanation: {
      approach:
        "Use the two-pointer technique with partition logic. Start with two pointers: left at the beginning and right at the end. Move left forward when it points to a negative number (already in correct position), move right backward when it points to a positive number (already in correct position), and swap when left points to positive and right points to negative.",
      steps: [
        "Initialize two pointers: left = 0 and right = nums.length - 1.",
        "While left <= right, check the values at both pointers.",
        "If nums[left] < 0: increment left (negative is already on left side).",
        "If nums[right] >= 0: decrement right (positive is already on right side).",
        "Otherwise, swap nums[left] and nums[right], then increment left and decrement right.",
        "Continue until left > right. All negatives will be on the left, positives on the right.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Two Pointers", "Partition"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  14: {
    id: 14,
    title: "Find Union & Intersection of two sorted arrays",
    description:
      "Given two sorted arrays, find the union and intersection of the two arrays.\n\nThe union of two arrays contains all distinct elements from both arrays.\n\nThe intersection of two arrays contains only the common elements present in both arrays.\n\nBoth arrays are already sorted in non-decreasing order.",
    examples: [
      {
        input: "arr1 = [1, 3, 4, 5, 7], arr2 = [2, 3, 5, 6]",
        output: "Union: [1, 2, 3, 4, 5, 6, 7], Intersection: [3, 5]",
        explanation:
          "Union contains all distinct elements: 1, 2, 3, 4, 5, 6, 7. Intersection contains common elements: 3, 5.",
      },
      {
        input: "arr1 = [1, 2, 3, 4, 5], arr2 = [1, 2, 3, 4, 5]",
        output: "Union: [1, 2, 3, 4, 5], Intersection: [1, 2, 3, 4, 5]",
        explanation:
          "Both arrays are identical, so union and intersection are the same.",
      },
      {
        input: "arr1 = [1, 2, 3], arr2 = [4, 5, 6]",
        output: "Union: [1, 2, 3, 4, 5, 6], Intersection: []",
        explanation:
          "No common elements, so intersection is empty. Union contains all elements from both arrays.",
      },
    ],
    constraints: [
      "1 ≤ arr1.length, arr2.length ≤ 10⁵",
      "-10⁹ ≤ arr1[i], arr2[i] ≤ 10⁹",
      "Both arrays are sorted in non-decreasing order.",
    ],
    codes: {
      Python: `def findUnionIntersection(arr1, arr2):
    # Union: All distinct elements from both arrays
    union = []
    i, j = 0, 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            if not union or union[-1] != arr1[i]:
                union.append(arr1[i])
            i += 1
        elif arr2[j] < arr1[i]:
            if not union or union[-1] != arr2[j]:
                union.append(arr2[j])
            j += 1
        else:
            if not union or union[-1] != arr1[i]:
                union.append(arr1[i])
            i += 1
            j += 1
    
    while i < len(arr1):
        if not union or union[-1] != arr1[i]:
            union.append(arr1[i])
        i += 1
    
    while j < len(arr2):
        if not union or union[-1] != arr2[j]:
            union.append(arr2[j])
        j += 1
    
    # Intersection: Common elements in both arrays
    intersection = []
    i, j = 0, 0
    
    while i < len(arr1) and j < len(arr2):
        if arr1[i] < arr2[j]:
            i += 1
        elif arr2[j] < arr1[i]:
            j += 1
        else:
            if not intersection or intersection[-1] != arr1[i]:
                intersection.append(arr1[i])
            i += 1
            j += 1
    
    return union, intersection`,
      Java: `public int[][] findUnionIntersection(int[] arr1, int[] arr2) {
    // Union: All distinct elements from both arrays
    List<Integer> union = new ArrayList<>();
    int i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            if (union.isEmpty() || union.get(union.size() - 1) != arr1[i]) {
                union.add(arr1[i]);
            }
            i++;
        } else if (arr2[j] < arr1[i]) {
            if (union.isEmpty() || union.get(union.size() - 1) != arr2[j]) {
                union.add(arr2[j]);
            }
            j++;
        } else {
            if (union.isEmpty() || union.get(union.size() - 1) != arr1[i]) {
                union.add(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    while (i < arr1.length) {
        if (union.isEmpty() || union.get(union.size() - 1) != arr1[i]) {
            union.add(arr1[i]);
        }
        i++;
    }
    
    while (j < arr2.length) {
        if (union.isEmpty() || union.get(union.size() - 1) != arr2[j]) {
            union.add(arr2[j]);
        }
        j++;
    }
    
    // Intersection: Common elements in both arrays
    List<Integer> intersection = new ArrayList<>();
    i = 0;
    j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            i++;
        } else if (arr2[j] < arr1[i]) {
            j++;
        } else {
            if (intersection.isEmpty() || intersection.get(intersection.size() - 1) != arr1[i]) {
                intersection.add(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    return new int[][]{
        union.stream().mapToInt(x -> x).toArray(),
        intersection.stream().mapToInt(x -> x).toArray()
    };
}`,
      "C++": `pair<vector<int>, vector<int>> findUnionIntersection(vector<int>& arr1, vector<int>& arr2) {
    // Union: All distinct elements from both arrays
    vector<int> union_arr;
    int i = 0, j = 0;
    
    while (i < arr1.size() && j < arr2.size()) {
        if (arr1[i] < arr2[j]) {
            if (union_arr.empty() || union_arr.back() != arr1[i]) {
                union_arr.push_back(arr1[i]);
            }
            i++;
        } else if (arr2[j] < arr1[i]) {
            if (union_arr.empty() || union_arr.back() != arr2[j]) {
                union_arr.push_back(arr2[j]);
            }
            j++;
        } else {
            if (union_arr.empty() || union_arr.back() != arr1[i]) {
                union_arr.push_back(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    while (i < arr1.size()) {
        if (union_arr.empty() || union_arr.back() != arr1[i]) {
            union_arr.push_back(arr1[i]);
        }
        i++;
    }
    
    while (j < arr2.size()) {
        if (union_arr.empty() || union_arr.back() != arr2[j]) {
            union_arr.push_back(arr2[j]);
        }
        j++;
    }
    
    // Intersection: Common elements in both arrays
    vector<int> intersection;
    i = 0;
    j = 0;
    
    while (i < arr1.size() && j < arr2.size()) {
        if (arr1[i] < arr2[j]) {
            i++;
        } else if (arr2[j] < arr1[i]) {
            j++;
        } else {
            if (intersection.empty() || intersection.back() != arr1[i]) {
                intersection.push_back(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    return {union_arr, intersection};
}`,
      JavaScript: `function findUnionIntersection(arr1, arr2) {
    // Union: All distinct elements from both arrays
    const union = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
                union.push(arr1[i]);
            }
            i++;
        } else if (arr2[j] < arr1[i]) {
            if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
                union.push(arr2[j]);
            }
            j++;
        } else {
            if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
                union.push(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    while (i < arr1.length) {
        if (union.length === 0 || union[union.length - 1] !== arr1[i]) {
            union.push(arr1[i]);
        }
        i++;
    }
    
    while (j < arr2.length) {
        if (union.length === 0 || union[union.length - 1] !== arr2[j]) {
            union.push(arr2[j]);
        }
        j++;
    }
    
    // Intersection: Common elements in both arrays
    const intersection = [];
    i = 0;
    j = 0;
    
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            i++;
        } else if (arr2[j] < arr1[i]) {
            j++;
        } else {
            if (intersection.length === 0 || intersection[intersection.length - 1] !== arr1[i]) {
                intersection.push(arr1[i]);
            }
            i++;
            j++;
        }
    }
    
    return [union, intersection];
}`,
    },
    explanation: {
      approach:
        "Use the two-pointer technique since both arrays are sorted. For union: merge both arrays while avoiding duplicates. For intersection: find common elements by comparing elements at both pointers. When elements are equal, add to intersection; otherwise, move the pointer pointing to the smaller element.",
      steps: [
        "Initialize two pointers i = 0 and j = 0 for arr1 and arr2 respectively.",
        "For Union: While both pointers are within bounds, compare arr1[i] and arr2[j].",
        "If arr1[i] < arr2[j]: add arr1[i] to union (if not duplicate) and increment i.",
        "If arr2[j] < arr1[i]: add arr2[j] to union (if not duplicate) and increment j.",
        "If arr1[i] == arr2[j]: add the element to union once (if not duplicate) and increment both pointers.",
        "Add remaining elements from both arrays to union, avoiding duplicates.",
        "For Intersection: Reset pointers and traverse both arrays again.",
        "If arr1[i] < arr2[j]: increment i (element in arr1 is smaller).",
        "If arr2[j] < arr1[i]: increment j (element in arr2 is smaller).",
        "If arr1[i] == arr2[j]: add to intersection (if not duplicate) and increment both pointers.",
        "Return both union and intersection arrays.",
      ],
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(m + n)",
    },
    tags: ["Array", "Two Pointers", "Set"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  15: {
    id: 15,
    title: "Cyclically rotate array by one",
    description:
      "Given an array, cyclically rotate the array clockwise by one.\n\nIn a cyclic rotation, each element is shifted to the right by one position, and the last element becomes the first element.\n\nYou must do this in-place without using extra space.",
    examples: [
      {
        input: "nums = [1, 2, 3, 4, 5]",
        output: "[5, 1, 2, 3, 4]",
        explanation:
          "After rotation: 5 moves to first position, and all other elements shift right by one.",
      },
      {
        input: "nums = [9, 8, 7, 6, 4, 2, 1, 3]",
        output: "[3, 9, 8, 7, 6, 4, 2, 1]",
      },
      {
        input: "nums = [1]",
        output: "[1]",
        explanation: "Array with single element remains unchanged.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "You must modify the array in-place with O(1) extra space.",
    ],
    codes: {
      Python: `def rotate(nums):
    if len(nums) <= 1:
        return
    
    # Store the last element
    last = nums[-1]
    
    # Shift all elements to the right by one
    for i in range(len(nums) - 1, 0, -1):
        nums[i] = nums[i - 1]
    
    # Place the stored element at the first position
    nums[0] = last`,
      Java: `public void rotate(int[] nums) {
    if (nums.length <= 1) {
        return;
    }
    
    // Store the last element
    int last = nums[nums.length - 1];
    
    // Shift all elements to the right by one
    for (int i = nums.length - 1; i > 0; i--) {
        nums[i] = nums[i - 1];
    }
    
    // Place the stored element at the first position
    nums[0] = last;
}`,
      "C++": `void rotate(vector<int>& nums) {
    if (nums.size() <= 1) {
        return;
    }
    
    // Store the last element
    int last = nums[nums.size() - 1];
    
    // Shift all elements to the right by one
    for (int i = nums.size() - 1; i > 0; i--) {
        nums[i] = nums[i - 1];
    }
    
    // Place the stored element at the first position
    nums[0] = last;
}`,
      JavaScript: `function rotate(nums) {
    if (nums.length <= 1) {
        return;
    }
    
    // Store the last element
    const last = nums[nums.length - 1];
    
    // Shift all elements to the right by one
    for (let i = nums.length - 1; i > 0; i--) {
        nums[i] = nums[i - 1];
    }
    
    // Place the stored element at the first position
    nums[0] = last;
}`,
    },
    explanation: {
      approach:
        "The optimized approach stores the last element in a temporary variable, then shifts all elements one position to the right starting from the end. Finally, place the stored element at the first position. This approach uses O(1) extra space and O(n) time.",
      steps: [
        "Check if array length is 0 or 1. If so, return (no rotation needed).",
        "Store the last element (nums[n-1]) in a temporary variable 'last'.",
        "Iterate from the last index to index 1, shifting each element to the right: nums[i] = nums[i-1].",
        "Place the stored 'last' element at index 0: nums[0] = last.",
        "The array is now cyclically rotated by one position clockwise.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Rotation"],
    difficulty: "Easy",
    topic: "Arrays",
    hasVisualization: true,
  },
  16: {
    id: 16,
    title: "Largest sum contiguous Subarray",
    description:
      "Given an array of integers, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nThis problem is solved using Kadane's Algorithm, which efficiently finds the maximum sum subarray in O(n) time.",
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation:
          "The contiguous subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum = 1.",
      },
      {
        input: "nums = [5, 4, -1, 7, 8]",
        output: "23",
        explanation:
          "The contiguous subarray [5, 4, -1, 7, 8] has the largest sum = 23.",
      },
      {
        input: "nums = [-1]",
        output: "-1",
        explanation: "The subarray [-1] has the largest sum = -1.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    codes: {
      Python: `def maxSubArray(nums):
    maxSum = nums[0]
    currentSum = nums[0]
    
    for i in range(1, len(nums)):
        currentSum = max(nums[i], currentSum + nums[i])
        maxSum = max(maxSum, currentSum)
    
    return maxSum`,
      Java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      "C++": `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      JavaScript: `function maxSubArray(nums) {
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
        "Kadane's Algorithm: Maintain two variables - currentSum (maximum sum ending at current position) and maxSum (overall maximum sum). For each element, decide whether to extend the previous subarray or start a new one. If currentSum becomes negative, it's better to start fresh from the current element.",
      steps: [
        "Initialize maxSum and currentSum to the first element of the array.",
        "Iterate through the array starting from index 1.",
        "For each element, update currentSum = max(nums[i], currentSum + nums[i]).",
        "This decides whether to extend the previous subarray or start a new one.",
        "Update maxSum = max(maxSum, currentSum) to track the overall maximum.",
        "Return maxSum after processing all elements.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
    difficulty: "Medium",
    topic: "Arrays",
    leetcodeNumber: 53,
    hasVisualization: true,
  },
  18: {
    id: 18,
    title: "Minimize the Heights II",
    description:
      "Given an array arr[] denoting heights of N towers and a positive integer K, you have to modify the height of each tower either by increasing or decreasing them by K only once. After modifying, height should be a non-negative integer. Find out what could be the possible minimum difference of the height of shortest and longest towers after you have modified each tower.",
    examples: [
      {
        input: "arr = [1, 5, 8, 10], K = 2",
        output: "5",
        explanation:
          "The array can be modified as [3, 3, 6, 8]. The difference between the largest and the smallest is 8-3 = 5.",
      },
      {
        input: "arr = [3, 9, 12, 16, 20], K = 3",
        output: "11",
        explanation:
          "The array can be modified as [6, 6, 9, 13, 17]. The difference between the largest and the smallest is 17-6 = 11.",
      },
    ],
    constraints: ["1 ≤ N ≤ 10⁵", "1 ≤ K ≤ 10⁴", "1 ≤ arr[i] ≤ 10⁵"],
    codes: {
      Python: `def getMinDiff(arr, k):
    n = len(arr)
    arr.sort()
    
    ans = arr[n-1] - arr[0]
    
    smallest = arr[0] + k
    largest = arr[n-1] - k
    
    for i in range(n-1):
        min_val = min(smallest, arr[i+1] - k)
        max_val = max(largest, arr[i] + k)
        
        if min_val < 0:
            continue
            
        ans = min(ans, max_val - min_val)
    
    return ans`,
      Java: `public int getMinDiff(int[] arr, int k) {
    int n = arr.length;
    Arrays.sort(arr);
    
    int ans = arr[n-1] - arr[0];
    
    int smallest = arr[0] + k;
    int largest = arr[n-1] - k;
    
    for (int i = 0; i < n-1; i++) {
        int minVal = Math.min(smallest, arr[i+1] - k);
        int maxVal = Math.max(largest, arr[i] + k);
        
        if (minVal < 0) continue;
        
        ans = Math.min(ans, maxVal - minVal);
    }
    
    return ans;
}`,
      "C++": `int getMinDiff(vector<int>& arr, int k) {
    int n = arr.size();
    sort(arr.begin(), arr.end());
    
    int ans = arr[n-1] - arr[0];
    
    int smallest = arr[0] + k;
    int largest = arr[n-1] - k;
    
    for (int i = 0; i < n-1; i++) {
        int minVal = min(smallest, arr[i+1] - k);
        int maxVal = max(largest, arr[i] + k);
        
        if (minVal < 0) continue;
        
        ans = min(ans, maxVal - minVal);
    }
    
    return ans;
}`,
      JavaScript: `function getMinDiff(arr, k) {
    const n = arr.length;
    arr.sort((a, b) => a - b);
    
    let ans = arr[n-1] - arr[0];
    
    let smallest = arr[0] + k;
    let largest = arr[n-1] - k;
    
    for (let i = 0; i < n-1; i++) {
        const minVal = Math.min(smallest, arr[i+1] - k);
        const maxVal = Math.max(largest, arr[i] + k);
        
        if (minVal < 0) continue;
        
        ans = Math.min(ans, maxVal - minVal);
    }
    
    return ans;
}`,
    },
    explanation: {
      approach:
        "Sort the array first. The key insight is that we need to find a partition point where elements before it are increased by K and elements after it are decreased by K. For each possible partition, calculate the minimum and maximum values and track the minimum difference.",
      steps: [
        "Sort the array in ascending order.",
        "Initialize answer with the initial difference (max - min).",
        "Set smallest = arr[0] + K and largest = arr[n-1] - K.",
        "Iterate through the array, considering each position as a potential partition point.",
        "For each partition, calculate minVal = min(smallest, arr[i+1] - K) and maxVal = max(largest, arr[i] + K).",
        "If minVal is negative, skip this partition (invalid).",
        "Update answer with the minimum of current answer and (maxVal - minVal).",
        "Return the minimum difference found.",
      ],
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Greedy", "Array", "Sorting"],
    difficulty: "Medium",
    topic: "Greedy",
    hasVisualization: false,
  },
  19: {
    id: 19,
    title: "Minimum number of jumps",
    description:
      "Given an array of non-negative integers nums, you are initially positioned at the first index of the array.\n\nEach element in the array represents your maximum jump length at that position.\n\nYour goal is to reach the last index in the minimum number of jumps.\n\nYou can assume that you can always reach the last index.",
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "2",
        explanation:
          "The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [2,3,0,1,4]",
        output: "2",
        explanation:
          "The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [1,1,1,1]",
        output: "3",
        explanation:
          "You need to jump 3 times, each time moving 1 step forward.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "0 ≤ nums[i] ≤ 1000",
      "It's guaranteed that you can reach nums[nums.length - 1].",
    ],
    codes: {
      Python: `def jump(nums):
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            if current_end >= len(nums) - 1:
                break
    
    return jumps`,
      Java: `public int jump(int[] nums) {
    if (nums.length <= 1) {
        return 0;
    }
    
    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;
    
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            if (currentEnd >= nums.length - 1) {
                break;
            }
        }
    }
    
    return jumps;
}`,
      "C++": `int jump(vector<int>& nums) {
    if (nums.size() <= 1) {
        return 0;
    }
    
    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;
    
    for (int i = 0; i < nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            if (currentEnd >= nums.size() - 1) {
                break;
            }
        }
    }
    
    return jumps;
}`,
      JavaScript: `function jump(nums) {
    if (nums.length <= 1) {
        return 0;
    }
    
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            if (currentEnd >= nums.length - 1) {
                break;
            }
        }
    }
    
    return jumps;
}`,
    },
    explanation: {
      approach:
        "Use a greedy approach with two key variables: 'currentEnd' tracks the farthest position reachable with the current number of jumps, and 'farthest' tracks the farthest position we can reach from any position in the current jump range. When we reach 'currentEnd', we must make a jump and update 'currentEnd' to 'farthest'.",
      steps: [
        "Initialize jumps = 0, currentEnd = 0 (end of current jump range), and farthest = 0 (farthest reachable position).",
        "Iterate through the array (excluding the last element).",
        "For each position i, update farthest = max(farthest, i + nums[i]).",
        "When i reaches currentEnd, we've exhausted the current jump range:",
        "  - Increment jumps by 1.",
        "  - Update currentEnd = farthest (new jump range boundary).",
        "  - If currentEnd >= last index, we can reach the end, so break early.",
        "Return the total number of jumps.",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
    tags: ["Array", "Greedy", "Dynamic Programming"],
    difficulty: "Medium",
    topic: "Greedy",
    leetcodeNumber: 45,
    hasVisualization: true,
  },
};
