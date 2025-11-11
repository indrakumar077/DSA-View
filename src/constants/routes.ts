/**
 * Application route constants
 */

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  QUESTIONS: '/problems', // Questions list page
  
  // Problem routes (slug-based)
  PROBLEM_DESCRIPTION: (slug: string) => `/problems/${slug}/description`,
  PROBLEM_VISUALIZATION: (slug: string) => `/problems/${slug}/visualization`,
  PROBLEM_EXPLANATION: (slug: string) => `/problems/${slug}/explanation`,
  
  // Legacy routes (for backward compatibility - redirect to slug-based)
  QUESTION_DETAIL: (id: number | string) => `/dashboard/questions/${id}`,
  QUESTION_DESCRIPTION: (id: number | string) => `/dashboard/questions/${id}/description`,
  QUESTION_VISUALIZATION: (id: number | string) => `/dashboard/questions/${id}/visualization`,
  QUESTION_EXPLANATION: (id: number | string) => `/dashboard/questions/${id}/explanation`,
  
  // Root
  ROOT: '/',
} as const;

export const QUESTION_IDS = {
  TWO_SUM: 1,
} as const;

