# How to Create a Visualization for a Question

This guide explains step-by-step how to create a visualization component for a new question.

## 📋 Prerequisites

- Basic knowledge of React and TypeScript
- Understanding of the algorithm you want to visualize
- Familiarity with Material-UI components

---

## 🎯 Step-by-Step Process

### Step 1: Add Question Data to `questions.ts`

First, add your question data to `src/data/questions.ts`:

```typescript
export const questionsData: Record<number, QuestionData> = {
  // ... existing questions
  YOUR_QUESTION_ID: {
    id: YOUR_QUESTION_ID,
    title: 'Your Question Title',
    description: 'Problem description here...',
    examples: [
      {
        input: 'input example',
        output: 'output example',
        explanation: 'optional explanation',
      },
    ],
    constraints: [
      'Constraint 1',
      'Constraint 2',
    ],
    codes: {
      Python: `def solution(nums):
    # Your Python code here
    pass`,
      Java: `public int[] solution(int[] nums) {
    // Your Java code here
    return new int[]{};
}`,
      'C++': `vector<int> solution(vector<int>& nums) {
    // Your C++ code here
    return {};
}`,
      JavaScript: `function solution(nums) {
    // Your JavaScript code here
    return [];
}`,
    },
    explanation: {
      approach: 'Brief explanation of the approach',
      steps: [
        'Step 1 description',
        'Step 2 description',
        'Step 3 description',
      ],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    tags: ['Array', 'Hash Table'],
    hasVisualization: true,
  },
};
```

---

### Step 2: Create Visualization Component Directory

Create a new folder for your visualization:

```
src/components/Array/Easy/YourQuestionName/
  └── YourQuestionNameVisualization.tsx
```

**Example:**
```
src/components/Array/Easy/ContainsDuplicate/
  └── ContainsDuplicateVisualization.tsx
```

---

### Step 3: Create the Visualization Component

Copy the structure from an existing visualization (like `TwoSumVisualization.tsx`) and adapt it.

#### 3.1 Basic Structure

```typescript
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  Code,
  Article,
} from '@mui/icons-material';
import { themeColors } from '../../../../theme';
import { questionsData } from '../../../../data/questions';
import { useVisualizationControls } from '../../../../contexts/VisualizationControlContext';

// Define your Step interface based on what data you need to track
interface Step {
  line: number;           // Code line number for highlighting
  i?: number;             // Current index (if needed)
  variables: Record<string, any>;  // Variables to display
  // Add other properties based on your algorithm
  // For example:
  // hashMap?: Record<number, number>;
  // seenSet?: number[];
  // result?: any;
  description: string;     // Step description
  isSolution?: boolean;   // Is this the solution step?
}

const YourQuestionNameVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : YOUR_QUESTION_ID;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  
  // State management
  const [inputData, setInputData] = useState([/* initial data */]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState('Python');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);
```

#### 3.2 Generate Steps Function

This is the **most important** function. It simulates your algorithm step-by-step:

```typescript
const generateSteps = (inputData: number[]): Step[] => {
  const steps: Step[] = [];
  
  // Initialize data structures
  const dataStructure = new Set(); // or Map, Array, etc.
  
  // Initial state
  steps.push({
    line: 1,
    variables: {},
    description: 'Initialize empty data structure',
  });
  
  // Simulate algorithm execution
  for (let i = 0; i < inputData.length; i++) {
    // Step: Check current element
    steps.push({
      line: 2,
      i,
      variables: { i, 'input[i]': inputData[i] },
      description: `Processing element at index ${i}: ${inputData[i]}`,
    });
    
    // Step: Algorithm logic
    if (/* your condition */) {
      steps.push({
        line: 3,
        i,
        variables: { i, 'input[i]': inputData[i] },
        description: 'Solution found!',
        isSolution: true,
        result: /* result */,
      });
      break;
    }
    
    // Step: Update data structure
    dataStructure.add(inputData[i]);
    
    steps.push({
      line: 4,
      i,
      variables: { i, 'input[i]': inputData[i] },
      description: `Updated data structure`,
    });
  }
  
  // Final step if no solution
  if (!steps[steps.length - 1].isSolution) {
    steps.push({
      line: 5,
      variables: {},
      description: 'No solution found',
      result: /* final result */,
    });
  }
  
  return steps;
};
```

**Key Points:**
- Each step represents one state of the algorithm
- Store copies of data structures (not references)
- Add descriptive messages for each step
- Mark solution steps with `isSolution: true`

#### 3.3 State Management

```typescript
const [steps, setSteps] = useState<Step[]>(() => generateSteps(inputData));

useEffect(() => {
  setSteps(generateSteps(inputData));
  setCurrentStep(0);
  setIsPlaying(false);
}, [inputData]);

// Animation control
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
```

#### 3.4 Control Handlers

