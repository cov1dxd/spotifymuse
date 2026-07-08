import { spotifyGet } from './client.ts';
import { normalizeSearch, searchResponseSchema, type TrackResult } from './searchTypes.ts';

/**
 * Your most-played tracks (GET /me/top/tracks) — the personalized
 * "recommendations" source. Spotify's classic /recommendations endpoint is
 * deprecated for apps created after Nov 2024, so top tracks stand in for it.
 * The response is { items: Track[] } with the same track objects as /search,
 * so we wrap it as { tracks: { items } } and reuse that schema + normalizer.
 */

// ponytail: no limit param — default (20) is plenty and dodges the account's
// /search "Invalid limit" quirk. Bump if 20 ever feels short.
export async function getTopTracks(token: string): Promise<TrackResult[]> {
  const raw = await spotifyGet<unknown>(token, '/me/top/tracks');
  if (raw === null) return [];
  const parsed = searchResponseSchema.safeParse({ tracks: raw });
  return parsed.success ? normalizeSearch(parsed.data) : [];
}
