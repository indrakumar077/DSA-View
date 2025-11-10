# Algorithm Visualization Platform

> Interactive step-by-step algorithm visualizations with live code execution, syntax highlighting, and animated state tracking.

<div align="center">

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Features

- **🎬 Step-by-Step Execution** - Play, pause, step forward/backward through algorithm execution
- **💻 Live Code Highlighting** - See which line of code is executing in real-time  
- **🎨 Visual State Tracking** - Arrays, variables, and data structures visualized with color-coding
- **📖 Detailed Explanations** - English explanations for each execution step
- **⚙️ Custom Test Cases** - Input your own data and watch the algorithm adapt
- **🎯 Professional UI/UX** - Modern design with smooth CSS animations
- **🎨 Centralized Theme System** - 70+ CSS variables for consistent colors across all visualizations

---

## 🚀 Currently Implemented

### 1. Two Sum Problem
- **Language**: Java
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)
- **Approach**: HashMap for O(1) lookups

**Features:**
- ✅ HashMap state visualization
- ✅ Current element highlighting  
- ✅ Solution detection with celebration animation
- ✅ Custom array and target input
- ✅ Variable tracking (i, nums[i], complement, target)
- ✅ Auto-scroll to solution with indicator arrow

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18.3** | UI framework with hooks |
| **TypeScript 5.5** | Type safety and better DX |
| **Vite 5.4** | Fast build tool and dev server |
| **CSS3** | Pure CSS animations (no libraries!) |
| **Custom Theme System** | 70+ CSS variables + React Context |

---

## 📁 Project Structure

```
Animation/
├── src/
│   ├── components/
│   │   └── TwoSum/
│   │       ├── TwoSumAnimation3D.tsx    # Main component
│   │       └── TwoSumAnimation3D.css    # Themed styles
│   │
│   ├── theme/                           # Centralized theme system
│   │   ├── colors.ts                    # TypeScript definitions
│   │   ├── theme.css                    # 70+ CSS variables
│   │   ├── ThemeProvider.tsx            # React Context
│   │   ├── index.ts                     # Exports
│   │   └── README.md                    # Theme docs
│   │
│   ├── App.tsx                          # Root component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles
│
├── DEVELOPMENT_GUIDE.md                 # Complete dev guide (50+ pages)
├── COLOR_REFERENCE.md                   # Quick color reference
├── README.md                            # This file
├── package.json
└── vite.config.ts
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project
cd Animation

# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev

# Open browser at http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🎮 How to Use

### Basic Controls

| Control | Action |
|---------|--------|
| **Play** | Start automatic stepping |
| **Pause** | Pause automatic stepping |
| **Next** | Step forward one execution step |
| **Previous** | Step backward one execution step |
| **Reset** | Return to initial state |
| **Speed Slider** | Adjust animation speed (1x-7x) |

### Custom Test Cases

1. Click "Custom Test Case" button in header
2. Enter comma-separated array: `2, 7, 11, 15`
3. Enter target value: `9`
4. Click "Apply & Run"
5. Watch your custom input animate!

---

## 🎨 Color Coding Guide

### Array Elements

| Color | State | Meaning |
|-------|-------|---------|
| 🔵 **Blue/Cyan** | Current | Element being examined right now |
| 🟢 **Green** | Solution | Part of the final answer |
| 🟡 **Yellow** | Complement | Element being searched for |
| ⚫ **Gray** | Visited | Already processed |
| 🔲 **Dark** | Default | Not yet visited |

### Code Syntax

| Color | Type | Examples |
|-------|------|----------|
| 🟣 **Purple** | Keywords | `if`, `for`, `return`, `new` |
| 🟡 **Yellow** | Types | `int`, `HashMap`, `String` |
| 🔵 **Cyan** | Classes | `Solution`, `ArrayList` |
| 🔷 **Blue** | Methods | `twoSum`, `containsKey` |
| 🟠 **Orange** | Numbers | `0`, `1`, `42` |
| ⚫ **Gray** | Comments | `// comment` |

---

## 🎨 Theme System

All colors are managed through a centralized theme system with **70+ CSS variables**.

### Using Theme Colors

**In CSS:**
```css
.my-element {
  color: var(--text-cyan);
  background: var(--bg-secondary);
  border: 2px solid var(--border-cyan);
}

.array-element.current {
  background: var(--state-current-bg);
  border-color: var(--state-current-border);
}
```

**In React:**
```typescript
import { useTheme } from './theme'

function MyComponent() {
  const { colors } = useTheme()
  return <div style={{ color: colors.text.cyan }}>Content</div>
}
```

### Changing Colors Globally

Edit `src/theme/theme.css`:
```css
:root {
  /* Change primary cyan everywhere */
  --color-primary-cyan: #00bcd4; /* New color! */
}
```

All components update automatically! ✨

---

## 📚 Documentation

### For Users
- **This README** - How to use the application

### For Developers / AI Agents

| Document | Purpose | Size |
|----------|---------|------|
| **[DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)** | Complete blueprint for creating new algorithms | 50+ pages |
| **[COLOR_REFERENCE.md](COLOR_REFERENCE.md)** | Quick reference for all 70+ colors | Visual guide |
| **[src/theme/README.md](src/theme/README.md)** | Theme system documentation | Technical |

