import { z } from 'zod';

/** User playlists (GET /me/playlists). */

export interface Playlist {
  id: string;
  name: string;
  uri: string;
  trackCount: number;
  owner: string;
}

const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
  tracks: z.object({ total: z.number() }).nullable().optional(),
  owner: z.object({ display_name: z.string().nullable().optional() }).nullable().optional(),
});

export const playlistsResponseSchema = z.object({
  items: z.array(playlistSchema.nullable()).default([]),
});

export type PlaylistsResponse = z.infer<typeof playlistsResponseSchema>;

export function normalizePlaylists(res: PlaylistsResponse): Playlist[] {
  const out: Playlist[] = [];
  for (const p of res.items) {
    if (!p) continue;
    out.push({
      id: p.id,
      name: p.name,
      uri: p.uri,
      trackCount: p.tracks?.total ?? 0,
      owner: p.owner?.display_name ?? '',
    });
  }
  return out;
}
