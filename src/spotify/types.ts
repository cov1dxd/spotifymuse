import { z } from 'zod';

/** Spotify OAuth + Web API shapes we depend on, validated at the boundary. */

/**
 * Loopback redirect. Spotify allows the literal IP 127.0.0.1 (but NOT the word
 * "localhost"). MUSE runs a one-shot local server on this port to catch the
 * callback — no handler app or custom scheme needed. See spotify/callbackServer.ts.
 *
 * Add this exact value as a redirect URI in your Spotify app dashboard.
 */
export const REDIRECT_PORT = 8888;
export const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`;

export const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-private',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
] as const;

/** Raw token payload returned by Spotify's /api/token endpoint. */
export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;

/** Persisted token set, with an absolute expiry timestamp (ms since epoch). */
export const storedTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  scope: z.string().optional(),
});

export type StoredTokens = z.infer<typeof storedTokensSchema>;
