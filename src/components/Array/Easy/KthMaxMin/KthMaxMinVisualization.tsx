import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import {
  ArrowBack,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  Code,
  Article,
} from "@mui/icons-material";
import { themeColors } from "../../../../theme";
import { questionsData } from "../../../../data/questions";
import { useVisualizationControls } from "../../../../contexts/VisualizationControlContext";

interface Step {
  line: number;
  i?: number;
  variables: Record<string, any>;
  minHeap?: number[];
  maxHeap?: number[];
  currentNum?: number;
  kthMax?: number | null;
  kthMin?: number | null;
  description: string;
  isComplete?: boolean;
  result?: { kthMax: number; kthMin: number };
  phase?: "findingMax" | "findingMin" | "complete";
}

const KthMaxMinVisualization = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 11;
  const question = questionsData[questionId];
  const { registerControls, unregisterControls } = useVisualizationControls();
  const [nums, setNums] = useState([7, 10, 4, 3, 20, 15]);
  const [k, setK] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState("Python");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customNums, setCustomNums] = useState("");
  const [customK, setCustomK] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Helper function to maintain min-heap
  const maintainMinHeap = (heap: number[]): number[] => {
    const result = [...heap];
    result.sort((a, b) => a - b);
    return result;
  };

  // Helper function to maintain max-heap
  const maintainMaxHeap = (heap: number[]): number[] => {
    const result = [...heap];
    result.sort((a, b) => b - a);
    return result;
  };

  const generateSteps = (nums: number[], k: number): Step[] => {
    const steps: Step[] = [];

    if (nums.length === 0) {
      steps.push({
        line: 1,
        variables: {},
        description: "Array is empty. Cannot find Kth max/min.",
        isComplete: true,
      });
      return steps;
    }

    if (k < 1 || k > nums.length) {
      steps.push({
        line: 1,
        variables: { k, "nums.length": nums.length },
        description: `K (${k}) is out of range. Must be between 1 and ${nums.length}.`,
        isComplete: true,
      });
      return steps;
    }

    // Phase 1: Find Kth Maximum using min-heap
    steps.push({
      line: 2,
      variables: { k, "nums.length": nums.length },
      phase: "findingMax",
      description: `Finding ${k}th maximum using min-heap. We'll keep the ${k} largest elements.`,
    });

    const minHeap: number[] = [];
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      minHeap.push(num);
      const heapAfterAdd = maintainMinHeap(minHeap);

      steps.push({
        line: 3,
        i,
        variables: { k, currentNum: num, "minHeap.size": heapAfterAdd.length },
        minHeap: [...heapAfterAdd],
        currentNum: num,
        phase: "findingMax",
        description: `Processing nums[${i}] = ${num}. Added to min-heap. Heap size: ${heapAfterAdd.length}`,
      });

      if (heapAfterAdd.length > k) {
        const removed = heapAfterAdd.shift(); // Remove smallest
        const heapAfterRemove = maintainMinHeap(heapAfterAdd);

        steps.push({
          line: 4,
          i,
          variables: { k, removed, "minHeap.size": heapAfterRemove.length },
          minHeap: [...heapAfterRemove],
          currentNum: num,
          phase: "findingMax",
          description: `Heap size (${heapAfterAdd.length}) > K (${k}). Removed smallest element ${removed}. Heap now contains ${k} largest elements.`,
        });
      }
    }

    const kthMax = maintainMinHeap(minHeap)[0];
    steps.push({
      line: 5,
      variables: { k, kthMax, minHeap: maintainMinHeap(minHeap) },
      minHeap: maintainMinHeap(minHeap),
      kthMax,
      phase: "findingMax",
      description: `Kth maximum found: Root of min-heap = ${kthMax} (${k}th largest element)`,
    });

    // Phase 2: Find Kth Minimum using max-heap
    steps.push({
      line: 6,
      variables: { k, kthMax },
      kthMax,
      phase: "findingMin",
      description: `Finding ${k}th minimum using max-heap. We'll keep the ${k} smallest elements.`,
    });

    const maxHeap: number[] = [];
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      maxHeap.push(num);
      const heapAfterAdd = maintainMaxHeap(maxHeap);

      steps.push({
        line: 7,
        i,
        variables: { k, currentNum: num, "maxHeap.size": heapAfterAdd.length },
        maxHeap: [...heapAfterAdd],
        currentNum: num,
        kthMax,
        phase: "findingMin",
        description: `Processing nums[${i}] = ${num}. Added to max-heap. Heap size: ${heapAfterAdd.length}`,
      });

      if (heapAfterAdd.length > k) {
        const removed = heapAfterAdd.shift(); // Remove largest
        const heapAfterRemove = maintainMaxHeap(heapAfterAdd);

        steps.push({
          line: 8,
          i,
          variables: { k, removed, "maxHeap.size": heapAfterRemove.length },
          maxHeap: [...heapAfterRemove],
          currentNum: num,
          kthMax,
          phase: "findingMin",
          description: `Heap size (${heapAfterAdd.length}) > K (${k}). Removed largest element ${removed}. Heap now contains ${k} smallest elements.`,
        });
      }
    }

    const kthMin = maintainMaxHeap(maxHeap)[0];
    steps.push({
      line: 9,
      variables: { k, kthMin, maxHeap: maintainMaxHeap(maxHeap) },
      maxHeap: maintainMaxHeap(maxHeap),
      kthMax,
      kthMin,
      phase: "findingMin",
      description: `Kth minimum found: Root of max-heap = ${kthMin} (${k}th smallest element)`,
    });

    // Final result
    steps.push({
      line: 10,
      variables: { k, kthMax, kthMin },
      minHeap: maintainMinHeap(minHeap),
      maxHeap: maintainMaxHeap(maxHeap),
      kthMax,
      kthMin,
      phase: "complete",
      description: `Result: ${k}th Maximum = ${kthMax}, ${k}th Minimum = ${kthMin}`,
      isComplete: true,
      result: { kthMax, kthMin },
    });

    return steps;
  };

  const [steps, setSteps] = useState<Step[]>(() => generateSteps(nums, k));

  useEffect(() => {
    setSteps(generateSteps(nums, k));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [nums, k]);

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

  const handleCustomInputClick = useCallback(() => {
    setShowCustomInput(true);
  }, []);

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
  }, [
    isPlaying,
    speed,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleCustomInputClick,
    registerControls,
    unregisterControls,
  ]);

  const handleCustomInput = () => {
    try {
      const numArray = customNums
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      const kValue = parseInt(customK.trim());
      if (
        numArray.length >= 1 &&
        !isNaN(kValue) &&
        kValue >= 1 &&
        kValue <= numArray.length
      ) {
        setNums(numArray);
        setK(kValue);
        setShowCustomInput(false);
        setCustomNums("");
        setCustomK("");
      }
    } catch (e) {
      console.error("Invalid input");
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  const code =
    question?.codes?.[language as keyof typeof question.codes] ||
    question?.codes?.Python ||
    "";
  const codeLines = useMemo(() => {
    return code.split("\n");
  }, [code, language]);

  const getHighlightedLine = (stepLine: number, lang: string): number => {
    const currentCode =
      question?.codes?.[lang as keyof typeof question.codes] ||
      question?.codes?.Python ||
      "";
    if (!currentCode) return -1;
    const lines = currentCode.split("\n");

    if (stepLine === 1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /if\s+not\s+nums/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /if\s*\(nums\.length\s*==\s*0\)/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /if\s*\(nums\.empty\(\)\)/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /if\s*\(nums\.length\s*===\s*0\)/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    // Line 2: Start finding max with min-heap
    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /min_heap\s*=/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /PriorityQueue.*minHeap/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /priority_queue.*minHeap/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /const\s+minHeap\s*=/.test(line)) {
          return i + 1;
        }
      }
    }

    // Line 3: Processing elements for min-heap
    if (stepLine === 3) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /for\s+num\s+in\s+nums/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /for\s*\(.*num\s*:\s*nums\)/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /for\s*\(.*num\s*:\s*nums\)/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /for\s*\(.*num\s+of\s+nums\)/.test(line)) {
          return i + 1;
        }
      }
    }

    // Line 4: Heap size check and pop
    if (stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /if\s+len\(min_heap\)\s*>\s*k/.test(line)) {
          return i + 1;
        }
        if (
          lang === "Java" &&
          /if\s*\(minHeap\.size\(\)\s*>\s*k\)/.test(line)
        ) {
          return i + 1;
        }
        if (lang === "C++" && /if\s*\(minHeap\.size\(\)\s*>\s*k\)/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /if\s*\(minHeap\.size\(\)\s*>\s*k\)/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    // Line 5: Get kth max from min-heap
    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /kth_max\s*=\s*min_heap\[0\]/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /kthMax\s*=\s*minHeap\.peek\(\)/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /kthMax\s*=\s*minHeap\.top\(\)/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /kthMax\s*=\s*minHeap\.peek\(\)/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    // Line 6: Start finding min with max-heap
    if (stepLine === 6) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /max_heap\s*=/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /PriorityQueue.*maxHeap/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /priority_queue.*maxHeap/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /const\s+maxHeap\s*=/.test(line)) {
          return i + 1;
        }
      }
    }

    // Line 7: Processing elements for max-heap
    if (stepLine === 7) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /for\s+num\s+in\s+nums/.test(line) && i > 10) {
          return i + 1;
        }
        if (
          lang === "Java" &&
          /for\s*\(.*num\s*:\s*nums\)/.test(line) &&
          i > 15
        ) {
          return i + 1;
        }
        if (
          lang === "C++" &&
          /for\s*\(.*num\s*:\s*nums\)/.test(line) &&
          i > 15
        ) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /for\s*\(.*num\s+of\s+nums\)/.test(line) &&
          i > 50
        ) {
          return i + 1;
        }
      }
    }

    // Line 8: Max-heap size check and pop
    if (stepLine === 8) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /if\s+len\(max_heap\)\s*>\s*k/.test(line)) {
          return i + 1;
        }
        if (
          lang === "Java" &&
          /if\s*\(maxHeap\.size\(\)\s*>\s*k\)/.test(line)
        ) {
          return i + 1;
        }
        if (lang === "C++" && /if\s*\(maxHeap\.size\(\)\s*>\s*k\)/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /if\s*\(maxHeap\.size\(\)\s*>\s*k\)/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    // Line 9: Get kth min from max-heap
    if (stepLine === 9) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /kth_min\s*=\s*-max_heap\[0\]/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /kthMin\s*=\s*maxHeap\.peek\(\)/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /kthMin\s*=\s*maxHeap\.top\(\)/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /kthMin\s*=\s*maxHeap\.peek\(\)/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    // Line 10: Return result
    if (stepLine === 10) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /return\s+kth_max/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /return\s+new\s+int\[\]/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /return\s+\{kthMax/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /return\s+\[kthMax/.test(line)) {
          return i + 1;
        }
      }
    }

    return -1;
  };

  const highlightedLine = getHighlightedLine(currentStepData.line, language);

  if (!steps || steps.length === 0 || !currentStepData) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101d22",
          color: "#ffffff",
        }}
      >
        <h1>Loading visualization...</h1>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: themeColors.backgroundDark,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${themeColors.borderLight}`,
          backgroundColor: themeColors.inputBgDark,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/dashboard/questions/${id}`)}
            sx={{
              color: themeColors.white,
              textTransform: "none",
              "&:hover": {
                backgroundColor: `${themeColors.white}1a`,
              },
            }}
          >
            Back
          </Button>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: themeColors.white,
            }}
          >
            DSA View
          </Typography>
        </Box>
        <Button
          onClick={() => navigate("/dashboard/questions")}
          sx={{
            color: themeColors.primary,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Dashboard
        </Button>
      </Box>

      <Box
        sx={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${themeColors.borderLight}`,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: themeColors.white,
            }}
          >
            Find Kth Max and Min Element
          </Typography>
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => setActiveTab(newValue)}
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                color: themeColors.textSecondary,
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                minHeight: 48,
                padding: "0 16px",
                "&.Mui-selected": {
                  color: themeColors.primary,
                  fontWeight: 600,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: themeColors.primary,
              },
            }}
          >
            <Tab icon={<Code />} iconPosition="start" label="Visualization" />
            <Tab icon={<Article />} iconPosition="start" label="Explanation" />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<PlayArrow />}
              onClick={() => setShowCustomInput(true)}
              sx={{
                color: themeColors.white,
                textTransform: "none",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: `${themeColors.white}1a`,
                },
              }}
            >
              Test with Custom Input
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                onClick={handlePrevious}
                disabled={currentStep === 0}
                sx={{
                  color: themeColors.white,
                  "&:hover": {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                  "&.Mui-disabled": {
                    color: `${themeColors.white}4d`,
                  },
                }}
              >
                <SkipPrevious />
              </IconButton>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  color: themeColors.white,
                  "&:hover": {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentStep >= steps.length - 1}
                sx={{
                  color: themeColors.white,
                  "&:hover": {
                    backgroundColor: `${themeColors.white}1a`,
                  },
                  "&.Mui-disabled": {
                    color: `${themeColors.white}4d`,
                  },
                }}
              >
                <SkipNext />
              </IconButton>
            </Box>
            <FormControl size="small">
              <Select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                sx={{
                  backgroundColor: themeColors.borderLight,
                  color: themeColors.white,
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  minWidth: 90,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSvgIcon-root": {
                    color: themeColors.white,
                  },
                }}
              >
                <MenuItem value={0.5}>0.5x</MenuItem>
                <MenuItem value={1}>1x</MenuItem>
                <MenuItem value={1.5}>1.5x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {activeTab === 0 ? (
            <>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  p: 4,
                  position: "relative",
                }}
              >
                {currentStepData.isComplete && currentStepData.result && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#10b981",
                        color: themeColors.white,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                        textAlign: "center",
                        animation: "pulse 0.8s ease infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { transform: "scale(1)" },
                          "50%": { transform: "scale(1.05)" },
                        },
                      }}
                    >
                      ✅ Result: {k}th Maximum = {currentStepData.result.kthMax}
                      , {k}th Minimum = {currentStepData.result.kthMin}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        backgroundColor: themeColors.inputBgDark,
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        border: `1px solid ${themeColors.borderLight}`,
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: themeColors.textSecondary,
                            mb: 0.5,
                          }}
                        >
                          Time Complexity
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: themeColors.primary,
                            fontFamily: "monospace",
                          }}
                        >
                          O(n log k)
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "1px",
                          backgroundColor: themeColors.borderLight,
                        }}
                      />
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: themeColors.textSecondary,
                            mb: 0.5,
                          }}
                        >
                          Space Complexity
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: themeColors.primary,
                            fontFamily: "monospace",
                          }}
                        >
                          O(k)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{ textAlign: "center", width: "100%", maxWidth: "800px" }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: themeColors.textSecondary,
                      mb: 1,
                    }}
                  >
                    Original Array{" "}
                    <Box
                      component="code"
                      sx={{
                        backgroundColor: themeColors.inputBgDark,
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                      }}
                    >
                      nums
                    </Box>{" "}
                    K = {k}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {nums.map((num, idx) => {
                      const isKthMax =
                        currentStepData.kthMax !== null &&
                        num === currentStepData.kthMax &&
                        currentStepData.isComplete;
                      const isKthMin =
                        currentStepData.kthMin !== null &&
                        num === currentStepData.kthMin &&
                        currentStepData.isComplete;
                      const isCurrent =
                        currentStepData.i !== undefined &&
                        idx === currentStepData.i;

                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 1.5,
                              border: isKthMax
                                ? "3px solid #10b981"
                                : isKthMin
                                ? "3px solid #3b82f6"
                                : isCurrent
                                ? "3px solid #f59e0b"
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isKthMax
                                ? "#10b98133"
                                : isKthMin
                                ? "#3b82f633"
                                : isCurrent
                                ? "#f59e0b33"
                                : "transparent",
                              opacity:
                                isKthMax || isKthMin || isCurrent ? 1 : 0.5,
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "1.125rem",
                                fontWeight: 700,
                                color: themeColors.white,
                              }}
                            >
                              {num}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontSize: "0.75rem",
                              color: themeColors.textSecondary,
                            }}
                          >
                            {idx}
                          </Typography>
                          {isCurrent && (
                            <Typography
                              sx={{
                                mt: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#f59e0b",
                              }}
                            >
                              Current
                            </Typography>
                          )}
                          {isKthMax && (
                            <Typography
                              sx={{
                                mt: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#10b981",
                              }}
                            >
                              {k}th MAX
                            </Typography>
                          )}
                          {isKthMin && (
                            <Typography
                              sx={{
                                mt: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#3b82f6",
                              }}
                            >
                              {k}th MIN
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Min-Heap for Kth Maximum */}
                {currentStepData.minHeap && currentStepData.phase && (
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      maxWidth: "800px",
                      mt: 4,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Min-Heap (for {k}th Maximum){" "}
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: themeColors.inputBgDark,
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                        }}
                      >
                        minHeap
                      </Box>
                      {currentStepData.currentNum !== undefined && (
                        <Box
                          component="span"
                          sx={{
                            ml: 2,
                            color: themeColors.primary,
                            fontSize: "0.75rem",
                          }}
                        >
                          Processing: {currentStepData.currentNum}
                        </Box>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 1,
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {currentStepData.minHeap.map((num, idx) => {
                        const isRoot = idx === 0;

                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1.5,
                                border: isRoot
                                  ? "3px solid #10b981"
                                  : `1px solid ${themeColors.borderLight}`,
                                backgroundColor: isRoot
                                  ? "#10b98133"
                                  : "transparent",
                                opacity: 1,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "1.125rem",
                                  fontWeight: 700,
                                  color: themeColors.white,
                                }}
                              >
                                {num}
                              </Typography>
                            </Box>
                            {isRoot && (
                              <Typography
                                sx={{
                                  mt: 0.5,
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  color: "#10b981",
                                }}
                              >
                                Root ({k}th Max)
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Max-Heap for Kth Minimum */}
                {currentStepData.maxHeap && currentStepData.phase && (
                  <Box
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      maxWidth: "800px",
                      mt: 4,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Max-Heap (for {k}th Minimum){" "}
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: themeColors.inputBgDark,
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                        }}
                      >
                        maxHeap
                      </Box>
                      {currentStepData.currentNum !== undefined && (
                        <Box
                          component="span"
                          sx={{
                            ml: 2,
                            color: themeColors.primary,
                            fontSize: "0.75rem",
                          }}
                        >
                          Processing: {currentStepData.currentNum}
                        </Box>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 1,
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {currentStepData.maxHeap.map((num, idx) => {
                        const isRoot = idx === 0;

                        return (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1.5,
                                border: isRoot
                                  ? "3px solid #3b82f6"
                                  : `1px solid ${themeColors.borderLight}`,
                                backgroundColor: isRoot
                                  ? "#3b82f633"
                                  : "transparent",
                                opacity: 1,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "1.125rem",
                                  fontWeight: 700,
                                  color: themeColors.white,
                                }}
                              >
                                {num}
                              </Typography>
                            </Box>
                            {isRoot && (
                              <Typography
                                sx={{
                                  mt: 0.5,
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  color: "#3b82f6",
                                }}
                              >
                                Root ({k}th Min)
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  borderTop: `1px solid ${themeColors.borderLight}`,
                  backgroundColor: themeColors.inputBgDark,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: currentStepData.isComplete
                      ? "#10b98133"
                      : themeColors.backgroundDark,
                    borderLeft: currentStepData.isComplete
                      ? "3px solid #10b981"
                      : `3px solid ${themeColors.primary}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: currentStepData.isComplete
                        ? "#10b981"
                        : themeColors.white,
                      fontWeight: currentStepData.isComplete ? 700 : 500,
                    }}
                  >
                    {currentStepData.description}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: themeColors.white,
                    mb: 1.5,
                  }}
                >
                  Variables
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        backgroundColor: themeColors.backgroundDark,
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        minHeight: 60,
                        maxHeight: 200,
                        overflow: "auto",
                      }}
                    >
                      {Object.keys(currentStepData.variables).length > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          {Object.entries(currentStepData.variables).map(
                            ([key, value]) => (
                              <Box
                                key={key}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  backgroundColor: `${themeColors.primary}1a`,
                                  padding: "4px 12px",
                                  borderRadius: 1,
                                  border: `1px solid ${themeColors.primary}33`,
                                }}
                              >
                                <Typography
                                  sx={{ color: themeColors.textSecondary }}
                                >
                                  {key}:
                                </Typography>
                                <Typography
                                  sx={{
                                    color: themeColors.white,
                                    fontWeight: 600,
                                  }}
                                >
                                  {Array.isArray(value)
                                    ? `[${value.join(", ")}]`
                                    : String(value)}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            color: themeColors.textSecondary,
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                          }}
                        >
                          No variables yet
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: themeColors.white,
                    mb: 1.5,
                    mt: 2,
                  }}
                >
                  Current Values
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Kth Maximum
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: themeColors.backgroundDark,
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        border: `1px solid #10b98133`,
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            currentStepData.kthMax !== null
                              ? "#10b981"
                              : themeColors.textSecondary,
                          fontWeight: 600,
                        }}
                      >
                        {currentStepData.kthMax !== null
                          ? currentStepData.kthMax
                          : "Not set"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: themeColors.textSecondary,
                        mb: 1,
                      }}
                    >
                      Kth Minimum
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: themeColors.backgroundDark,
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                        border: `1px solid #3b82f633`,
                      }}
                    >
                      <Typography
                        sx={{
                          color:
                            currentStepData.kthMin !== null
                              ? "#3b82f6"
                              : themeColors.textSecondary,
                          fontWeight: 600,
                        }}
                      >
                        {currentStepData.kthMin !== null
                          ? currentStepData.kthMin
                          : "Not set"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 4,
              }}
            >
              {question?.explanation && (
                <>
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 3,
                    }}
                  >
                    Approach
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: themeColors.textSecondary,
                      mb: 4,
                      lineHeight: 1.8,
                    }}
                  >
                    {question.explanation.approach}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: themeColors.white,
                      mb: 3,
                    }}
                  >
                    Steps
                  </Typography>
                  <Box component="ol" sx={{ pl: 3, mb: 4 }}>
                    {question.explanation.steps.map((step, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        sx={{
                          fontSize: "1rem",
                          color: themeColors.textSecondary,
                          mb: 2,
                          lineHeight: 1.8,
                        }}
                      >
                        {step}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: themeColors.textSecondary,
                          mb: 0.5,
                        }}
                      >
                        Time Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: themeColors.primary,
                          fontFamily: "monospace",
                        }}
                      >
                        {question.explanation.timeComplexity}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: themeColors.textSecondary,
                          mb: 0.5,
                        }}
                      >
                        Space Complexity
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: themeColors.primary,
                          fontFamily: "monospace",
                        }}
                      >
                        {question.explanation.spaceComplexity}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {activeTab === 0 ? (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              borderLeft: `1px solid ${themeColors.borderLight}`,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 48,
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${themeColors.borderLight}`,
                px: 2,
              }}
            >
              <FormControl size="small">
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    backgroundColor: themeColors.borderLight,
                    color: themeColors.white,
                    fontSize: "0.875rem",
                    minWidth: 100,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      color: themeColors.white,
                    },
                  }}
                >
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 2,
              }}
            >
              <Box
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = highlightedLine === lineNum;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        backgroundColor: isHighlighted
                          ? `${themeColors.primary}33`
                          : "transparent",
                        borderLeft: isHighlighted
                          ? `2px solid ${themeColors.primary}`
                          : "none",
                        pl: isHighlighted ? 1 : 0,
                        py: 0.25,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          textAlign: "right",
                          pr: 2,
                          color: themeColors.textSecondary,
                          flexShrink: 0,
                          fontSize: "0.75rem",
                        }}
                      >
                        {lineNum}
                      </Box>
                      <Box
                        component="pre"
                        sx={{
                          margin: 0,
                          color: themeColors.white,
                          whiteSpace: "pre",
                          flex: 1,
                        }}
                      >
                        <code>{line}</code>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              borderLeft: `1px solid ${themeColors.borderLight}`,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 48,
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${themeColors.borderLight}`,
                px: 2,
              }}
            >
              <FormControl size="small">
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    backgroundColor: themeColors.borderLight,
                    color: themeColors.white,
                    fontSize: "0.875rem",
                    minWidth: 100,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      color: themeColors.white,
                    },
                  }}
                >
                  <MenuItem value="Python">Python</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 2,
              }}
            >
              <Box
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        py: 0.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          textAlign: "right",
                          pr: 2,
                          color: themeColors.textSecondary,
                          flexShrink: 0,
                          fontSize: "0.75rem",
                        }}
                      >
                        {lineNum}
                      </Box>
                      <Box
                        component="pre"
                        sx={{
                          margin: 0,
                          color: themeColors.white,
                          whiteSpace: "pre",
                          flex: 1,
                        }}
                      >
                        <code>{line}</code>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={showCustomInput}
        onClose={() => setShowCustomInput(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: themeColors.white,
            backgroundColor: themeColors.inputBgDark,
          }}
        >
          Custom Input
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: themeColors.inputBgDark }}>
          <TextField
            fullWidth
            label="Array (comma-separated)"
            value={customNums}
            onChange={(e) => setCustomNums(e.target.value)}
            placeholder="7,10,4,3,20,15"
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: themeColors.white,
                "& fieldset": {
                  borderColor: themeColors.borderLight,
                },
                "&:hover fieldset": {
                  borderColor: themeColors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeColors.textSecondary,
              },
            }}
          />
          <TextField
            fullWidth
            label="K value"
            value={customK}
            onChange={(e) => setCustomK(e.target.value)}
            placeholder="3"
            type="number"
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                color: themeColors.white,
                "& fieldset": {
                  borderColor: themeColors.borderLight,
                },
                "&:hover fieldset": {
                  borderColor: themeColors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: themeColors.textSecondary,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeColors.inputBgDark }}>
          <Button
            onClick={() => setShowCustomInput(false)}
            sx={{ color: themeColors.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCustomInput}
            sx={{ color: themeColors.primary }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KthMaxMinVisualization;