```typescript
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

const handleCustomInputClick = useCallback(() => {
  setShowCustomInput(true);
}, []);

// Register controls with context
useEffect(() => {
  registerControls({
    handlePlayPause,
    handlePrevious,
    handleNext,
    setSpeed,
    handleCustomInput: handleCustomInputClick,
    isPlaying,
    speed,
  });
  
  return () => {
    unregisterControls();
  };
}, [isPlaying, speed, handlePlayPause, handlePrevious, handleNext, handleCustomInputClick, registerControls, unregisterControls]);
```

#### 3.5 Code Highlighting Function

This function maps logical steps to actual code line numbers:

```typescript
const getHighlightedLine = (stepLine: number, lang: string): number => {
  const currentCode = question?.codes?.[lang as keyof typeof question.codes] || question?.codes?.Python || '';
  if (!currentCode) return -1;
  const lines = currentCode.split('\n');
  
  // Map stepLine (logical step) to actual code line
  // Step 1: Initialize
  if (stepLine === 1) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Match patterns for initialization
      if (lang === 'Python' && /seen\s*=\s*set\(\)/.test(line)) {
        return i + 1;
      }
      if (lang === 'Java' && /Set<.*>.*seen\s*=\s*new HashSet/.test(line)) {
        return i + 1;
      }
      // ... more patterns
    }
  }
  
  // Step 2: Loop
  if (stepLine === 2) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (lang === 'Python' && /for\s+num\s+in\s+nums/.test(line)) {
        return i + 1;
      }
      // ... more patterns
    }
  }
  
  // Add more step mappings...
  
  return -1;
};

const code = question?.codes?.[language as keyof typeof question.codes] || question?.codes?.Python || '';
const codeLines = useMemo(() => {
  return code.split('\n');
}, [code, language]);

const highlightedLine = getHighlightedLine(currentStepData.line, language);
```

#### 3.6 UI Structure

The UI follows this structure:

```typescript
return (
  <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', ... }}>
    {/* Header */}
    <Box sx={{ height: 64, ... }}>
      {/* Back button, Title, Dashboard link */}
    </Box>
    
    {/* Toolbar */}
    <Box sx={{ height: 48, ... }}>
      {/* Title, Tabs (Visualization/Explanation), Controls */}
    </Box>
    
    {/* Main Content */}
    <Box sx={{ flex: 1, display: 'flex', ... }}>
      {/* Left Side - Visualization */}
      <Box sx={{ width: '50%', ... }}>
        {activeTab === 0 ? (
          <>
            {/* Array/Data Visualization */}
            <Box>
              {/* Visual representation of data */}
            </Box>
            
            {/* Data Structures Panel */}
            <Box>
              {/* Variables, Hash Maps, Sets, etc. */}
            </Box>
          </>
        ) : (
          /* Explanation View */
          <Box>
            {/* Approach, Steps, Complexity */}
          </Box>
        )}
      </Box>
      
      {/* Right Side - Code */}
      <Box sx={{ width: '50%', ... }}>
        {/* Code Header with Language Selector */}
        <Box>
          <Typography>Code</Typography>
          <FormControl>
            <Select value={language} onChange={...}>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="Java">Java</MenuItem>
              <MenuItem value="C++">C++</MenuItem>
              <MenuItem value="JavaScript">JavaScript</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Code Display */}
        <Box>
          {codeLines.map((line, idx) => {
            const isHighlighted = highlightedLine === idx + 1;
            return (
              <Box sx={{ backgroundColor: isHighlighted ? ... : ... }}>
                <Typography>{idx + 1}</Typography>
                <code>{line}</code>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
    
    {/* Custom Input Dialog */}
    <Dialog open={showCustomInput} onClose={...}>
      {/* Input form */}
    </Dialog>
  </Box>
);
```

---

### Step 4: Register Component in GenericQuestion.tsx

Add your visualization to `src/components/GenericQuestion.tsx`:

```typescript
import YourQuestionNameVisualization from './Array/Easy/YourQuestionName/YourQuestionNameVisualization';

// In getVisualizationComponent function:
const getVisualizationComponent = () => {
  switch (question.id) {
    case 1:
      return <TwoSumVisualization />;
    case 2:
      return <BestTimeToBuySellStockVisualization />;
    case 8:
      return <ContainsDuplicateVisualization />;
    case YOUR_QUESTION_ID:
      return <YourQuestionNameVisualization />;
    default:
      return null;
  }
};
```

---

### Step 5: Register in App.tsx (Optional)

If you want direct route access, add to `src/App.tsx`:

```typescript
import YourQuestionNameVisualization from './components/Array/Easy/YourQuestionName/YourQuestionNameVisualization';

// In VisualizationRouter:
if (questionId === YOUR_QUESTION_ID) {
  return <YourQuestionNameVisualization />;
}
```

---

## 🎨 Visualization Best Practices

### 1. **Data Structure Visualization**

