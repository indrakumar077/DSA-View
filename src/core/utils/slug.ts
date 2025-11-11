/**
 * Utility functions for generating and working with slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * Example: "Two Sum" -> "two-sum"
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Find question by slug
 */
export const findQuestionBySlug = (slug: string, questionsData: Record<number, any>) => {
  return Object.values(questionsData).find((q) => q.slug === slug) || null;
};

