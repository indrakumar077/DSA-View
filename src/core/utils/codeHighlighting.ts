import { questionsData } from '../../data/questions';

/**
 * Gets the highlighted line number in code based on step line and language.
 * Uses explicit line mappings defined in the question data.
 * 
 * @param stepLine - The logical step line number from the visualization
 * @param language - The programming language (Python, Java, C++, JavaScript)
 * @param questionId - The ID of the question
 * @returns The actual code line number to highlight, or -1 if not found
 */
export const getHighlightedLine = (
  stepLine: number,
  language: string,
  questionId: number
): number => {
  const question = questionsData[questionId];
  if (!question) return -1;

  // Use explicit line mappings - each question must define these
  const lineMapping = question.lineMappings?.[language]?.[stepLine];
  if (lineMapping !== undefined) {
    return lineMapping;
  }

  // If no mapping found, return -1 (no highlight)
  return -1;
};

