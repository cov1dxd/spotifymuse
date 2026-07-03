/** Static application metadata and shared constants. */

export const APP_NAME = 'MUSE';
export const APP_VERSION = '0.1.0';
export const APP_TAGLINE = 'A beautiful terminal Spotify client';

/**
 * Default Spotify Client ID, read from the environment (Bun auto-loads `.env`).
 * Kept out of source so the repo is safe to share — set MUSE_CLIENT_ID in your
 * local `.env`. If unset, MUSE prompts for a Client ID on first run.
 */
export const DEFAULT_CLIENT_ID = process.env.MUSE_CLIENT_ID ?? '';

/** Target frame interval for smooth animations (~60fps). */
export const FRAME_MS = 16;

/** Minimum terminal size below which we show a "resize" hint. */
export const MIN_COLS = 60;
export const MIN_ROWS = 20;
