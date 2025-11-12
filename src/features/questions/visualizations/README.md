# Visualization Pages Guide

## Adding a New Question Visualization

To add a new question visualization, follow these steps:

### 1. Create Visualization Page

Create a new folder in the appropriate topic folder within `src/features/questions/visualizations/`. Questions are organized by topic (similar to Striver's DSA sheet):

```
visualizations/
  ├── Array/
  │   ├── TwoSum/
  │   │   └── TwoSumVisualizationPage.tsx
  │   ├── BestTimeToBuyAndSellStock/
  │   │   └── BestTimeToBuyAndSellStockVisualizationPage.tsx
  │   └── YourQuestion/
  │       └── YourQuestionVisualizationPage.tsx
  ├── Stack/
  ├── Linked List/
  └── ...
```

**Topic-based organization:**
- Questions are grouped by their primary topic/category
- Common topics: Array, Stack, Linked List, Binary Tree, Dynamic Programming, etc.
- If a question belongs to multiple topics, place it in the primary topic folder

### 2. Use Reusable Components

Import and use these reusable components for consistency:

```typescript
import { VisualizationLayout } from '../../../../shared/layouts/VisualizationLayout';
import { CodeViewer } from '../../../../shared/components/CodeViewer';
import { VisualizationControlBar } from '../../../../shared/components/VisualizationControlBar';
import { CustomInputDialog } from '../../../../shared/components/CustomInputDialog';
import { StepDescription, SolutionMessage } from '../../../../shared/components/VisualizationComponents';
```

### 3. Template Structure

```typescript
import { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { themeColors } from '../../../../theme';
import { useVisualizationState } from '../../../../core/hooks/useVisualizationState';
import { useQuestionData } from '../../../../core/hooks/useQuestionData';
import { getHighlightedLine } from '../../../../core/utils/codeHighlighting';
import { VisualizationLayout } from '../../../../shared/layouts/VisualizationLayout';
import { CodeViewer } from '../../../../shared/components/CodeViewer';
import { VisualizationControlBar } from '../../../../shared/components/VisualizationControlBar';
import { CustomInputDialog } from '../../../../shared/components/CustomInputDialog';
import { StepDescription, SolutionMessage } from '../../../../shared/components/VisualizationComponents';
import { VisualizationStep, Language } from '../../../../types';
import { DEFAULT_LANGUAGE } from '../../../../constants';

interface YourQuestionStep extends VisualizationStep {
  // Add your custom step properties here
}

export const YourQuestionVisualizationPage = () => {
  const question = useQuestionData();
  const questionId = question?.id || 1;
  const [input, setInput] = useState(/* initial input */);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [customInputFields, setCustomInputFields] = useState({});

  // Generate animation steps
  const generateSteps = (input: any): YourQuestionStep[] => {
    const steps: YourQuestionStep[] = [];
    // Your step generation logic
    return steps;
  };

  const [steps, setSteps] = useState<YourQuestionStep[]>(() => generateSteps(input));

  useEffect(() => {
    setSteps(generateSteps(input));
  }, [input]);

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

  const handleCustomInput = () => {
    // Your custom input handling logic
    setShowCustomInput(false);
  };

  const highlightedLine = useMemo(
    () => getHighlightedLine(currentStepData.line, language, questionId),
    [currentStepData.line, language, questionId]
  );

  // Visualization content
  const visualizationContent = (
    <>
      {/* Your visualization UI */}
    </>
  );

  // Explanation content
  const explanationContent = question?.explanation ? (
    <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
      {/* Use consistent styling from themeColors */}
    </Box>
  ) : null;

  // Code content
  const codeContent = (
    <CodeViewer
      questionId={questionId}
      language={language}
      onLanguageChange={setLanguage}
      highlightedLine={highlightedLine}
      controls={
        <VisualizationControlBar
          isPlaying={isPlaying}
          speed={speed}
          currentStep={currentStep}
          totalSteps={steps.length}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSpeedChange={setSpeed}
          onCustomInput={() => setShowCustomInput(true)}
        />
      }
    />
  );

  return (
    <>
      <VisualizationLayout
        title={question?.title || 'Your Question'}
        questionId={questionId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visualizationContent={visualizationContent}
        explanationContent={explanationContent}
        codeContent={codeContent}
      />
      <CustomInputDialog
        open={showCustomInput}
        onClose={() => setShowCustomInput(false)}
        onSubmit={handleCustomInput}
        fields={[
          {
            label: 'Input Field 1',
            value: customInputFields.field1 || '',
            onChange: (value) => setCustomInputFields({ ...customInputFields, field1: value }),
            placeholder: 'Enter value',
          },
        ]}
      />
    </>
  );
};
```

### 4. Register in Router

Add your visualization to `src/routes/VisualizationRouter.tsx`:

```typescript
import { YourQuestionVisualizationPage } from '../features/questions/visualizations/Array/YourQuestion/YourQuestionVisualizationPage';

export const VisualizationRouter = () => {
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 1;

  switch (questionId) {
    case QUESTION_IDS.TWO_SUM:
      return <TwoSumVisualizationPage />;
    case QUESTION_IDS.YOUR_QUESTION:
      return <YourQuestionVisualizationPage />;
    default:
      return <Navigate to={ROUTES.QUESTIONS} replace />;
  }
};
```

## Reusable Components

### CustomInputDialog
- Reusable dialog for custom input
- Supports multiple fields
- Consistent styling

### StepDescription
- Displays step descriptions
- Handles solution highlighting
- Consistent styling

### SolutionMessage
- Shows solution found message
- Displays complexity info
- Animated success message

### VisualizationControlBar
- Play/Pause/Previous/Next controls
- Speed selector
- Custom Input button
- Consistent styling across all pages

### VisualizationLayout
- Consistent layout structure
- Resizable split pane
- Tab navigation
- Header with back button

## Color Consistency

Always use `themeColors` from `src/theme.ts`:
- `themeColors.primary` - Primary accent color
- `themeColors.backgroundDark` - Dark background
- `themeColors.inputBgDark` - Input background
- `themeColors.borderLight` - Borders
- `themeColors.textSecondary` - Secondary text
- `themeColors.white` - Primary text

## Best Practices

1. **Always use reusable components** - Don't recreate dialogs, buttons, etc.
2. **Consistent styling** - Use themeColors for all colors
3. **Type safety** - Extend VisualizationStep interface for custom steps
4. **Code organization** - Keep visualization logic separate from UI
5. **Error handling** - Validate custom inputs properly

