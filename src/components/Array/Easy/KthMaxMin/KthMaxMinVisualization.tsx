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
  sortedArray?: number[];
  kthMax?: number | null;
  kthMin?: number | null;
  description: string;
  isComplete?: boolean;
  result?: { kthMax: number; kthMin: number };
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

    // Step 1: Sort the array
    steps.push({
      line: 2,
      variables: { k, "nums.length": nums.length },
      description: `Sort the array to find Kth max and min elements. K = ${k}`,
    });

    const sortedArray = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 3,
      variables: { k, sortedArray: [...sortedArray] },
      sortedArray: [...sortedArray],
      description: `Array sorted in ascending order: [${sortedArray.join(
        ", "
      )}]`,
    });

    // Step 2: Find Kth minimum (k-1 index in sorted array)
    const kthMin = sortedArray[k - 1];
    steps.push({
      line: 4,
      variables: { k, "k-1": k - 1, "sortedArray[k-1]": kthMin },
      sortedArray: [...sortedArray],
      kthMin,
      description: `Kth minimum (${k}th smallest): sortedArray[${
        k - 1
      }] = ${kthMin}`,
    });

    // Step 3: Find Kth maximum (n-k index in sorted array)
    const kthMax = sortedArray[nums.length - k];
    steps.push({
      line: 5,
      variables: {
        k,
        "nums.length - k": nums.length - k,
        "sortedArray[n-k]": kthMax,
      },
      sortedArray: [...sortedArray],
      kthMin,
      kthMax,
      description: `Kth maximum (${k}th largest): sortedArray[${
        nums.length - k
      }] = ${kthMax}`,
    });

    // Final result
    steps.push({
      line: 6,
      variables: { k, kthMax, kthMin },
      sortedArray: [...sortedArray],
      kthMax,
      kthMin,
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

    if (stepLine === 2) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /sorted\(nums\)/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /Arrays\.sort/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /sort\(/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /\.sort\(/.test(line)) {
          return i + 1;
        }
      }
    }

    if (stepLine === 3 || stepLine === 4) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /sorted_nums\[k\s*-\s*1\]/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /sorted\[k\s*-\s*1\]/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /sorted\[k\s*-\s*1\]/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /sorted\[k\s*-\s*1\]/.test(line)) {
          return i + 1;
        }
      }
    }

    if (stepLine === 5) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (
          lang === "Python" &&
          /sorted_nums\[len\(nums\)\s*-\s*k\]/.test(line)
        ) {
          return i + 1;
        }
        if (lang === "Java" && /sorted\[nums\.length\s*-\s*k\]/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /sorted\[nums\.size\(\)\s*-\s*k\]/.test(line)) {
          return i + 1;
        }
        if (
          lang === "JavaScript" &&
          /sorted\[nums\.length\s*-\s*k\]/.test(line)
        ) {
          return i + 1;
        }
      }
    }

    if (stepLine === 6) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (lang === "Python" && /return/.test(line)) {
          return i + 1;
        }
        if (lang === "Java" && /return/.test(line)) {
          return i + 1;
        }
        if (lang === "C++" && /return/.test(line)) {
          return i + 1;
        }
        if (lang === "JavaScript" && /return/.test(line)) {
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

  const sortedArray = currentStepData.sortedArray || nums;

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
                          O(n log n)
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
                          O(n)
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
                                : `1px solid ${themeColors.borderLight}`,
                              backgroundColor: isKthMax
                                ? "#10b98133"
                                : isKthMin
                                ? "#3b82f633"
                                : "transparent",
                              opacity: isKthMax || isKthMin ? 1 : 0.5,
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

                {currentStepData.sortedArray && (
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
                      Sorted Array{" "}
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
                        sorted
                      </Box>
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
                      {sortedArray.map((num, idx) => {
                        const isKthMax =
                          currentStepData.kthMax !== null &&
                          num === currentStepData.kthMax &&
                          idx === nums.length - k;
                        const isKthMin =
                          currentStepData.kthMin !== null &&
                          num === currentStepData.kthMin &&
                          idx === k - 1;

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
                                  : idx === k - 1 || idx === nums.length - k
                                  ? `2px solid ${themeColors.primary}`
                                  : `1px solid ${themeColors.borderLight}`,
                                backgroundColor: isKthMax
                                  ? "#10b98133"
                                  : isKthMin
                                  ? "#3b82f633"
                                  : idx === k - 1 || idx === nums.length - k
                                  ? `${themeColors.primary}1a`
                                  : "transparent",
                                opacity:
                                  isKthMax ||
                                  isKthMin ||
                                  idx === k - 1 ||
                                  idx === nums.length - k
                                    ? 1
                                    : 0.5,
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
                            {idx === k - 1 && (
                              <Typography
                                sx={{
                                  mt: 0.5,
                                  fontSize: "0.625rem",
                                  fontWeight: 600,
                                  color: "#3b82f6",
                                }}
                              >
                                Kth Min
                              </Typography>
                            )}
                            {idx === nums.length - k && (
                              <Typography
                                sx={{
                                  mt: 0.5,
                                  fontSize: "0.625rem",
                                  fontWeight: 600,
                                  color: "#10b981",
                                }}
                              >
                                Kth Max
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
