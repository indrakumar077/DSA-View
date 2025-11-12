/**
 * Enums and constants for the application
 * Centralized definitions for type safety and consistency
 */

// Difficulty Levels
export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

// Programming Languages
export enum Language {
  PYTHON = "Python",
  JAVA = "Java",
  CPP = "C++",
  JAVASCRIPT = "JavaScript",
}

// Question Status
export enum QuestionStatus {
  SOLVED = "solved",
  ATTEMPTED = "attempted",
  NOT_STARTED = "notStarted",
}

// Question Topics
export enum Topic {
  ARRAYS = "Arrays",
  STRINGS = "Strings",
  LINKED_LIST = "Linked List",
  STACK = "Stack",
  QUEUE = "Queue",
  TREES = "Trees",
  BINARY_TREE = "Binary Tree",
  BINARY_SEARCH_TREE = "Binary Search Tree",
  HEAP = "Heap",
  GRAPH = "Graph",
  DYNAMIC_PROGRAMMING = "Dynamic Programming",
  GREEDY = "Greedy",
  BACKTRACKING = "Backtracking",
  SORTING = "Sorting",
  SEARCHING = "Searching",
  HASH_TABLE = "Hash Table",
  MATH = "Math",
  BIT_MANIPULATION = "Bit Manipulation",
  TWO_POINTERS = "Two Pointers",
  SLIDING_WINDOW = "Sliding Window",
  DIVIDE_AND_CONQUER = "Divide and Conquer",
  TRIE = "Trie",
  UNION_FIND = "Union Find",
  TOPOLOGICAL_SORT = "Topological Sort",
}

// Question Tags (Common tags)
export enum Tag {
  ARRAY = "Array",
  HASH_TABLE = "Hash Table",
  TWO_POINTERS = "Two Pointers",
  STRING = "String",
  SLIDING_WINDOW = "Sliding Window",
  BINARY_SEARCH = "Binary Search",
  DYNAMIC_PROGRAMMING = "Dynamic Programming",
  GREEDY = "Greedy",
  BACKTRACKING = "Backtracking",
  TREE = "Tree",
  BINARY_TREE = "Binary Tree",
  BINARY_SEARCH_TREE = "Binary Search Tree",
  GRAPH = "Graph",
  DEPTH_FIRST_SEARCH = "Depth-First Search",
  BREADTH_FIRST_SEARCH = "Breadth-First Search",
  UNION_FIND = "Union Find",
  TRIE = "Trie",
  STACK = "Stack",
  QUEUE = "Queue",
  HEAP = "Heap",
  LINKED_LIST = "Linked List",
  MATH = "Math",
  BIT_MANIPULATION = "Bit Manipulation",
  SORTING = "Sorting",
  RECURSION = "Recursion",
  MEMOIZATION = "Memoization",
  STRING_MATCHING = "String Matching",
  SIMULATION = "Simulation",
  PREFIX_SUM = "Prefix Sum",
  DIVIDE_AND_CONQUER = "Divide and Conquer",
  MATRIX = "Matrix",
}

// Array of all enum values for easy iteration
export const DIFFICULTIES = Object.values(Difficulty);
export const LANGUAGES = Object.values(Language);
export const QUESTION_STATUSES = Object.values(QuestionStatus);
export const TOPICS = Object.values(Topic);
export const TAGS = Object.values(Tag);

// Type exports for use in interfaces
export type DifficultyType = Difficulty;
export type LanguageType = Language;
export type QuestionStatusType = QuestionStatus;
export type TopicType = Topic;
export type TagType = Tag;
