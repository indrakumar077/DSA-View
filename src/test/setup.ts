import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock MUI icons to avoid file system issues
vi.mock('@mui/icons-material', () => ({
  ArrowBack: () => 'ArrowBack',
  PlayArrow: () => 'PlayArrow',
  Pause: () => 'Pause',
  SkipPrevious: () => 'SkipPrevious',
  SkipNext: () => 'SkipNext',
  Code: () => 'Code',
  Article: () => 'Article',
  Home: () => 'Home',
  Description: () => 'Description',
}));

