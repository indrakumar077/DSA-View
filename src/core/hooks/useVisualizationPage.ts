import { useState, useEffect, useMemo } from 'react';
import { useQuestionData } from './useQuestionData';
import { getHighlightedLine } from '../utils/codeHighlighting';
import { useVisualizationState } from './useVisualizationState';
import { Language, VisualizationStep } from '../../types';
import { DEFAULT_LANGUAGE } from '../../constants';

interface UseVisualizationPageOptions<T extends VisualizationStep> {
  generateSteps: (input: any) => T[];
  initialInput: any;
  onInputChange?: (input: any) => void;
}

export const useVisualizationPage = <T extends VisualizationStep>({
  generateSteps,
  initialInput,
  onInputChange,
}: UseVisualizationPageOptions<T>) => {
  const question = useQuestionData();
  const questionId = question?.id || 1;
  const [input, setInput] = useState(initialInput);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [steps, setSteps] = useState<T[]>(() => generateSteps(input));

  useEffect(() => {
    const newSteps = generateSteps(input);
    setSteps(newSteps);
    if (onInputChange) {
      onInputChange(input);
    }
  }, [input, generateSteps, onInputChange]);

  const {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    handlePlayPause,
    handlePrevious,
    handleNext,
    currentStepData,
    reset,
  } = useVisualizationState({
    steps,
    onCustomInput: () => setShowCustomInput(true),
  });

  useEffect(() => {
    reset();
  }, [input, reset]);

  const highlightedLine = useMemo(
    () => getHighlightedLine(currentStepData.line, language, questionId),
    [currentStepData.line, language, questionId]
  );

  return {
    question,
    questionId,
    input,
    setInput,
    language,
    setLanguage,
    showCustomInput,
    setShowCustomInput,
    activeTab,
    setActiveTab,
    steps,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    handlePlayPause,
    handlePrevious,
    handleNext,
    currentStepData,
    highlightedLine,
  };
};