- **Arrays**: Show with index labels, highlight current index
- **Hash Maps**: Display as key-value pairs
- **Sets**: Show as a collection of unique elements
- **Pointers**: Use arrows or labels (i, j, left, right, etc.)

### 2. **Color Coding**

- **Current element**: Primary color (`themeColors.primary`)
- **Solution element**: Green (`#10b981`)
- **Processed elements**: Light green (`#10b9811a`)
- **Unprocessed elements**: Low opacity (0.3)

### 3. **Step Descriptions**

- Be clear and concise
- Include current values
- Explain what's happening
- Use emojis for success/error states (🎯, ✅, etc.)

### 4. **Code Highlighting**

- Map logical steps to actual code lines
- Support all 4 languages (Python, Java, C++, JavaScript)
- Use regex patterns to find code lines
- Handle different code styles

---

## 📝 Example: Creating "Contains Duplicate" Visualization

### Step Interface:
```typescript
interface Step {
  line: number;
  i?: number;
  variables: Record<string, any>;
  seenSet: number[];  // Array representation of Set
  description: string;
  isDuplicate?: boolean;
  result?: boolean;
}
```

### Generate Steps:
```typescript
const generateSteps = (nums: number[]): Step[] => {
  const steps: Step[] = [];
  const seen = new Set<number>();
  
  steps.push({
    line: 1,
    variables: {},
    seenSet: [],
    description: 'Initialize empty set',
  });
  
  for (let i = 0; i < nums.length; i++) {
    steps.push({
      line: 2,
      i,
      variables: { i, 'nums[i]': nums[i] },
      seenSet: Array.from(seen),
      description: `Check element at index ${i}: ${nums[i]}`,
    });
    
    if (seen.has(nums[i])) {
      steps.push({
        line: 3,
        i,
        variables: { i, 'nums[i]': nums[i] },
        seenSet: Array.from(seen),
        description: `Duplicate found! ${nums[i]} already exists`,
        isDuplicate: true,
        result: true,
      });
      break;
    }
    
    seen.add(nums[i]);
    steps.push({
      line: 4,
      i,
      variables: { i, 'nums[i]': nums[i] },
      seenSet: Array.from(seen),
      description: `Set updated: {${Array.from(seen).join(', ')}}`,
    });
  }
  
  return steps;
};
```

---

## 🔍 Common Patterns

### Pattern 1: Two Pointers
```typescript
interface Step {
  left?: number;
  right?: number;
  // ...
}
```

### Pattern 2: Hash Map
```typescript
interface Step {
  hashMap: Record<number, number>;
  // ...
}
```

### Pattern 3: Sliding Window
```typescript
interface Step {
  windowStart?: number;
  windowEnd?: number;
  currentSum?: number;
  // ...
}
```

---

## ✅ Checklist

Before submitting your visualization:

- [ ] Question data added to `questions.ts`
- [ ] Visualization component created
- [ ] `generateSteps` function implemented correctly
- [ ] Code highlighting works for all 4 languages
- [ ] Component registered in `GenericQuestion.tsx`
- [ ] Custom input dialog works
- [ ] All controls (play/pause/prev/next) work
- [ ] Visual representation is clear
- [ ] Step descriptions are helpful
- [ ] No TypeScript errors
- [ ] No console errors

---

## 🚀 Quick Start Template

Use this template to get started quickly:

```typescript
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// ... imports

interface Step {
  line: number;
  variables: Record<string, any>;
  description: string;
  // Add your specific properties
}

const YourQuestionVisualization = () => {
  // ... state and hooks
  
  const generateSteps = (input: any[]): Step[] => {
    const steps: Step[] = [];
    // Implement your algorithm simulation
    return steps;
  };
  
  // ... rest of component
  
  return (
    // ... UI
  );
};

export default YourQuestionVisualization;
```

---

## 📚 Reference Files

Study these files for examples:
- `TwoSumVisualization.tsx` - Hash map pattern
- `ContainsDuplicateVisualization.tsx` - Set pattern
- `BestTimeToBuySellStockVisualization.tsx` - Single pass pattern

---

## 🆘 Troubleshooting

### Issue: Steps not generating correctly
- Check that you're creating new objects/arrays, not references
- Verify your algorithm logic matches the code

### Issue: Code highlighting not working
- Check regex patterns match your code format
- Test with all 4 languages
- Use `console.log` to debug line numbers

### Issue: Animation not smooth
- Check `speed` state is being used correctly
- Verify interval cleanup in useEffect

### Issue: Component not showing
- Verify question ID matches in `questions.ts` and `GenericQuestion.tsx`
- Check that `hasVisualization: true` is set

---

## 💡 Tips

1. **Start Simple**: Get basic visualization working first, then add details
2. **Test Incrementally**: Test each step of generation separately
3. **Use Console**: Log steps to verify they're correct
4. **Copy Patterns**: Use existing visualizations as templates
5. **Ask for Help**: If stuck, refer to working examples

---

Happy Coding! 🎉

