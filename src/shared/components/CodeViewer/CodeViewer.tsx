import { useMemo, ReactNode } from 'react';
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { themeColors } from '../../../theme';
import { questionsData } from '../../../data/questions';
import { Language, SUPPORTED_LANGUAGES } from '../../../constants';

interface CodeViewerProps {
  questionId: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  highlightedLine: number;
  controls?: ReactNode;
}

export const CodeViewer = ({
  questionId,
  language,
  onLanguageChange,
  highlightedLine,
  controls,
}: CodeViewerProps) => {
  const question = questionsData[questionId];
  const code =
    question?.codes?.[language] ||
    question?.codes?.[Language.PYTHON] ||
    '';

  const codeLines = useMemo(() => {
    return code.split('\n');
  }, [code]);

  return (
    <>
      <Box
        sx={{
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${themeColors.borderLight}`,
          backgroundColor: themeColors.inputBgDark,
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FormControl size="small">
            <Select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              sx={{
                backgroundColor: themeColors.borderLight,
                color: themeColors.white,
                fontSize: '0.8125rem',
                minWidth: 90,
                height: 28,
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSvgIcon-root': {
                  color: themeColors.white,
                  fontSize: '1rem',
                },
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {controls && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {controls}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1.5,
        }}
      >
        <Box
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightedLine === lineNum;

            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  backgroundColor: isHighlighted ? `${themeColors.primary}1a` : 'transparent',
                  borderLeft: isHighlighted
                    ? `3px solid ${themeColors.primary}`
                    : '3px solid transparent',
                  pl: isHighlighted ? 1 : 1.5,
                  py: 0.4,
                  transition: 'all 0.2s ease',
                }}
              >
                <Typography
                  sx={{
                    color: themeColors.textSecondary,
                    minWidth: 35,
                    fontSize: '0.65rem',
                    userSelect: 'none',
                  }}
                >
                  {lineNum}
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    color: isHighlighted ? themeColors.white : themeColors.textSecondary,
                    fontWeight: isHighlighted ? 600 : 400,
                    flex: 1,
                    margin: 0,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre',
                    overflow: 'visible',
                  }}
                >
                  {line || ' '}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

