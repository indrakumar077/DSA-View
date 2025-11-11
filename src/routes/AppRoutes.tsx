import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { SignupPage } from '../features/auth/pages/SignupPage';
import { QuestionListPage } from '../features/questions/pages/QuestionListPage';
import { QuestionDetailPage } from '../features/questions/pages/QuestionDetailPage';
import { VisualizationRouter } from './VisualizationRouter';
import { questionsData } from '../data/questions';

// Redirect from /problems/:slug to /problems/:slug/description
const RedirectToDescription = () => {
  const { slug } = useParams<{ slug: string }>();
  if (slug) {
    return <Navigate to={`/problems/${slug}/description`} replace />;
  }
  return <Navigate to={ROUTES.QUESTIONS} replace />;
};

// Legacy redirect: /dashboard/questions/:id -> /problems/:slug/description
const LegacyRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : null;
  
  if (questionId) {
    const question = questionsData[questionId];
    if (question && question.slug) {
      return <Navigate to={`/problems/${question.slug}/description`} replace />;
    }
  }
  return <Navigate to={ROUTES.QUESTIONS} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.QUESTIONS} replace />} />
      
      {/* Questions list page */}
      <Route path={ROUTES.QUESTIONS} element={<QuestionListPage />} />
      
      {/* Individual problem routes (must come after /problems list) */}
      <Route path="/problems/:slug" element={<RedirectToDescription />} />
      <Route path="/problems/:slug/description" element={<QuestionDetailPage />} />
      <Route path="/problems/:slug/visualization" element={<QuestionDetailPage />} />
      <Route path="/problems/:slug/explanation" element={<QuestionDetailPage />} />
      
      {/* Legacy routes (redirect to slug-based) */}
      <Route path="/dashboard/questions" element={<Navigate to={ROUTES.QUESTIONS} replace />} />
      <Route path="/dashboard/questions/:id" element={<LegacyRedirect />} />
      <Route path="/dashboard/questions/:id/description" element={<LegacyRedirect />} />
      <Route path="/dashboard/questions/:id/visualization" element={<LegacyRedirect />} />
      <Route path="/dashboard/questions/:id/explanation" element={<LegacyRedirect />} />
      
      <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

