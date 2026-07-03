import React, { createContext, type ReactNode } from 'react';
import { getTheme, type Theme } from '../themes/index.ts';

/**
 * Provides the active theme to the component tree. Components read colors via
 * the `useTheme` hook — never by importing palettes directly.
 */

export const ThemeContext = createContext<Theme>(getTheme('catppuccin'));

interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps): React.JSX.Element {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
