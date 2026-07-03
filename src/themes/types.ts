import { z } from 'zod';

/**
 * Theme contract for MUSE. Every color in the UI must come from here —
 * components never hardcode colors.
 */

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a 6-digit hex string, e.g. #1DB954');

/** Ink `borderStyle` values we allow. "rounded" from the spec maps to "round". */
export const borderStyleSchema = z.enum([
  'round',
  'single',
  'double',
  'bold',
  'classic',
]);

export const themeColorsSchema = z.object({
  background: hexColor,
  foreground: hexColor,
  primary: hexColor,
  secondary: hexColor,
  accent: hexColor,
  muted: hexColor,
  error: hexColor,
  warning: hexColor,
  success: hexColor,
});

export const themeSchema = z.object({
  name: z.string().min(1),
  border: borderStyleSchema,
  colors: themeColorsSchema,
});

export type BorderStyle = z.infer<typeof borderStyleSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type Theme = z.infer<typeof themeSchema>;

/** Semantic color keys usable throughout the UI. */
export type ColorKey = keyof ThemeColors;
