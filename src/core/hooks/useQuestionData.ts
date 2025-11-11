import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { questionsData } from '../../data/questions';
import { QuestionData } from '../../types';
import { findQuestionBySlug } from '../../core/utils/slug';

export const useQuestionData = (): QuestionData | null => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  
  return useMemo(() => {
    // Priority: slug (new format) > id (legacy format)
    if (slug) {
      return findQuestionBySlug(slug, questionsData);
    }
    if (id) {
      const questionId = parseInt(id, 10);
      return questionsData[questionId] || null;
    }
    return null;
  }, [slug, id]);
};

