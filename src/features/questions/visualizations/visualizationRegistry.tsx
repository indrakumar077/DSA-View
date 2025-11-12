import { ComponentType } from 'react';
import { TwoSumVisualizationPage } from './Array/TwoSum/TwoSumVisualizationPage';
import { BestTimeToBuyAndSellStockVisualizationPage } from './Array/BestTimeToBuyAndSellStock/BestTimeToBuyAndSellStockVisualizationPage';
import { TrappingRainWaterVisualizationPage } from './Array/TrappingRainWater/TrappingRainWaterVisualizationPage';
import { MoveZeroesVisualizationPage } from './Array/MoveZeroes/MoveZeroesVisualizationPage';
import { MaximumSubarrayVisualizationPage } from './Array/MaximumSubarray/MaximumSubarrayVisualizationPage';
import { ProductOfArrayExceptSelfVisualizationPage } from './Array/ProductOfArrayExceptSelf/ProductOfArrayExceptSelfVisualizationPage';
import { ThreeSumVisualizationPage } from './Array/ThreeSum/ThreeSumVisualizationPage';
import { ContainerWithMostWaterVisualizationPage } from './Array/ContainerWithMostWater/ContainerWithMostWaterVisualizationPage';

/**
 * Registry mapping LeetCode question IDs to their visualization components.
 * 
 * To add a new visualization:
 * 1. Import the visualization component above
 * 2. Add an entry to this map with the LeetCode number as the key
 * 
 * Example:
 * import { YourQuestionVisualizationPage } from './Array/YourQuestion/YourQuestionVisualizationPage';
 * 
 * export const visualizationRegistry: Record<number, ComponentType> = {
 *   1: TwoSumVisualizationPage,
 *   283: YourQuestionVisualizationPage,
 *   // ... other entries
 * };
 */
export const visualizationRegistry: Record<number, ComponentType> = {
  1: TwoSumVisualizationPage, // Two Sum
  121: BestTimeToBuyAndSellStockVisualizationPage, // Best Time to Buy and Sell Stock
  42: TrappingRainWaterVisualizationPage, // Trapping Rain Water
  283: MoveZeroesVisualizationPage, // Move Zeroes
  53: MaximumSubarrayVisualizationPage, // Maximum Subarray
  238: ProductOfArrayExceptSelfVisualizationPage, // Product of Array Except Self
  15: ThreeSumVisualizationPage, // 3Sum
  11: ContainerWithMostWaterVisualizationPage, // Container With Most Water
};

/**
 * Get visualization component for a given question ID.
 * Returns null if no visualization exists for the question.
 */
export const getVisualizationComponent = (questionId: number): ComponentType | null => {
  return visualizationRegistry[questionId] || null;
};

