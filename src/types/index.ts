/**
 * Core TypeScript types and interfaces for the application
 */

import { Difficulty, Language, Topic, Tag } from '../constants/enums';

// Re-export enums for convenience
export { Difficulty, Language, Topic, Tag, QuestionStatus } from '../constants/enums';

export interface QuestionData {
  id: number; // Must match leetcodeNumber
  slug: string; // URL-friendly slug (e.g., "two-sum", "jump-game")
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  codes: {
    [Language.PYTHON]?: string;
    [Language.JAVA]?: string;
    [Language.CPP]?: string;
    [Language.JAVASCRIPT]?: string;
  };
  explanation?: {
    approach: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
  };
  tags: Tag[];
  difficulty: Difficulty;
  topic: Topic;
  leetcodeNumber: number; // Required - must match id
  hasVisualization?: boolean;
  /**
   * Default input values for visualization.
   * Format is completely flexible and depends on the problem type.
   * Each question can have its own input structure.
   */
  defaultInput?: any;
  /**
   * Maps logical step lines to actual code line numbers for each language.
   * This provides precise line highlighting without relying on regex patterns.
   * Format: { [language]: { [stepLine]: codeLineNumber } }
   */
  lineMappings?: {
    [language in Language]?: {
      [stepLine: number]: number;
    };
  };
}

export interface VisualizationStep {
  line: number;
  description: string;
  variables: Record<string, any>;
  [key: string]: any;
}

export interface VisualizationControls {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSpeedChange: (speed: number) => void;
  onCustomInput?: () => void;
}

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requiresAuth?: boolean;
}

