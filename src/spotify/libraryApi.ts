import { spotifyGet } from './client.ts';
import { normalizePlaylists, playlistsResponseSchema, type Playlist } from './libraryTypes.ts';

/** Lists the user's playlists (GET /me/playlists). */
export async function getPlaylists(token: string): Promise<Playlist[]> {
  const raw = await spotifyGet<unknown>(token, '/me/playlists', { query: { limit: 50 } });
  if (raw === null) return [];
  const parsed = playlistsResponseSchema.safeParse(raw);
  return parsed.success ? normalizePlaylists(parsed.data) : [];
}
