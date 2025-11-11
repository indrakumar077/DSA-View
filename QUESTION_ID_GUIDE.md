# 📋 Question ID = LeetCode Number Guide

## Rule: Question ID Must Match LeetCode Number

**Important:** Har question ki `id` aur `leetcodeNumber` same honi chahiye!

---

## ✅ Correct Structure

```typescript
export const questionsData: Record<number, QuestionData> = {
  // Key = LeetCode Number
  1: {
    id: 1,              // Must match leetcodeNumber
    leetcodeNumber: 1,  // Must match id
    title: "Two Sum",
    // ...
  },
  2: {
    id: 2,              // Must match leetcodeNumber
    leetcodeNumber: 2,  // Must match id
    title: "Add Two Numbers",
    // ...
  },
  // ...
};
```

---

## ❌ Wrong Structure

```typescript
// DON'T DO THIS:
{
  1: {
    id: 1,
    leetcodeNumber: 2,  // ❌ Mismatch!
  }
}

// DON'T DO THIS:
{
  1: {
    id: 2,              // ❌ id doesn't match key
    leetcodeNumber: 1,  // ❌ Doesn't match id
  }
}
```

---

## 📝 Adding New Question

### Step 1: Use LeetCode Number as Key

```typescript
export const questionsData: Record<number, QuestionData> = {
  // ... existing questions
  15: {  // LeetCode #15
    id: 15,              // Same as LeetCode number
    leetcodeNumber: 15,  // Same as id
    title: "3Sum",
    // ...
  },
};
```

### Step 2: URL Will Be

```
/dashboard/questions/15/description
/dashboard/questions/15/visualization
/dashboard/questions/15/explanation
```

### Step 3: Router Registration

```typescript
// GenericQuestionPage.tsx
const getVisualizationComponent = () => {
  switch (question.id) { // question.id === question.leetcodeNumber
    case 1:  // LeetCode #1
      return <TwoSumVisualizationPage />;
    case 15: // LeetCode #15
      return <ThreeSumVisualizationPage />;
    default:
      return null;
  }
};
```

---

## 🔍 How It Works

1. **URL Parameter:** `/dashboard/questions/:id`
2. **Parse ID:** `parseInt(id, 10)` → LeetCode number
3. **Lookup:** `questionsData[leetcodeNumber]`
4. **Access:** `question.id === question.leetcodeNumber`

---

## ✅ Benefits

1. **Consistent:** ID always matches LeetCode number
2. **Easy Lookup:** Direct access by LeetCode number
3. **Clear URLs:** `/questions/1` = LeetCode #1
4. **No Confusion:** One source of truth

---

## 📋 Checklist

When adding a new question:

- [ ] Use LeetCode number as Record key
- [ ] Set `id: leetcodeNumber`
- [ ] Set `leetcodeNumber: leetcodeNumber`
- [ ] Verify `id === leetcodeNumber`
- [ ] Register in router using `question.id`

---

## 🎯 Example: Adding LeetCode #15 (3Sum)

```typescript
// src/data/questions.ts
export const questionsData: Record<number, QuestionData> = {
  // ... existing
  15: {  // LeetCode #15
    id: 15,              // ✅ Matches LeetCode number
    leetcodeNumber: 15,  // ✅ Matches id
    title: "3Sum",
    // ... rest of data
  },
};

// src/features/questions/pages/GenericQuestionPage.tsx
const getVisualizationComponent = () => {
  switch (question.id) {
    case 1:
      return <TwoSumVisualizationPage />;
    case 15: // ✅ Using LeetCode number
      return <ThreeSumVisualizationPage />;
    default:
      return null;
  }
};
```

---

## ⚠️ Important Notes

1. **Always:** `id === leetcodeNumber`
2. **Always:** Use LeetCode number as Record key
3. **Always:** Register in router using `question.id`
4. **Never:** Use different values for id and leetcodeNumber

---

**Remember: Question ID = LeetCode Number! 🎯**

