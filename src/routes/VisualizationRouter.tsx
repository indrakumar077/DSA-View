import { Navigate, useParams } from 'react-router-dom';
import { QUESTION_IDS, ROUTES } from '../constants';
import { TwoSumVisualizationPage } from '../features/questions/visualizations/TwoSum/TwoSumVisualizationPage';

/**
 * Dynamic router for visualization pages
 * Maps question IDs to their corresponding visualization components
 */
export const VisualizationRouter = () => {
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 1;

  switch (questionId) {
    case QUESTION_IDS.TWO_SUM:
      return <TwoSumVisualizationPage />;
    default:
      return <Navigate to={ROUTES.QUESTIONS} replace />;
  }
};

