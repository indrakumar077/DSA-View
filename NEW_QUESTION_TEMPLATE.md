# 🎯 New Question Add Karne Ka Template

## Two Sum Jaisa Exact Structure

Sab kuch same - fonts, buttons, placements, layout!

---

## 📋 Step-by-Step Guide

### Step 1: Question Data Add Karo (`src/data/questions.ts`)

```typescript
export const questionsData: Record<number, QuestionData> = {
  // ... existing questions
  2: {
    id: 2,
    title: "Your Question Title",
    description: "Problem description here...",
    examples: [
      {
        input: "input example",
        output: "output example",
        explanation: "optional explanation",
      },
    ],
    constraints: [
      "Constraint 1",
      "Constraint 2",
    ],
    codes: {
      [Language.PYTHON]: `def solution(input):
    # Your Python code here
    pass`,
      [Language.JAVA]: `public int[] solution(int[] input) {
    // Your Java code here
    return new int[]{};
}`,
      [Language.CPP]: `vector<int> solution(vector<int>& input) {
    // Your C++ code here
    return {};
}`,
      [Language.JAVASCRIPT]: `function solution(input) {
    // Your JavaScript code here
    return [];
}`,
    },
    explanation: {
      approach: "Brief explanation of the approach",
      steps: [
        "Step 1 description",
        "Step 2 description",
        "Step 3 description",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
    tags: [Tag.ARRAY], // Use enums
    difficulty: Difficulty.EASY, // Use enums
    topic: Topic.ARRAYS, // Use enums
    leetcodeNumber: 2, // Optional
    hasVisualization: true,
    defaultInput: {
      // Your input structure here
      // Example: nums: [1, 2, 3]
    },
    lineMappings: {
      [Language.PYTHON]: {
        1: 2, // Step line to code line mapping
        2: 3,
        // ...
      },
      [Language.JAVA]: {
        1: 2,
        2: 3,
        // ...
      },
      [Language.CPP]: {
        1: 2,
        2: 3,
        // ...
      },
      [Language.JAVASCRIPT]: {
        1: 2,
        2: 3,
        // ...
      },
    },
  },
};
```

---

### Step 2: Visualization Page Create Karo

1. **Folder banao:**
   ```
   src/features/questions/visualizations/YourQuestion/
   ```

2. **File copy karo:**
   - `TEMPLATE_QUESTION/TemplateQuestionVisualizationPage.tsx` ko copy karo
   - Rename karo: `YourQuestionVisualizationPage.tsx`

3. **Update karo:**
   - `TemplateQuestion` → `YourQuestion` (sab jagah)
   - `generateSteps()` function me apna algorithm logic likho
   - `visualizationContent` me apna UI likho
   - `defaultInput` structure update karo

---

### Step 3: Router Me Register Karo (`src/features/questions/pages/GenericQuestionPage.tsx`)

```typescript
import { YourQuestionVisualizationPage } from '../visualizations/YourQuestion/YourQuestionVisualizationPage';

// getVisualizationComponent function me:
const getVisualizationComponent = () => {
  switch (question.id) {
    case 1:
      return <TwoSumVisualizationPage />;
    case 2: // Your question ID
      return <YourQuestionVisualizationPage />;
    default:
      return null;
  }
};
```

---

## 🎨 Font Sizes (Two Sum Jaisa Exact)

Sab fonts same rahenge:

```typescript
// Headings
fontSize: '1.125rem'  // Approach, Steps, Complexity titles

// Body Text
fontSize: '0.9375rem'  // Explanation text, step descriptions

// Small Text
fontSize: '0.875rem'   // Step numbers, labels

// Very Small
fontSize: '0.75rem'    // Variables, data structures

// Code
fontSize: '0.7rem'     // Variable values, code snippets
```

---

## 🎨 Colors (Theme Se)

```typescript
import { themeColors } from '../../../../theme';

// Use these exact colors:
themeColors.backgroundDark      // Main background
themeColors.inputBgDark         // Input backgrounds
themeColors.textSecondary       // Secondary text
themeColors.white               // Primary text
themeColors.primary             // Accent color
themeColors.borderLight         // Borders
```

---

## 📐 Layout Structure (Two Sum Jaisa)

```typescript
// 1. Visualization Content
<Box sx={{ gap: 2, p: 2, minHeight: '50vh' }}>
  {/* Your visualization */}
</Box>

// 2. Data Structures Section
<Box sx={{
  borderTop: `1px solid ${themeColors.borderLight}`,
  backgroundColor: themeColors.inputBgDark,
  p: 1.5,
}}>
  <StepDescription />
  <Box sx={{ gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
    {/* Variables */}
    {/* Data Structure */}
  </Box>
</Box>
```

---

## ✅ Checklist

- [ ] Question data `questions.ts` me add kiya
- [ ] Visualization page folder bana
- [ ] Template se file copy ki
- [ ] `generateSteps()` function update kiya
- [ ] `visualizationContent` UI update kiya
- [ ] `defaultInput` structure set kiya
- [ ] Router me register kiya
- [ ] Fonts same hain (check karo)
- [ ] Colors theme se use kiye
- [ ] Layout structure same hai

---

## 📝 Important Notes

1. **Fonts:** Sab fonts Two Sum jaisa exact same rahenge
2. **Buttons:** `VisualizationControlBar` automatically same hoga
3. **Layout:** `VisualizationLayout` automatically same hoga
4. **Colors:** `themeColors` se sab colors same honge
5. **Spacing:** Same gap, padding use karo

---

## 🚀 Quick Start

1. Copy `TEMPLATE_QUESTION/TemplateQuestionVisualizationPage.tsx`
2. Rename to your question
3. Update `generateSteps()` - algorithm logic
4. Update `visualizationContent` - UI
5. Add question data in `questions.ts`
6. Register in router

**Done!** ✅

---

## 📊 Line Count

- **Question Data:** ~80 lines
- **Visualization Page:** ~300 lines (template se)
- **Router Registration:** ~3 lines
- **Total:** ~383 lines

**But actual new code:** ~150-200 lines (algorithm + custom UI)

