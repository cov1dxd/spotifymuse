import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeProvider.tsx';
import type { Theme } from '../themes/index.ts';

/** Access the active theme from any component. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
