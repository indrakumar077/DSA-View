import { useState, useEffect, useRef, useCallback } from 'react';
import { VisualizationStep, VisualizationControls } from '../../types';
import { useVisualizationControls } from '../contexts/VisualizationControlContext';

interface UseVisualizationStateOptions {
  steps: VisualizationStep[];
  onCustomInput?: () => void;
}

interface UseVisualizationStateReturn {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  handlePlayPause: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  reset: () => void;
  currentStepData: VisualizationStep;
}

export const useVisualizationState = ({
  steps,
  onCustomInput,
}: UseVisualizationStateOptions): UseVisualizationStateReturn => {
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return nextStep;
        });
      }, 1000 / speed) as unknown as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [currentStep, steps.length, isPlaying]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  }, [currentStep, steps.length]);

  // Register controls with context
  useEffect(() => {
    const controls: VisualizationControls = {
      isPlaying,
      speed,
      currentStep,
      totalSteps: steps.length,
      onPlayPause: handlePlayPause,
      onPrevious: handlePrevious,
      onNext: handleNext,
      onSpeedChange: setSpeed,
      onCustomInput,
    };

    registerControls(controls);

    return () => {
      unregisterControls();
    };
  }, [
    isPlaying,
    speed,
    currentStep,
    steps.length,
    handlePlayPause,
    handlePrevious,
    handleNext,
    onCustomInput,
    registerControls,
    unregisterControls,
  ]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    handlePlayPause,
    handlePrevious,
    handleNext,
    reset,
    currentStepData: steps[currentStep] || steps[0],
  };
};

