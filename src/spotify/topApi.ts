import { z } from 'zod';
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

const topArtistsSchema = z.object({
  items: z.array(z.object({ name: z.string() }).nullable()).default([]),
});

/** Your top artists' names — seeds for recommended-playlist search. */
export async function getTopArtists(token: string): Promise<string[]> {
  const raw = await spotifyGet<unknown>(token, '/me/top/artists');
  if (raw === null) return [];
  const parsed = topArtistsSchema.safeParse(raw);
  if (!parsed.success) return [];
  return parsed.data.items.flatMap((a) => (a ? [a.name] : []));
}
