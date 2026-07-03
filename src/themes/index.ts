import { themeSchema, type Theme } from './types.ts';
import * as palettes from './palettes.ts';

/**
 * Theme registry. Palettes are validated once at module load; an invalid
 * palette fails loudly here rather than corrupting the UI at render time.
 */

const registry: Record<string, Theme> = {};

for (const value of Object.values(palettes)) {
  const parsed = themeSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error(
      `Invalid built-in theme "${(value as Theme).name ?? 'unknown'}": ${parsed.error.message}`,
    );
  }
  registry[parsed.data.name] = parsed.data;
}

export const DEFAULT_THEME = 'catppuccin';

export function getTheme(name: string): Theme {
  return registry[name] ?? registry[DEFAULT_THEME]!;
}

export function listThemes(): string[] {
  return Object.keys(registry).sort();
}

export type { Theme, ColorKey, ThemeColors, BorderStyle } from './types.ts';
