# 📝 Question Add Karne Me Kitne Lines?

## Quick Answer:

### **Without Visualization (Simple Question):**
**~50-80 lines** - Sirf question data add karna

### **With Visualization (Full Question):**
**~250-400 lines** - Question data + Visualization page

---

## Detailed Breakdown:

### 1. **Question Data Only** (`src/data/questions.ts`)
**Lines: ~50-80**

```typescript
// Minimum required fields
{
  id: 2,
  title: "Question Title",
  description: "Problem description...",
  examples: [
    { input: "...", output: "..." }
  ],
  constraints: ["..."],
  tags: [Tag.ARRAY],
  difficulty: Difficulty.EASY,
  topic: Topic.ARRAYS,
  
  // Optional but recommended
  codes: {
    [Language.PYTHON]: `...`,
    [Language.JAVA]: `...`,
    // ...
  },
  explanation: {
    approach: "...",
    steps: ["..."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
}
```

**Time:** 5-10 minutes

---

### 2. **With Visualization Page** (`src/features/questions/visualizations/YourQuestion/`)
**Lines: ~200-350**

#### A. **Visualization Page** (`YourQuestionVisualizationPage.tsx`)
**Lines: ~200-300**

**Reusable parts (already done):**
- Imports (~15 lines) - reusable components
- State management (~20 lines) - standard hooks
- Layout wrapper (~30 lines) - VisualizationLayout

**Custom parts (you need to write):**
- `generateSteps()` function (~50-150 lines) - algorithm logic
- Visualization rendering (~50-100 lines) - UI for your specific problem
- Custom input handling (~20-30 lines) - if needed

#### B. **Router Registration** (if needed)
**Lines: ~5-10**

```typescript
// GenericQuestionPage.tsx me automatically handle ho jata hai
// But agar custom routing chahiye to:
import { YourQuestionVisualizationPage } from '../visualizations/YourQuestion/YourQuestionVisualizationPage';
```

**Time:** 30-60 minutes (depending on complexity)

---

## Example: Two Sum Question

### Question Data: ~100 lines
- Basic info: ~20 lines
- Codes (4 languages): ~40 lines
- Explanation: ~20 lines
- Line mappings: ~20 lines

### Visualization Page: ~770 lines
- But most is reusable!
- **Actual custom code:** ~200-300 lines
  - `generateSteps()`: ~100 lines
  - Visualization UI: ~100 lines
  - Rest is reusable components

---

## Simplest Question (No Visualization):

**Just add to `questions.ts`:**

```typescript
2: {
  id: 2,
  title: "Simple Question",
  description: "Description here",
  examples: [{ input: "...", output: "..." }],
  constraints: ["..."],
  tags: [Tag.ARRAY],
  difficulty: Difficulty.EASY,
  topic: Topic.ARRAYS,
}
```

**Lines: ~15-20 lines** ✅

---

## Most Complex Question (Full Visualization):

1. **Question Data:** ~80 lines
2. **Visualization Page:** ~300 lines
3. **Total:** ~380 lines

**But remember:**
- Most components are reusable
- You're mainly writing algorithm logic
- UI components already exist

---

## Tips to Reduce Lines:

1. ✅ **Use Reusable Components** - Already done!
2. ✅ **Copy from TwoSum** - Template ready
3. ✅ **Focus on Algorithm** - UI is handled
4. ✅ **Use Enums** - Type safety, less code

---

## Realistic Estimate:

**Average Question:**
- **Data:** 60 lines
- **Visualization:** 250 lines
- **Total:** ~310 lines

**But actual new code you write:**
- **Data:** 60 lines (all new)
- **Visualization:** ~150 lines (algorithm + custom UI)
- **Total:** ~210 lines of actual new code

---

## Summary:

| Type | Lines | Time |
|------|-------|------|
| Simple Question (no viz) | 15-20 | 5 min |
| Question with Data | 50-80 | 10 min |
| Question + Visualization | 250-400 | 30-60 min |

**Most questions will be: ~250-350 lines total** 🎯

