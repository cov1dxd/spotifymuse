import { spotifyGet } from './client.ts';
import { normalizeSearch, searchResponseSchema, type TrackResult } from './searchTypes.ts';

/**
 * Searches Spotify for tracks matching `query`.
 *
 * Note: we intentionally omit the `limit` param — Spotify's /search rejects it
 * with 400 "Invalid limit" for this app/token (even documented values 1–50),
 * so we take the default (~20 results), which is plenty for the picker.
 */
export async function searchTracks(token: string, query: string): Promise<TrackResult[]> {
  const raw = await spotifyGet<unknown>(token, '/search', {
    query: { q: query, type: 'track' },
  });
  if (raw === null) return [];
  const parsed = searchResponseSchema.safeParse(raw);
  return parsed.success ? normalizeSearch(parsed.data) : [];
}
