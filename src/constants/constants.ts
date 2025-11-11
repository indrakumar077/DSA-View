/**
 * Application constants
 */

import { Language } from './enums';

export const VISUALIZATION_SPEEDS = [0.5, 1, 1.5, 2] as const;

export const SUPPORTED_LANGUAGES = [
  Language.PYTHON,
  Language.JAVA,
  Language.CPP,
  Language.JAVASCRIPT,
] as const;

export const DEFAULT_VISUALIZATION_SPEED = 1;

export const DEFAULT_LANGUAGE = Language.PYTHON;