#### What's in DEVELOPMENT_GUIDE.md?

- ✅ Complete architecture explanation
- ✅ File structure breakdown
- ✅ Theme system deep dive (70+ CSS variables)
- ✅ Component structure patterns
- ✅ State management patterns
- ✅ Step generation logic
- ✅ Animation implementation
- ✅ **Step-by-step guide for new algorithms**
- ✅ Code snippets & examples
- ✅ Best practices & anti-patterns
- ✅ Quick start checklist
- ✅ Common issues & solutions

#### What's in COLOR_REFERENCE.md?

- ✅ All 70+ CSS variables with descriptions
- ✅ Visual examples for each color
- ✅ Use cases and when to use each color
- ✅ Common patterns (array states, panels, buttons)
- ✅ Color decision trees
- ✅ How to change colors globally

---

## 🤖 For AI Agents / Developers

Want to create similar visualizations for other algorithms? We've documented **everything**!

### Quick Start

1. **Read** `DEVELOPMENT_GUIDE.md` (complete blueprint with code examples)
2. **Reference** `COLOR_REFERENCE.md` (70+ color variables explained)
3. **Study** `src/components/TwoSum/` (working example)
4. **Follow** the step-by-step guide in DEVELOPMENT_GUIDE.md
5. **Use** the theme system for consistent colors

### What You'll Get

- ✅ Exact file structure to follow
- ✅ TypeScript interfaces & types
- ✅ State management patterns
- ✅ Step generation algorithm
- ✅ JSX structure (2-column layout)
- ✅ CSS patterns with theme variables
- ✅ Animation keyframes
- ✅ Control handlers (play, pause, step, reset)
- ✅ Custom input handling
- ✅ Complete code snippets ready to adapt

### Example: Creating Bubble Sort

The guide includes a **complete example** of creating a Bubble Sort visualization from scratch with:
- TypeScript interfaces
- Step generation logic
- Array visualization JSX
- CSS with theme variables
- Animation states

---

## 🎓 Features Implemented (Detailed)

### Core Functionality
- ✅ Step-by-step execution with play/pause
- ✅ Forward/backward stepping
- ✅ Reset to initial state
- ✅ Adjustable speed (1x to 7x)
- ✅ Custom test case input
- ✅ Input validation & error messages

### Visualization
- ✅ Syntax-highlighted code display
- ✅ Active line highlighting with glow
- ✅ Color-coded array elements
- ✅ HashMap state tracking
- ✅ Real-time variable display
- ✅ Solution detection & celebration

### UI/UX
- ✅ Two-column responsive layout
- ✅ Smooth CSS animations
- ✅ Auto-scroll to solution
- ✅ Bouncing scroll indicator (⬇)
- ✅ Professional gradient backgrounds
- ✅ Custom scrollbars
- ✅ Glassmorphism effects
- ✅ Hover & focus states

### Developer Experience
- ✅ TypeScript for type safety
- ✅ Centralized theme (70+ variables)
- ✅ Reusable component patterns
- ✅ Well-documented codebase
- ✅ Complete development guide
- ✅ Color reference guide

---

## 🛣️ Roadmap

### Planned Algorithms

**Sorting:**
- [ ] Bubble Sort
- [ ] Merge Sort
- [ ] Quick Sort
- [ ] Insertion Sort

**Searching:**
- [ ] Binary Search
- [ ] Linear Search
- [ ] Jump Search

**Graph Algorithms:**
- [ ] Breadth-First Search (BFS)
- [ ] Depth-First Search (DFS)
- [ ] Dijkstra's Algorithm
- [ ] Kruskal's Algorithm

**Dynamic Programming:**
- [ ] Fibonacci Sequence
- [ ] Knapsack Problem
- [ ] Longest Common Subsequence
- [ ] Coin Change Problem

**Tree Algorithms:**
- [ ] Tree Traversals (Inorder, Preorder, Postorder)
- [ ] Binary Search Tree Operations

### Planned Features
- [ ] Dark/Light theme toggle
- [ ] Multiple programming languages (Python, C++, JavaScript)
- [ ] Export visualization as GIF/Video
- [ ] Share test cases via URL
- [ ] Algorithm complexity analysis panel
- [ ] Side-by-side algorithm comparison
- [ ] Bookmark favorite algorithms
- [ ] Progress tracking

---

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- Add a new algorithm visualization
- Improve existing animations
- Fix bugs
- Enhance documentation
- Suggest features

**How to contribute:**
1. Fork the repository
2. Read `DEVELOPMENT_GUIDE.md`
3. Create your feature branch
4. Use the theme system for consistent colors
5. Follow the established patterns
6. Submit a pull request

---

## 📄 License

MIT License - Feel free to use for educational purposes!

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For blazing fast dev experience  
- **TypeScript Team** - For type safety

---

## 📞 Support

Having issues or questions?

- 📖 Read the [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- 🎨 Check [COLOR_REFERENCE.md](COLOR_REFERENCE.md)
- 💬 Open an issue on GitHub
- 📧 Contact the maintainers

---

<div align="center">

**Built with ❤️ using React + TypeScript + Vite**

⭐ Star this repo if you find it helpful!

</div>




