import { Box, Button, IconButton, Select, MenuItem, FormControl, Typography } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { themeColors } from '../../../theme';
import { VisualizationControls } from '../../../types';
import { VISUALIZATION_SPEEDS } from '../../../constants';

interface VisualizationControlBarProps extends VisualizationControls {}

export const VisualizationControlBar = ({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlayPause,
  onPrevious,
  onNext,
  onSpeedChange,
  onCustomInput,
}: VisualizationControlBarProps) => {
  return (
    <>
      <IconButton
        onClick={onPrevious}
        disabled={currentStep === 0}
        size="small"
        sx={{
          color: themeColors.white,
          '&:hover': {
            backgroundColor: `${themeColors.white}1a`,
          },
          '&:disabled': {
            color: `${themeColors.white}40`,
          },
        }}
      >
        <SkipPrevious fontSize="small" />
      </IconButton>
      <IconButton
        onClick={onPlayPause}
        size="small"
        sx={{
          color: themeColors.white,
          '&:hover': {
            backgroundColor: `${themeColors.white}1a`,
          },
          '&:disabled': {
            color: `${themeColors.white}40`,
          },
        }}
      >
        {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
      </IconButton>
      <IconButton
        onClick={onNext}
        disabled={currentStep >= totalSteps - 1}
        size="small"
        sx={{
          color: themeColors.white,
          '&:hover': {
            backgroundColor: `${themeColors.white}1a`,
          },
          '&:disabled': {
            color: `${themeColors.white}40`,
          },
        }}
      >
        <SkipNext fontSize="small" />
      </IconButton>

      <FormControl size="small">
        <Select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          sx={{
            backgroundColor: themeColors.borderLight,
            color: themeColors.white,
            fontSize: '0.8125rem',
            fontFamily: 'monospace',
            minWidth: 60,
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
          {VISUALIZATION_SPEEDS.map((speedValue) => (
            <MenuItem key={speedValue} value={speedValue}>
              {speedValue}x
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {onCustomInput && (
        <Button
          onClick={onCustomInput}
          size="small"
          variant="outlined"
          sx={{
            color: themeColors.white,
            textTransform: 'none',
            fontSize: '0.875rem',
            borderColor: themeColors.borderLight,
            padding: '4px 12px',
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: `${themeColors.white}1a`,
              borderColor: themeColors.primary,
            },
            '&:disabled': {
              color: `${themeColors.white}40`,
              borderColor: `${themeColors.borderLight}40`,
            },
          }}
        >
          Custom Input
        </Button>
      )}
    </>
  );
};

